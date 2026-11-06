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
    
    // Force the AI to return raw JSON
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

    // Fallback logic to handle Google's 503 errors
    const modelsToTry = ['gemini-3.8-flash', 'gemini-3.5-flash', 'gemini-3.5-flash-lite'];
    let result = null;
    let lastError = null;

    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        result = await model.generateContent([
          prompt,
          { inlineData: { data: base64Pdf, mimeType: 'application/pdf' } },
        ]);
        break; 
      } catch (error: any) {
        lastError = error;
        if (!error.message.includes('503') && !error.message.includes('429')) {
          throw error;
        }
      }
    }

    if (!result) throw lastError;

    const responseText = result.response.text();
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedData = JSON.parse(cleanJson);

    // --- SANITIZE DATA (Remove commas or strings that break math) ---
    const inflow = Number(String(parsedData.averageMonthlyInflow).replace(/,/g, '')) || 0;
    const transactions = Number(parsedData.totalTransactions) || 0;
    const hasLoans = Boolean(parsedData.hasLoanRepayments);
    const consistency = parsedData.incomeConsistency || "low";

    // --- STRICTER HATI TRUST SCORE CALCULATION (Max 850) ---
    // Base score for signing up and verifying identity
    let score = 200;

    // Pillar 1: Financial Activity (Max 200 pts)
    // Shows they are active in the economy
    if (transactions > 10) score += 50;
    if (transactions > 50) score += 75;
    if (transactions > 100) score += 75;

    // Pillar 2: Income Capacity (Max 250 pts)
    // Shows they have real money moving
    if (inflow > 100000) score += 50;   // > 100k UGX
    if (inflow > 500000) score += 100;  // > 500k UGX
    if (inflow > 2000000) score += 100; // > 2M UGX

    // Pillar 3: Financial Discipline (Max 200 pts)
    // Shows they are consistent and pay back debts
    if (consistency === "medium") score += 50;
    if (consistency === "high") score += 100;
    if (hasLoans) score += 50; // Proof they can repay
    
    // Bonus: High activity + High inflow = Elite
    if (transactions > 50 && inflow > 500000) score += 50;

    // Cap at 850
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