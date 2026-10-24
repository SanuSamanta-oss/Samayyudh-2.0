import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("order_id");

    if (!orderId) {
      return NextResponse.json({ error: "Missing order_id" }, { status: 400 });
    }

    // If it was a demo order
    if (orderId.startsWith("cf_demo_")) {
      return NextResponse.json({
        order_id: orderId,
        order_status: "PAID",
        is_demo: true,
      });
    }

    const appId = process.env.CASHFREE_APP_ID || process.env.NEXT_PUBLIC_CASHFREE_APP_ID;
    const secretKey = process.env.CASHFREE_SECRET_KEY;
    const envMode = (process.env.CASHFREE_ENV || process.env.NEXT_PUBLIC_CASHFREE_MODE || "sandbox").toLowerCase();
    const baseUrl = envMode === "production"
      ? "https://api.cashfree.com/pg"
      : "https://sandbox.cashfree.com/pg";

    if (!appId || !secretKey) {
      return NextResponse.json({
        order_id: orderId,
        order_status: "UNKNOWN",
        message: "Missing Cashfree credentials",
      });
    }

    const response = await fetch(`${baseUrl}/orders/${orderId}`, {
      method: "GET",
      headers: {
        "x-client-id": appId,
        "x-client-secret": secretKey,
        "x-api-version": "2023-08-01",
      },
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error verifying Cashfree order:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}
