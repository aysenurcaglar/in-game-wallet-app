// pages/api/braintree/token.ts

import type { NextApiRequest, NextApiResponse } from "next";
import * as braintree from "braintree";
import admin from "@/lib/firebaseAdmin";

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
  // Only allow POST requests
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

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    // Optionally, use decodedToken to fetch user-specific data

    const response = await gateway.clientToken.generate({});
    res.status(200).json({ clientToken: response.clientToken });
  } catch (error) {
    console.error("Braintree Token Generation Error:", error);
    res.status(500).json({ error: "Failed to generate client token" });
  }
}
