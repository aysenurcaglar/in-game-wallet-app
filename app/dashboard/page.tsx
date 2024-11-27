"use client";

import React, { useState } from "react";
import { WalletProvider } from "../../contexts/WalletContext";
import { ToastProvider } from "@/components/ui/toast";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Store } from "../../components/Store";
import { TransactionHistory } from "../../components/TransactionHistory";
import { Balance } from "../../components/Balance";

export default function Dashboard() {
  const userName = "Merlin"; // This would normally come from your authentication system
  const [activeTab, setActiveTab] = useState("store");

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-purple-400 to-blue-500 text-white">
        <div className="container mx-auto p-12  items-center">
          <h1 className="text-4xl font-bold mb-6 text-center text-yellow-300 drop-shadow-lg">
            Welcome, {userName}!
          </h1>
          <div className="m-12 max-w-2xl mx-auto">
            <Balance />
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="bg-white/10 backdrop-blur-md rounded-lg p-4"
          >
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger
                value="store"
                className="text-medium md:text-lg font-semibold"
              >
                Store
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="text-medium md:text-lg font-semibold"
              >
                Transactions
              </TabsTrigger>
            </TabsList>
            <TabsContent value="store">
              <Store />
            </TabsContent>
            <TabsContent value="history">
              <TransactionHistory />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
}
