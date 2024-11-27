"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { auth, googleProvider, db } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function WelcomePage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      alert("Failed to login. Please check your credentials.");
    }
    setIsLoading(false);
  };

  const handleSignUp = async () => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      // Initialize user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        balance: 0,
        transactions: [],
      });
      router.push("/dashboard");
    } catch (error) {
      console.error("Sign Up error:", error);
      alert("Failed to sign up. Please try again.");
    }
    setIsLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      // Check if user data exists in Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          balance: 0,
          transactions: [],
        });
      }
      router.push("/dashboard");
    } catch (error) {
      console.error("Google Sign-In error:", error);
      alert("Failed to sign in with Google.");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-400 to-blue-500 flex justify-center py-24">
      <Card className="w-full h-fit max-w-lg bg-white/10 backdrop-blur-md text-white">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-yellow-300">
            Welcome to Magical Realm Wallet
          </CardTitle>
          <CardDescription className="text-center text-yellow-100">
            Login or sign up to access your magical funds
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-yellow-200">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/20 text-white placeholder:text-white/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-yellow-200">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="bg-white/20 text-white placeholder:text-white/50"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="flex flex-row space-x-4 w-full">
            <Button
              onClick={handleLogin}
              disabled={isLoading}
              className="flex-1 bg-yellow-400 text-purple-900 hover:bg-yellow-300"
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            <Button
              onClick={handleSignUp}
              disabled={isLoading}
              variant="outline"
              className="flex-1 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-purple-900"
            >
              {isLoading ? "Signing up..." : "Sign Up"}
            </Button>
          </div>
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-yellow-400/30" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="px-2 text-yellow-200">Or continue with</span>
            </div>
          </div>
          <Button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            variant="outline"
            className="w-full border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-purple-900"
          >
            <svg
              className="mr-2 h-4 w-4"
              aria-hidden="true"
              focusable="false"
              data-prefix="fab"
              data-icon="google"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 488 512"
            >
              <path
                fill="currentColor"
                d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
              ></path>
            </svg>
            Google
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
