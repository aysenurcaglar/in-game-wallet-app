"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export function Header() {
  const { user, loading, userData } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      router.push("/"); // Redirect to login page after logout
    } catch (error) {
      console.error("Logout Error:", error);
      toast({
        title: "Error",
        description: "An error occurred while logging out.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <header className="bg-purple-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Magical Realm</h1>
          <div>Loading...</div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-purple-400 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Magical Realm</h1>
        {user ? (
          <div className="flex items-center space-x-4">
            <span className="hidden md:inline">
              {userData?.displayName || user.email}
            </span>
            <Avatar>
              {userData?.photoURL ? (
                <AvatarImage
                  src={userData.photoURL}
                  alt={userData.displayName || user.email}
                />
              ) : (
                <AvatarFallback>
                  {userData?.displayName
                    ? userData.displayName.charAt(0).toUpperCase()
                    : user.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
            <Button
              variant="outline"
              className="text-white border-white bg-transparent"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        ) : (
          <div>
            <Button
              variant="outline"
              className="text-white border-white bg-purple-700"
              onClick={() => router.push("/login")}
            >
              Login
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
