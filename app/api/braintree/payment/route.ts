// app/api/braintree/payment/route.ts

import { NextRequest, NextResponse } from "next/server";
import * as braintree from "braintree";
import { getFirestore, doc, setDoc, increment } from "firebase/firestore";
import admin from "@/lib/firebaseAdmin";
import { db } from "@/lib/firebase";

const gateway = new braintree.BraintreeGateway({
  environment:
    process.env.NEXT_PUBLIC_BRAINTREE_ENVIRONMENT === "Production"
      ? braintree.Environment.Production
      : braintree.Environment.Sandbox,
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

  const idToken = authHeader.split("Bearer ")[1];

  let decodedToken;
  try {
    decodedToken = await admin.auth().verifyIdToken(idToken);
  } catch (error) {
    console.error("Firebase ID Token Verification Error:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { nonce, amount } = body;

  if (!nonce || !amount) {
    return NextResponse.json(
      { error: "Missing payment nonce or amount" },
      { status: 400 }
    );
  }

  try {
    // Create a transaction
    const result = await gateway.transaction.sale({
      amount: amount.toString(),
      paymentMethodNonce: nonce,
      options: {
        submitForSettlement: true,
      },
    });

    if (result.success) {
      // Record the transaction in Firestore
      const transactionRef = doc(
        db,
        "users",
        decodedToken.uid,
        "transactions",
        result.transaction.id
      );
      await setDoc(transactionRef, {
        id: result.transaction.id,
        type: "add_funds",
        amount: parseFloat(amount),
        timestamp: new Date(),
      });

      return NextResponse.json({
        success: true,
        transaction: result.transaction,
      });
    } else {
      console.error("Braintree Transaction Error:", result.message || result);
      return NextResponse.json(
        { error: result.message || "Transaction failed" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Braintree Payment Processing Error:", error);
    return NextResponse.json(
      { error: "Payment processing error" },
      { status: 500 }
    );
  }
}
