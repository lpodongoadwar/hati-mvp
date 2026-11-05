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
      
      // Fallbacks
      const inflow = Number(data.totalInflow) || 0;
      const cashOut = Number(data.totalCashOut) || 0;
      const avgBalance = Number(data.averageBalance) || 0;
      const senders = Number(data.uniqueSenders) || 0;
      const transactions = Number(data.totalTransactions) || 0;

      // 1. Inflow (Max 200 points). 
      // Requires 2,000,000 UGX inflow to max out. (1M = 100 points)
      const inflowPoints = Math.min((inflow / 10000), 200); 
      
      // 2. Avg Balance (Max 150 points). 
      // Requires 100,000 UGX average balance to max out. (10k = 15 points)
      const balancePoints = Math.min((avgBalance / 666), 150);
      
      // 3. Unique Senders (Max 100 points). 
      // Requires 10 unique senders to max out. (1 sender = 10 points)
      const diversityPoints = Math.min(senders * 10, 100);
      
      // 4. Velocity (Max 100 points). 
      // Requires 100 transactions to max out. (1 transaction = 1 point)
      const velocityPoints = Math.min(transactions, 100);
      
      // 5. Discipline (Max 100 points). 
      // If they cash out 80%+ of inflow, they get 0 points here.
      // This prevents "pass-through" accounts from scoring high.
      const cashOutRatio = inflow > 0 ? (cashOut / inflow) : 1;
      let disciplinePoints = 0;
      if (cashOutRatio < 0.5) disciplinePoints = 100; // Kept at least 50%
      else if (cashOutRatio < 0.8) disciplinePoints = 50; // Kept at least 20%
      else disciplinePoints = 0; // Cashing out almost everything

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