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

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-400 to-blue-500 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-white/10 backdrop-blur-md text-white">
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
              placeholder="Enter your password"
              className="bg-white/20 text-white placeholder:text-white/50"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="flex flex-row space-x-4">
            <Button className="w-56 bg-yellow-400 text-purple-900 hover:bg-yellow-300">
              Login
            </Button>
            <Button
              variant="outline"
              className="w-56 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-purple-900"
            >
              Sign Up
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
          <div className="text-center text-sm text-yellow-200">
            <Link href="/wallet" className="hover:underline">
              Continue as Guest
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
