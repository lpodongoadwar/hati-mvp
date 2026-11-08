import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
// @ts-ignore
import pdf from 'pdf-parse';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // 1. Parse the PDF to extract text
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const pdfData = await pdf(buffer);
    
    // 2. Truncate text to avoid Groq's 8k TPM limit
    // 15,000 characters is roughly 3,500 - 4,000 tokens.
    const pdfText = pdfData.text.substring(0, 15000); 

    const prompt = `
      You are a financial analyst for Hati, a credit scoring platform in Uganda.
      Analyze this Mobile Money Mini Statement text and return ONLY a valid JSON object with the following fields (no markdown, no explanation, just the raw JSON):
      {
        "totalTransactions": <number of total transactions>,
        "averageMonthlyInflow": <number in UGX, no commas>,
        "averageMonthlyOutflow": <number in UGX, no commas>,
        "hasLoanRepayments": <boolean true/false>,
        "incomeConsistency": <"high", "medium", or "low">
      }

      Here is the statement text:
      ${pdfText}
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "openai/gpt-oss-120b",
      temperature: 0.1,
      max_tokens: 1000,
      response_format: { type: "json_object" },
    });

    const responseText = chatCompletion.choices[0]?.message?.content || "{}";
    const parsedData = JSON.parse(responseText);

    // --- SANITIZE DATA ---
    const inflow = Number(String(parsedData.averageMonthlyInflow).replace(/,/g, '')) || 0;
    const transactions = Number(parsedData.totalTransactions) || 0;
    const hasLoans = Boolean(parsedData.hasLoanRepayments);
    const consistency = parsedData.incomeConsistency || "low";

    // --- HATI TRUST SCORE CALCULATION (Max 850) ---
    let score = 200;

    if (transactions > 10) score += 50;
    if (transactions > 50) score += 75;
    if (transactions > 100) score += 75;

    if (inflow > 100000) score += 50;
    if (inflow > 500000) score += 100;
    if (inflow > 2000000) score += 100;

    if (consistency === "medium") score += 50;
    if (consistency === "high") score += 100;
    if (hasLoans) score += 50; 
    
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