import React, { useState, useEffect } from "react";
import { useWallet } from "../contexts/WalletContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Script from "next/script";
import dropin from "braintree-web-drop-in";

declare global {
  interface Window {
    braintree: typeof dropin;
  }
}

export const Balance: React.FC = () => {
  const { balance, addFunds } = useWallet();
  const [amount, setAmount] = useState("");
  const [clientToken, setClientToken] = useState<string | null>(null);
  const [instance, setInstance] = useState<any>(null);
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
      } catch (error: any) {
        console.error("Failed to fetch client token:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to initialize payment gateway.",
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
          const dropin = await window.braintree.dropin.create({
            authorization: clientToken,
            container: "#dropin-container",
          });
          setInstance(dropin);
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
    } catch (error: any) {
      {
        /*error in html format, look into it*/
      }
      console.error("Payment Error");
      toast({
        title: "Payment Failed",
        description: "An error occurred during payment.",
        variant: "destructive",
      });
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
