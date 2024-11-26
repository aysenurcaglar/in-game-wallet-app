"use client";

import React, { useState } from "react";
import { WalletProvider } from "../contexts/WalletContext";
import { Balance } from "../components/Balance";
import { Store } from "../components/Store";
import { TransactionHistory } from "../components/TransactionHistory";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/toaster";
import { ToastProvider } from "@/components/ui/toast";

export default function Home() {
  const [activeTab, setActiveTab] = useState("store");

  return (
    <ToastProvider>
      <WalletProvider>
        <div className="min-h-screen bg-gradient-to-b from-purple-400 to-blue-500 text-white">
          <div className="container mx-auto p-4">
            <h1 className="text-4xl font-bold mb-6 text-center text-yellow-300 drop-shadow-lg">
              Your Wallet
            </h1>
            <div className="mb-6 max-w-2xl mx-auto">
              <Balance />
            </div>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="bg-white/10 backdrop-blur-md rounded-lg p-4"
            >
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="store" className="text-lg font-semibold">
                  Store
                </TabsTrigger>
                <TabsTrigger value="history" className="text-lg font-semibold">
                  Transaction History
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
        <Toaster />
      </WalletProvider>
    </ToastProvider>
  );
}
