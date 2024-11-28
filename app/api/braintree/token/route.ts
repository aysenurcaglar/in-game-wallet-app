// app/api/braintree/token/route.ts

import { NextRequest, NextResponse } from "next/server";
import * as braintree from "braintree";

// Ensure environment is correctly set
const environment =
  process.env.NEXT_PUBLIC_BRAINTREE_ENVIRONMENT === "Production"
    ? braintree.Environment.Production
    : braintree.Environment.Sandbox;

const gateway = new braintree.BraintreeGateway({
  environment,
  merchantId: process.env.BRAINTREE_MERCHANT_ID!,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY!,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY!,
});

export async function POST(req: NextRequest) {
  // Validate environment variables
  if (!process.env.BRAINTREE_MERCHANT_ID) {
    console.error("Missing Braintree Merchant ID");
    return NextResponse.json(
      { error: "Payment gateway configuration error" },
      { status: 500 }
    );
  }

  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const response = await gateway.clientToken.generate({});
    return NextResponse.json({ clientToken: response.clientToken });
  } catch (error) {
    console.error("Braintree Token Generation Error:", error);
    return NextResponse.json(
      { error: "Failed to generate client token" },
      { status: 500 }
    );
  }
}
