import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { amount, customerName, customerEmail, customerPhone } = await req.json();

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return NextResponse.json({ error: "Invalid payment amount" }, { status: 400 });
    }

    const appId = process.env.CASHFREE_APP_ID || process.env.NEXT_PUBLIC_CASHFREE_APP_ID;
    const secretKey = process.env.CASHFREE_SECRET_KEY;
    const envMode = (process.env.CASHFREE_ENV || process.env.NEXT_PUBLIC_CASHFREE_MODE || "sandbox").toLowerCase();
    const baseUrl = envMode === "production"
      ? "https://api.cashfree.com/pg"
      : "https://sandbox.cashfree.com/pg";

    // If sandbox credentials are not yet configured in .env.local, return a demo test session for development
    if (!appId || !secretKey || appId.includes("YOUR_") || appId === "TEST_APP_ID") {
      const mockOrderId = `cf_demo_${Date.now()}`;
      return NextResponse.json({
        order_id: mockOrderId,
        payment_session_id: `session_demo_${Date.now()}`,
        order_amount: Number(amount),
        order_currency: "INR",
        is_demo: true,
        message: "Running in Cashfree Demo mode. Add CASHFREE_APP_ID and CASHFREE_SECRET_KEY in .env.local for live sandbox."
      });
    }

    const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const origin = req.headers.get("origin") || "http://localhost:3000";

    const payload = {
      order_id: orderId,
      order_amount: Number(amount),
      order_currency: "INR",
      customer_details: {
        customer_id: `cust_${Date.now()}`,
        customer_name: customerName || "SamayYudh Aspirant",
        customer_email: customerEmail || "aspirant@samayyudh.com",
        customer_phone: customerPhone || "9999999999",
      },
      order_meta: {
        return_url: `${origin}/api/cashfree/verify?order_id={order_id}`,
      },
      order_note: "SamayYudh Donation / Support",
    };

    const response = await fetch(`${baseUrl}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": appId,
        "x-client-secret": secretKey,
        "x-api-version": "2023-08-01",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Cashfree API error:", data);
      return NextResponse.json(
        { 
          error: data.message || "Failed to create Cashfree order",
          details: data 
        }, 
        { status: response.status }
      );
    }

    return NextResponse.json({
      order_id: data.order_id,
      payment_session_id: data.payment_session_id,
      order_amount: data.order_amount,
      order_currency: data.order_currency,
      is_demo: false,
    });
  } catch (error: any) {
    console.error("Error creating Cashfree order:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}
