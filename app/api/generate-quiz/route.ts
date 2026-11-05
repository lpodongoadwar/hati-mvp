import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
    
    // Fallback logic for busy models
    const modelsToTry = ['gemini-3.8-flash', 'gemini-3.5-flash'];
    let result = null;
    let lastError = null;

    const prompt = `
      You are an expert financial literacy teacher in Uganda. 
      Generate a 3-question multiple-choice quiz about "${topic}".
      You MUST return ONLY a valid JSON array with this exact structure (no markdown, no formatting):
      [
        {
          "question": "The question text?",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswerIndex": 0 
        }
      ]
      The correctAnswerIndex is a number (0-3) representing the correct option. Randomize the position of the correct answer.
    `;

    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        result = await model.generateContent(prompt);
        break;
      } catch (error: any) {
        lastError = error;
        if (!error.message.includes('503')) throw error;
      }
    }

    if (!result) throw lastError;

    const responseText = result.response.text();
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedData = JSON.parse(cleanJson);

    return NextResponse.json({ success: true, quiz: parsedData });

  } catch (error: any) {
    console.error('Quiz Generation Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}