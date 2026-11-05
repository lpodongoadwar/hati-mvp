import { NextResponse } from 'next/server';

const PESAPAL_BASE_URL = 'https://cybqa.pesapal.com/pesapalv3'; // Sandbox URL

export async function POST(req: Request) {
  try {
    const { amount, email, phone, name } = await req.json();

    // 1. AUTHENTICATION
    const authRes = await fetch(`${PESAPAL_BASE_URL}/api/Auth/RequestToken`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        consumer_key: process.env.PESAPAL_CONSUMER_KEY,
        consumer_secret: process.env.PESAPAL_CONSUMER_SECRET,
      }),
    });
    const authData = await authRes.json();
    const token = authData.token;

    if (!token) throw new Error("Failed to authenticate with Pesapal");

    // 2. REGISTER IPN (Webhook)
    // This tells Pesapal where to send the payment confirmation
    const ipnRes = await fetch(`${PESAPAL_BASE_URL}/api/URLSetup/RegisterIPN`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        url: `${process.env.NEXT_PUBLIC_APP_URL}/api/pesapal/ipn`,
        ipn_notification_type: 'GET',
      }),
    });
    const ipnData = await ipnRes.json();
    const ipnId = ipnData.ipn_id;

    // 3. SUBMIT ORDER
    const orderRes = await fetch(`${PESAPAL_BASE_URL}/api/Transactions/SubmitOrderRequest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: `hati_${Date.now()}`,
        currency: 'UGX',
        amount: amount,
        description: 'Hati Credit Score Unlock',
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
        notification_id: ipnId,
        billing_address: {
          email_address: email,
          phone_number: phone,
          first_name: name.split(' ')[0],
          last_name: name.split(' ')[1] || 'User',
        },
      }),
    });
    const orderData = await orderRes.json();

    if (!orderData.redirect_url) throw new Error("Failed to get redirect URL from Pesapal");

    // Return the URL to the frontend so we can redirect the user
    return NextResponse.json({ success: true, redirect_url: orderData.redirect_url });

  } catch (error: any) {
    console.error('Pesapal Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}