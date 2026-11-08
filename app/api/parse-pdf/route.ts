import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { extractText, getDocumentProxy } from 'unpdf';

export async function POST(req: Request) {
  try {
    // 1. Initialize OpenAI inside the route so it only runs at request time
    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY || "missing-key", 
      defaultHeaders: {
        "HTTP-Referer": "https://hati-mvp-three.vercel.app",
        "X-Title": "Hati",
      },
    });

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // 2. Parse the PDF
    const bytes = await file.arrayBuffer();
    const buffer = new Uint8Array(bytes);
    
    const pdf = await getDocumentProxy(buffer);
    const { text } = await extractText(pdf, { mergePages: true });

    const pdfText = text.substring(0, 10000); 

    const prompt = `
      You are a financial analyst for Hati, a credit scoring platform in Uganda.
      Analyze this Mobile Money Mini Statement text and return ONLY a valid JSON object 
      with the following fields (no markdown, no explanation, just the raw JSON):
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

    // 3. Call OpenRouter
    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "meta-llama/llama-3-8b-instruct",
      temperature: 0.1,
      max_tokens: 1000,
    });

    const responseText = chatCompletion.choices[0]?.message?.content || "{}";
    
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedData = JSON.parse(cleanJson);

    // --- SANITIZE DATA ---
    const inflow = Number(String(parsedData.averageMonthlyInflow).replace(/,/g, '')) || 0;
    const transactions = Number(parsedData.totalTransactions) || 0;
    const hasLoans = Boolean(parsedData.hasLoanRepayments);
    const consistency = parsedData.incomeConsistency || "low";

    // --- HATI TRUST SCORE CALCULATION ---
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