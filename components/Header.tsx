"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { ProfileUpdateDialog } from "./UpdateProfile";
import { useWallet } from "@/contexts/WalletContext";

export function Header() {
  const { user, displayName, avatarUrl } = useWallet();
  const router = useRouter();
  const { toast } = useToast();
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      router.push("/login"); // Redirect to login page after logout
    } catch (error) {
      console.error("Logout Error:", error);
      toast({
        title: "Error",
        description: "An error occurred while logging out.",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="bg-purple-400 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Magical Realm</h1>
        {user ? (
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar>
                    {avatarUrl ? (
                      <AvatarImage src={avatarUrl} alt={displayName || ""} />
                    ) : (
                      <AvatarFallback>
                        {displayName
                          ? displayName.charAt(0).toUpperCase()
                          : user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="text-purple-600">
                <DropdownMenuLabel>
                  {displayName || user.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => setIsProfileDialogOpen(true)}>
                  Update Profile
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <ProfileUpdateDialog
              open={isProfileDialogOpen}
              onOpenChange={setIsProfileDialogOpen}
            />
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
              className="text-white border-white bg-transparent"
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
