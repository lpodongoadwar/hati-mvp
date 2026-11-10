import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { extractText, getDocumentProxy } from 'unpdf';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js'; // We need this to check the DB

// Initialize Supabase Admin client (Server side)
// You need to add SUPABASE_SERVICE_ROLE_KEY to your Vercel env variables
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string; // We need to pass this from the frontend!

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ error: 'No user ID provided' }, { status: 400 });
    }

    // 1. Generate Hash of the PDF to prevent duplicate uploads
    const bytes = await file.arrayBuffer();
    const buffer = new Uint8Array(bytes);
    const fileHash = crypto.createHash('md5').update(buffer).digest('hex');

    // 2. Check if user already uploaded this exact file
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('statement_hash')
      .eq('id', userId)
      .single();

    if (profile?.statement_hash === fileHash) {
      return NextResponse.json({
        success: false,
        error: 'Fraud Alert: You have already uploaded this exact statement. Please provide a new one.'
      }, { status: 400 });
    }

    // 3. Parse the PDF
    const pdf = await getDocumentProxy(buffer);
    const { text } = await extractText(pdf, { mergePages: true });
    const pdfText = text.substring(0, 10000); 

    // ... (OpenAI / OpenRouter Setup here) ...
    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY || "missing-key",
    });

    const prompt = `
      You are a strict financial analyst for Hati, a credit scoring platform in Uganda.
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

    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "meta-llama/llama-3.1-8b-instruct",
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

    // --- STRICTER HATI TRUST SCORE CALCULATION (Max 850) ---
    let score = 200;

    // Pillar 1: Financial Activity (Max 150 pts)
    if (transactions > 25) score += 50;
    if (transactions > 75) score += 50;
    if (transactions > 150) score += 50;

    // Pillar 2: Income Capacity (Max 250 pts)
    if (inflow > 1000000) score += 50;
    if (inflow > 2500000) score += 100;
    if (inflow > 5000000) score += 100;

    // Pillar 3: Financial Discipline (Max 200 pts)
    if (consistency === "medium") score += 50;
    if (consistency === "high") score += 100;
    if (hasLoans) score += 50; 

    // Elite Bonus
    if (transactions > 75 && inflow > 2500000) score += 50;
    if (score > 850) score = 850;

    // 4. Save the new score AND the file hash to the database
    await supabaseAdmin
      .from('profiles')
      .update({ score: score, statement_hash: fileHash })
      .eq('id', userId);

    // 5. Log history
    await supabaseAdmin.from('score_history').insert([
      { user_id: userId, score: score }
    ]);

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