import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { extractText, getDocumentProxy } from 'unpdf';

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
    const buffer = new Uint8Array(bytes);
    
    const pdf = await getDocumentProxy(buffer);
    const { text } = await extractText(pdf, { mergePages: true });

    const pdfText = text.substring(0, 12000); 

    const prompt = `
      You are a financial analyst for Hati, a credit scoring platform in Uganda.
      Analyze this Mobile Money Mini Statement text and return ONLY a JSON object 
      with the following fields:
      {
        "totalTransactions": number,
        "averageMonthlyInflow": number,
        "averageMonthlyOutflow": number,
        "hasLoanRepayments": boolean,
        "incomeConsistency": "high" | "medium" | "low"
      }

      Do not include any markdown formatting, backticks, or explanations. Just the raw JSON string.

      Here is the statement text:
      ${pdfText}
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "openai/gpt-oss-120b",
      temperature: 0.1,
      max_tokens: 1000,
      // REMOVED the strict response_format to bypass the json_validate_failed error
    });

    const responseText = chatCompletion.choices[0]?.message?.content || "{}";
    
    // Clean up the response in case the AI still added backticks
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedData = JSON.parse(cleanJson);

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