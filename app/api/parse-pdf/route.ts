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
    
    const prompt = `
      You are a financial analyst for Hati, a credit scoring platform in Uganda.
      Analyze this Mobile Money Mini Statement PDF and return ONLY a valid JSON object with the following fields (no markdown, no explanation, just the raw JSON):
      {
        "totalTransactions": <number of total transactions>,
        "averageMonthlyInflow": <number in UGX>,
        "averageMonthlyOutflow": <number in UGX>,
        "hasLoanRepayments": <boolean true/false>,
        "incomeConsistency": <"high", "medium", or "low">
      }
    `;

    // The list of models to try, from most capable to most stable
    const modelsToTry = ['gemini-3.8-flash', 'gemini-3.5-flash', 'gemini-3.5-flash-lite'];
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
    const parsedData = JSON.parse(cleanJson);

    // --- HATI TRUST SCORE CALCULATION (Out of 850) ---
    let score = 200;

    // Pillar 1: Financial Activity
    if (parsedData.totalTransactions > 10) score += 50;
    if (parsedData.totalTransactions > 50) score += 50;
    if (parsedData.totalTransactions > 100) score += 100;

    // Pillar 2: Income Capacity
    if (parsedData.averageMonthlyInflow > 100000) score += 50;
    if (parsedData.averageMonthlyInflow > 500000) score += 100;
    if (parsedData.averageMonthlyInflow > 2000000) score += 100;

    // Pillar 3: Financial Discipline
    if (parsedData.incomeConsistency === "medium") score += 50;
    if (parsedData.incomeConsistency === "high") score += 100;
    if (parsedData.hasLoanRepayments) score += 50;

    // Cap the score at 850 max
    if (score > 850) score = 850;

    return NextResponse.json({ success: true, score, data: parsedData });

  } catch (error: any) {
    console.error('All AI models failed to parse PDF:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'The AI is currently experiencing high demand. Please try again in a few minutes.' 
    }, { status: 500 });
  }
}