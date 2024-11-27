// components/ProtectedRoute.tsx
"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/");
      toast({
        title: "Unauthorized Access",
        description: "You must be logged in to access this page.",
        variant: "destructive",
      });
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <div>Loading...</div>; // You can replace this with a spinner
  }

  return <>{children}</>;
};

export default ProtectedRoute;
