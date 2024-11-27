"use client";

import { useState } from "react";
import { Header } from "../../components/Header";
import { UpdateProfile } from "../../components/UpdateProfile";
import { ToastProvider } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "../../contexts/AuthContext";

export default function ProfilePage() {
  const { user, loading, userData } = useAuth();
  const [userName, setUserName] = useState(user?.displayName || "");
  const [avatarUrl, setAvatarUrl] = useState(user?.photoURL || "");
  const { toast } = useToast();

  const handleUpdateProfile = (newUserName: string, newAvatarUrl: string) => {
    setUserName(newUserName);
    setAvatarUrl(newAvatarUrl);
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-400 to-blue-500 text-white">
      <div className="container mx-auto p-12">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-yellow-300 drop-shadow-lg">
            Your Profile
          </h1>
          <Link href="/dashboard">
            <Button
              variant="outline"
              className="text-white border-white bg-transparent"
            >
              Back to Dashboard
            </Button>
          </Link>
        </div>
        <div className="flex justify-center">
          <UpdateProfile
            userName={userName}
            avatarUrl={avatarUrl}
            onUpdateProfile={handleUpdateProfile}
          />
        </div>
      </div>
    </div>
  );
}
