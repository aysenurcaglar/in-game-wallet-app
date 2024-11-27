// lib/firebaseAdmin.ts

import admin from "firebase-admin";

// Ensure that the Firebase Admin SDK is only initialized once
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      // Replace \n with actual newline characters in the private key
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
    // No need to include databaseURL since you're using Firestore
    // If you decide to use Realtime Database in the future, add it here
    // databaseURL: "https://your-database-name.firebaseio.com",
  });
}

export default admin;
