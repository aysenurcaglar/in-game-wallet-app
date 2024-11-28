import React, { useState, useEffect } from "react";
import { useWallet } from "../contexts/WalletContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Script from "next/script";
import dropin, { Dropin } from "braintree-web-drop-in";

declare global {
  interface Window {
    braintree: typeof dropin;
  }
}

export const Balance: React.FC = () => {
  const { balance, addFunds } = useWallet();
  const [amount, setAmount] = useState("");
  const [clientToken, setClientToken] = useState<string | null>(null);
  const [instance, setInstance] = useState<Dropin | null>(null);
  const [isDropInReady, setIsDropInReady] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [showDropIn, setShowDropIn] = useState(false);

  useEffect(() => {
    const fetchClientToken = async () => {
      try {
        if (!user) {
          throw new Error("User not authenticated");
        }

        const idToken = await user.getIdToken();

        const response = await fetch("/api/braintree/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `HTTP error! status: ${response.status}, message: ${errorText}`
          );
        }

        const data = await response.json();

        if (data.clientToken) {
          setClientToken(data.clientToken);
        } else {
          throw new Error(data.error || "Failed to get client token");
        }
      } catch (error: unknown) {
        console.error("Failed to fetch client token:", error);
        toast({
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "Failed to initialize payment gateway.",
          variant: "destructive",
        });
      }
    };

    if (user) {
      fetchClientToken();
    }
  }, [user, toast]);

  useEffect(() => {
    if (clientToken && showDropIn) {
      const initializeBraintree = async () => {
        try {
          const dropinInstance = await window.braintree.dropin.create({
            authorization: clientToken,
            container: "#dropin-container",
          });
          setInstance(dropinInstance);
          setIsDropInReady(true);
        } catch (error) {
          console.error("Error initializing Braintree:", error);
          toast({
            title: "Error",
            description: "Failed to initialize payment form. Please try again.",
            variant: "destructive",
          });
        }
      };

      initializeBraintree();
    }
  }, [clientToken, showDropIn, toast]);

  const handleAddFunds = async () => {
    // Validate amount first
    const fundsToAdd = parseFloat(amount);
    if (isNaN(fundsToAdd) || fundsToAdd <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount.",
        variant: "destructive",
      });
      return;
    }

    // Check if Braintree instance is ready
    if (!instance) {
      toast({
        title: "Payment Method Required",
        description: "Please select a payment method first.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { nonce } = await instance.requestPaymentMethod();

      const idToken = user ? await user.getIdToken() : "";

      const response = await fetch("/api/braintree/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          amount: fundsToAdd,
          nonce,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const data = await response.json();

      if (data.success) {
        addFunds(fundsToAdd);
        setAmount("");
        // Optionally reset the drop-in UI
        instance.teardown(() => {
          setInstance(null);
          setIsDropInReady(false);
          setShowDropIn(false);
        });

        toast({
          title: "Funds Added",
          description: `$${fundsToAdd.toFixed(
            2
          )} has been added to your balance.`,
          variant: "default",
        });
      } else {
        throw new Error(data.error || "Payment failed");
      }
    } catch (error: unknown) {
      if (typeof error === "string") {
        // If the error is a string, display it
        console.error("Payment Error:", error);
        toast({
          title: "Payment Failed",
          description: error, // Use the error string directly
          variant: "destructive",
        });
      } else if (error instanceof Error) {
        // If it's a standard JavaScript Error object
        console.error("Payment Error:", error.message);
        toast({
          title: "Payment Failed",
          description: error.message, // Display the error message
          variant: "destructive",
        });
      } else if (error instanceof HTMLElement) {
        // Handle the HTML error specifically
        console.error("Payment Error: HTML Content", error.outerHTML);
        toast({
          title: "Payment Failed",
          description: "An HTML error occurred. Check console for details.",
          variant: "destructive",
        });
      } else {
        // Fallback for unknown error types
        console.error("Payment Error: Unknown error type", error);
        toast({
          title: "Payment Failed",
          description: "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    }
  };

  if (authLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Script
        src="https://js.braintreegateway.com/web/dropin/1.33.7/js/dropin.min.js"
        onLoad={() => console.log("Braintree script loaded")}
      />
      <Card className="bg-gradient-to-r from-yellow-300 to-yellow-500 text-purple-900">
        <CardHeader>
          <CardTitle className="text-2xl">Your Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold mb-4">${balance.toFixed(2)}</p>
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="flex-grow bg-white/50 placeholder-purple-700"
              />
              <Button
                onClick={() => setShowDropIn(true)}
                className="bg-purple-700 hover:bg-purple-600 text-white"
                disabled={!amount || showDropIn}
              >
                Add Funds
              </Button>
            </div>
            {showDropIn && (
              <div className="bg-white p-4 rounded-md">
                <div id="dropin-container"></div>
                {isDropInReady && (
                  <Button
                    onClick={handleAddFunds}
                    className="w-full mt-4 bg-purple-600 hover:bg-purple-500 text-white"
                  >
                    Complete Payment
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
};
