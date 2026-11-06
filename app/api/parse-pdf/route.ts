import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Pdf = buffer.toString('base64');

    // Initialize the NEW Google Gen AI SDK
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

    const prompt = `
      You are a financial analyst for Hati, a credit scoring platform in Uganda.
      Analyze this Mobile Money Mini Statement PDF and return ONLY a valid JSON object with the following fields (no markdown, no explanation, just the raw JSON):
      {
        "totalTransactions": <number of total transactions>,
        "averageMonthlyInflow": <number in UGX, no commas>,
        "averageMonthlyOutflow": <number in UGX, no commas>,
        "hasLoanRepayments": <boolean true/false>,
        "incomeConsistency": <"high", "medium", or "low">
      }
    `;

    const modelsToTry = ['gemini-3.8-flash', 'gemini-3.5-flash', 'gemini-3.5-flash-lite'];
    let result = null;
    let lastError = null;

    for (const modelName of modelsToTry) {
      try {
        console.log(`Attempting parse with ${modelName}...`);
        result = await ai.models.generateContent({
          model: modelName,
          contents: [
            { text: prompt },
            { inlineData: { data: base64Pdf, mimeType: 'application/pdf' } }
          ]
        });
        break; 
      } catch (error: any) {
        console.error(`${modelName} failed:`, error.message);
        lastError = error;
        // If it's not a rate limit or overload error, throw immediately
        if (!error.message.includes('503') && !error.message.includes('429')) {
          throw error;
        }
      }
    }

    if (!result) throw lastError;

    // New SDK returns text like this:
    const responseText = result.text;
    
    if (!responseText) {
       throw new Error("No text returned from Gemini");
    }

    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedData = JSON.parse(cleanJson);

    // --- SANITIZE DATA ---
    const inflow = Number(String(parsedData.averageMonthlyInflow).replace(/,/g, '')) || 0;
    const transactions = Number(parsedData.totalTransactions) || 0;
    const hasLoans = Boolean(parsedData.hasLoanRepayments);
    const consistency = parsedData.incomeConsistency || "low";

    // --- STRICTER HATI TRUST SCORE CALCULATION (Max 850) ---
    let score = 200;

    // Pillar 1: Financial Activity (Max 200 pts)
    if (transactions > 10) score += 50;
    if (transactions > 50) score += 75;
    if (transactions > 100) score += 75;

    // Pillar 2: Income Capacity (Max 250 pts)
    if (inflow > 100000) score += 50;
    if (inflow > 500000) score += 100;
    if (inflow > 2000000) score += 100;

    // Pillar 3: Financial Discipline (Max 200 pts)
    if (consistency === "medium") score += 50;
    if (consistency === "high") score += 100;
    if (hasLoans) score += 50; 
    
    // Bonus: High activity + High inflow
    if (transactions > 50 && inflow > 500000) score += 50;

    if (score > 850) score = 850;

    return NextResponse.json({ 
      success: true, 
      score, 
      data: { transactions, inflow, hasLoans, consistency } 
    });

  } catch (error: any) {
    console.error('PDF Parsing Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to parse PDF' 
    }, { status: 500 });
  }
}