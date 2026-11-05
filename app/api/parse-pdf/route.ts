import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert PDF to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Pdf = buffer.toString('base64');

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
    
    // The AI now ONLY extracts raw data. It does not calculate the score.
    const prompt = `
      You are a financial data extractor for Hati, a credit scoring platform in Uganda.
      Analyze this Mobile Money Mini Statement PDF and return ONLY a valid JSON object with the following fields (no markdown, no explanation, just the raw JSON):
      {
        "totalInflow": <number, sum of all positive amounts in UGX>,
        "totalCashOut": <number, sum of all negative amounts in UGX (absolute value)>,
        "averageBalance": <number, average of the Balance column in UGX>,
        "uniqueSenders": <number, count of unique phone numbers/names that sent money TO the user>,
        "totalTransactions": <number, total number of rows/transactions>
      }
    `;

    // The list of models to try, from most capable to most stable
    const modelsToTry = ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-1.5-flash-8b'];
    let result = null;
    let lastError = null;

    for (const modelName of modelsToTry) {
      try {
        console.log(`Attempting to parse PDF with ${modelName}...`);
        const model = genAI.getGenerativeModel({ model: modelName });
        
        result = await model.generateContent([
          prompt,
          { inlineData: { data: base64Pdf, mimeType: 'application/pdf' } },
        ]);
        
        // If we get here, it worked! Break out of the loop.
        console.log(`Successfully parsed with ${modelName}`);
        break; 
      } catch (error: any) {
        console.warn(`${modelName} failed: ${error.message}`);
        lastError = error;
        // If the error is NOT a 503 or 429, don't bother trying the next model
        if (!error.message.includes('503') && !error.message.includes('429')) {
          throw error;
        }
        // Otherwise, loop continues to the next model in the list
      }
    }

    // If all models failed, throw the last error
    if (!result) {
      throw lastError;
    }

    const responseText = result.response.text();
    // Clean up any potential markdown formatting from Gemini's response
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const stats = JSON.parse(cleanJson);

    // --- HATI TRUST SCORE CALCULATION (Strict Mathematical Formula) ---
    const calculateScore = (data: any) => {
      const base = 200;
      
      // Fallbacks in case the AI returns null/undefined for a field
      const inflow = Number(data.totalInflow) || 0;
      const cashOut = Number(data.totalCashOut) || 0;
      const avgBalance = Number(data.averageBalance) || 0;
      const senders = Number(data.uniqueSenders) || 0;
      const transactions = Number(data.totalTransactions) || 0;

      // 1. Inflow (Max 200 points)
      const inflowPoints = Math.min((inflow / 50000) * 10, 200);
      
      // 2. Avg Balance (Max 150 points)
      const balancePoints = Math.min((avgBalance / 10000) * 15, 150);
      
      // 3. Unique Senders (Max 100 points)
      const diversityPoints = Math.min(senders * 20, 100);
      
      // 4. Velocity (Max 100 points)
      const velocityPoints = Math.min((transactions / 5) * 10, 100);
      
      // 5. Discipline (Max 100 points)
      // Prevent division by zero if inflow is 0
      const cashOutRatio = inflow > 0 ? (cashOut / inflow) : 1;
      // If they cash out 100% of what comes in, they get 0 points. 
      const disciplinePoints = Math.max(0, 100 - (cashOutRatio * 100));

      const finalScore = Math.round(base + inflowPoints + balancePoints + diversityPoints + velocityPoints + disciplinePoints);

      // Cap the score at 850 max
      return Math.min(finalScore, 850);
    };

    const finalScore = calculateScore(stats);

    return NextResponse.json({ success: true, score: finalScore, data: stats });

  } catch (error: any) {
    console.error('All AI models failed to parse PDF:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'The AI is currently experiencing high demand. Please try again in a few minutes.' 
    }, { status: 500 });
  }
}