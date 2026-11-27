import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, name } = await req.json();

    if (!email || !name) {
      return NextResponse.json({ error: 'Missing email or name' }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: 'Hati <info@hatiinc.com>', // Ensure this domain is verified in Resend
      to: [email],
      subject: 'Your Hati Identity is Verified! 🛡️',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #1b4a3a;">Hi ${name.split(' ')[0]},</h2>
          <p>Great news! Your National ID has been successfully verified against our systems.</p>
          <p>Your Hati Trust Score is now fully activated, and you are one step closer to unlocking formal credit.</p>
          
          <div style="background-color: #fcfaf6; border: 1px solid #e5e1d8; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Status:</strong> <span style="color: #16a34a;">Verified ✅</span></p>
          </div>

          <p>Log in to your dashboard to see your updated status and continue building your score.</p>
          
          <a href="https://www.hatiinc.com/dashboard" style="display: inline-block; background-color: #1b4a3a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 10px;">
            Go to Dashboard
          </a>
          
          <p style="margin-top: 30px; font-size: 12px; color: #666;">
            If you have any questions, reply to this email or contact us at info@hatiinc.com.
          </p>
        </div>
      `,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}