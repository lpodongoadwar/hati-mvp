import { NextResponse } from 'next/server';
import { createClient } from '@/lib/db';
import AfricasTalking from 'africastalking';

// Initialize Africa's Talking
const credentials = {
  apiKey: process.env.AT_API_KEY as string,
  username: process.env.AT_USERNAME as string, // Use 'sandbox' for testing
};
const africastalking = AfricasTalking(credentials);
const sms = africastalking.SMS;

export async function POST(req: Request) {
  try {
    const { userId, phone } = await req.json();
    const supabase = createClient();

    // 1. Generate a 6-digit code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60000).toISOString(); // 10 mins

    // 2. Save to database
    const { error } = await supabase
      .from('profiles')
      .update({ otp_code: otpCode, otp_expires_at: expiresAt })
      .eq('id', userId);

    if (error) throw new Error(error.message);

    // 3. Send the SMS
    // Ensure the phone number is in international format (e.g., +256...)
    const formattedPhone = phone.startsWith('0') ? `+256${phone.slice(1)}` : `+256${phone}`;
    
    const options = {
      to: [formattedPhone],
      message: `Your Hati verification code is: ${otpCode}`,
      // from: 'HATI', // Uncomment ONLY if you have a registered Sender ID
    };

    await sms.send(options);
    console.log(`📱 OTP SENT TO ${formattedPhone}`);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('SMS Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}