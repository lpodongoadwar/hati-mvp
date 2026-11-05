import { NextResponse } from 'next/server';
import { createClient } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { userId, phone } = await req.json();
    const supabase = createClient();

    // 1. Generate a 6-digit code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60000).toISOString(); // 10 mins from now

    // 2. Save to database
    const { error } = await supabase
      .from('profiles')
      .update({ otp_code: otpCode, otp_expires_at: expiresAt })
      .eq('id', userId);

    if (error) throw new Error(error.message);

    // 3. TODO: Integrate Africa's Talking / Twilio here to send the SMS.
    // For now, we will just log it to the Vercel server console.
    console.log(`📱 OTP FOR ${phone}: ${otpCode}`);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}