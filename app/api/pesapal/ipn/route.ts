import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orderTrackingId = searchParams.get('OrderTrackingId');
  const status = searchParams.get('OrderNotificationType');

  console.log("Pesapal IPN Received:", { orderTrackingId, status });

  // In a real app, you would now call Pesapal's GetTransactionStatus API 
  // using the orderTrackingId to verify it was actually paid, and then
  // update the user's Supabase record here.

  return NextResponse.json({ success: true });
}