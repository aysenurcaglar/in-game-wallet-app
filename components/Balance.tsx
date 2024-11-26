import React, { useState } from "react";
import { useWallet } from "../contexts/WalletContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Balance: React.FC = () => {
  const { balance, addFunds } = useWallet();
  const [amount, setAmount] = useState("");

  const handleAddFunds = () => {
    const fundsToAdd = parseFloat(amount);
    if (!isNaN(fundsToAdd) && fundsToAdd > 0) {
      addFunds(fundsToAdd);
      setAmount("");
    }
  };

  return (
    <Card className="bg-gradient-to-r from-yellow-300 to-yellow-500 text-purple-900">
      <CardHeader>
        <CardTitle className="text-2xl">Your Balance</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-bold mb-4">${balance.toFixed(2)}</p>
        <div className="flex space-x-2">
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="flex-grow bg-white/50 placeholder-purple-700"
          />
          <Button
            onClick={handleAddFunds}
            className="bg-purple-700 hover:bg-purple-600 text-white"
          >
            Add Funds
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
