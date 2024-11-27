// pages/api/braintree/payment.ts

import type { NextApiRequest, NextApiResponse } from "next";
import * as braintree from "braintree";
import { getFirestore, doc, setDoc, increment } from "firebase/firestore";
import admin from "@/lib/firebaseAdmin";
import { db } from "@/lib/firebase";

const gateway = new braintree.BraintreeGateway({
  environment:
    braintree.Environment[
      process.env
        .NEXT_PUBLIC_BRAINTREE_ENVIRONMENT as keyof typeof braintree.Environment
    ],
  merchantId: process.env.BRAINTREE_MERCHANT_ID!,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY!,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY!,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // Authenticate the request
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const idToken = authHeader.split("Bearer ")[1];

  let decodedToken;
  try {
    decodedToken = await admin.auth().verifyIdToken(idToken);
  } catch (error) {
    console.error("Firebase ID Token Verification Error:", error);
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { nonce, amount } = req.body;

  if (!nonce || !amount) {
    return res.status(400).json({ error: "Missing payment nonce or amount" });
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

      return res
        .status(200)
        .json({ success: true, transaction: result.transaction });
    } else {
      console.error("Braintree Transaction Error:", result.message || result);
      return res
        .status(500)
        .json({ error: result.message || "Transaction failed" });
    }
  } catch (error) {
    console.error("Braintree Payment Processing Error:", error);
    return res.status(500).json({ error: "Payment processing error" });
  }
}
