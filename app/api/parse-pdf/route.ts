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

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
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
      {
        inlineData: {
          data: base64Pdf,
          mimeType: 'application/pdf',
        },
      },
    ]);

    const responseText = result.response.text();
    // Clean up any potential markdown formatting from Gemini's response
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedData = JSON.parse(cleanJson);

    // --- HATI TRUST SCORE CALCULATION (Out of 850) ---
    // Base Score for signing up and verifying identity
    let score = 200;

    // Pillar 1: Financial Activity (Max 200 pts)
    // We award points for volume of transactions
    if (parsedData.totalTransactions > 10) score += 50;
    if (parsedData.totalTransactions > 50) score += 50;
    if (parsedData.totalTransactions > 100) score += 100;

    // Pillar 2: Income Capacity (Max 250 pts)
    // Based on average monthly inflow
    if (parsedData.averageMonthlyInflow > 100000) score += 50;
    if (parsedData.averageMonthlyInflow > 500000) score += 100;
    if (parsedData.averageMonthlyInflow > 2000000) score += 100;

    // Pillar 3: Financial Discipline (Max 150 pts)
    // Consistency of income and loan repayment history
    if (parsedData.incomeConsistency === "medium") score += 50;
    if (parsedData.incomeConsistency === "high") score += 100;
    
    if (parsedData.hasLoanRepayments) score += 50;

    // Cap the score at 850 max
    if (score > 850) score = 850;

    return NextResponse.json({ success: true, score, data: parsedData });

    } catch (error: any) {
    console.error('PDF Parsing Error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Unknown error' }, { status: 500 });
  }
}