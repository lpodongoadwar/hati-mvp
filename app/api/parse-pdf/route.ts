import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

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

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
    
    // Using 1.5-flash which is the most stable for PDF parsing
   const model = genAI.getGenerativeModel({ model: 'gemini-3.8-flash' });

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

    const result = await model.generateContent([
      prompt,
      { inlineData: { data: base64Pdf, mimeType: 'application/pdf' } },
    ]);

    const responseText = result.response.text();
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedData = JSON.parse(cleanJson);

    // --- HATI TRUST SCORE CALCULATION ---
    let score = 200;

    // Activity
    if (parsedData.totalTransactions > 10) score += 50;
    if (parsedData.totalTransactions > 50) score += 50;
    if (parsedData.totalTransactions > 100) score += 100;

    // Inflow
    if (parsedData.averageMonthlyInflow > 100000) score += 50;
    if (parsedData.averageMonthlyInflow > 500000) score += 100;
    if (parsedData.averageMonthlyInflow > 2000000) score += 100;

    // Discipline
    if (parsedData.incomeConsistency === "medium") score += 50;
    if (parsedData.incomeConsistency === "high") score += 100;
    if (parsedData.hasLoanRepayments) score += 50;

    if (score > 850) score = 850;

    return NextResponse.json({ success: true, score, data: parsedData });

  } catch (error: any) {
    console.error('PDF Parsing Error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Unknown error' }, { status: 500 });
  }
}