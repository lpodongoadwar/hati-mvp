import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { extractText, getDocumentProxy } from 'unpdf';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY || "missing-key",
});

export async function POST(req: Request) {
  // Create the client INSIDE the handler so env vars are available at runtime, not build time
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    // 1. SECURITY FIX: Get the token from the request header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized: Missing token' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];

    // Verify the token and get the user (Server Side)
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    const userId = user.id; // Secure: We got this from the token, not the form data.

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // 2. Generate Hash of the PDF to prevent duplicate uploads
    const bytes = await file.arrayBuffer();
    const buffer = new Uint8Array(bytes);
    const fileHash = crypto.createHash('md5').update(buffer).digest('hex');

    // 3. Check if user already uploaded this exact file
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

    // 4. Parse the PDF
    const pdf = await getDocumentProxy(buffer);
    const { text } = await extractText(pdf, { mergePages: true });
    // Grab enough text to cover 1-3 months of statements
    const pdfText = text.substring(0, 15000); 

    // 5. Ask AI to extract the specific metrics you requested
    const prompt = `
      You are a strict financial analyst for Hati, a credit scoring platform in Uganda.
      Analyze this Mobile Money Mini Statement text and return ONLY a valid JSON object 
      with the following fields (no markdown, no explanation, just the raw JSON):
      {
        "totalTransactions": <number of total transactions>,
        "averageBalance": <number in UGX, no commas>,
        "totalSavings": <total amount saved, number in UGX, no commas>,
        "loanRepaymentCount": <number of times a loan was repaid>,
        "loanBorrowCount": <number of times a loan was borrowed>,
        "totalLoanVolume": <total amount borrowed, number in UGX, no commas>,
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
    
    let parsedData;
    try {
      parsedData = JSON.parse(cleanJson);
    } catch (e) {
      throw new Error("Failed to parse AI response into JSON");
    }

    // --- SANITIZE DATA ---
    const transactions = Number(parsedData.totalTransactions) || 0;
    const avgBalance = Number(String(parsedData.averageBalance).replace(/,/g, '')) || 0;
    const totalSavings = Number(String(parsedData.totalSavings).replace(/,/g, '')) || 0;
    const repaymentCount = Number(parsedData.loanRepaymentCount) || 0;
    const borrowCount = Number(parsedData.loanBorrowCount) || 0;
    const totalLoanVolume = Number(String(parsedData.totalLoanVolume).replace(/,/g, '')) || 0;
    const consistency = parsedData.incomeConsistency || "low";

    // --- STRICTER HATI TRUST SCORE CALCULATION (Max 850) ---
    let score = 200; 
    let creditFarmingPenalty = false;

    // Pillar 1: Activity (Max 100 pts)
    if (transactions > 20) score += 50;
    if (transactions > 50) score += 50;

    // Pillar 2: Average Balance (Max 300 pts) - Priority as requested
    if (avgBalance > 50000) score += 50;
    if (avgBalance > 100000) score += 100;
    if (avgBalance > 500000) score += 150;

    // Pillar 3: Savings (Max 200 pts)
    if (totalSavings > 10000) score += 50;
    if (totalSavings > 50000) score += 100;
    if (totalSavings > 200000) score += 50;

    // Pillar 4: Responsible Borrowing (Max 150 pts)
    // We only reward borrowing if they actually saved money or kept a good balance
    if (repaymentCount > 0) {
      if (avgBalance < 20000 && totalSavings < 5000 && borrowCount > 2) {
        // CREDIT FARMING DETECTED: Borrowing heavily and repaying, but no savings or balance.
        // They get less points for this.
        creditFarmingPenalty = true;
        score += 10; // Barely any points
      } else {
        // RESPONSIBLE BORROWING: They have a balance or savings, so the loan helped them
        if (repaymentCount > 2) score += 50;
        if (repaymentCount > 5) score += 100;
      }
    }

    // Pillar 5: Income Consistency (Max 100 pts)
    if (consistency === "medium") score += 50;
    if (consistency === "high") score += 100;

    // Cap the score
    if (score > 850) score = 850;

    // 6. Save the new score AND the file hash to the database
    await supabaseAdmin
      .from('profiles')
      .update({ score: score, statement_hash: fileHash })
      .eq('id', userId);

    // 7. Log history
    await supabaseAdmin.from('score_history').insert([
      { user_id: userId, score: score }
    ]);

    return NextResponse.json({ 
      success: true, 
      score, 
      creditFarmingPenalty, // Send this to the frontend so we can show a warning if needed
      data: { 
        transactions, 
        avgBalance, 
        totalSavings, 
        repaymentCount, 
        consistency 
      } 
    });

  } catch (error: any) {
    console.error('PDF Parsing Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to parse PDF' 
    }, { status: 500 });
  }
}