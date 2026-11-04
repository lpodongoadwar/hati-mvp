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
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      You are a financial analyst. I am providing you with a Mobile Money Mini Statement PDF.
      Please analyze it and return ONLY a JSON object with the following structure (no markdown, no extra text):
      {
        "averageMonthlyInflow": <number>, 
        "totalTransactions": <number>,
        "loanRepayments": <number>
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

    // Calculate Score based on the parsed data
    let score = 200; // Base score
    if (parsedData.totalTransactions > 50) score += 100;
    if (parsedData.averageMonthlyInflow > 500000) score += 150;
    if (parsedData.loanRepayments > 0) score += 50;

    return NextResponse.json({ success: true, score, data: parsedData });

  } catch (error) {
    console.error('PDF Parsing Error:', error);
    return NextResponse.json({ error: 'Failed to parse PDF' }, { status: 500 });
  }
}