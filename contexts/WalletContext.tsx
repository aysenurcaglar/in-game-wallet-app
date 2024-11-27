"use client";
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { Item, Transaction, WalletContextType } from "../types/wallet";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "./AuthContext";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/lib/firebase";

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user, userData } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (user && userData) {
      setBalance(userData.balance);
      setTransactions(userData.transactions);
    }
  }, [user, userData]);

  const addFunds = async (amount: number) => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const newBalance = balance + amount;

    try {
      await updateDoc(userRef, {
        balance: newBalance,
        transactions: arrayUnion({
          id: Date.now().toString(),
          type: "add_funds",
          amount,
          timestamp: new Date(),
        }),
      });
      setBalance(newBalance);
      setTransactions((prev) => [
        {
          id: Date.now().toString(),
          type: "add_funds",
          amount,
          timestamp: new Date(),
        },
        ...prev,
      ]);
      toast({
        title: "Funds Added",
        description: `$${amount.toFixed(2)} has been added to your balance.`,
      });
    } catch (error) {
      console.error("Error adding funds:", error);
      toast({
        title: "Error",
        description: "Failed to add funds. Please try again.",
        variant: "destructive",
      });
    }
  };

  const purchaseItem = async (item: Item) => {
    if (!user) return;

    if (balance >= item.price) {
      const userRef = doc(db, "users", user.uid);
      const newBalance = balance - item.price;

      try {
        await updateDoc(userRef, {
          balance: newBalance,
          transactions: arrayUnion({
            id: Date.now().toString(),
            type: "purchase",
            amount: item.price,
            itemName: item.name,
            timestamp: new Date(),
          }),
        });
        setBalance(newBalance);
        setTransactions((prev) => [
          {
            id: Date.now().toString(),
            type: "purchase",
            amount: item.price,
            itemName: item.name,
            timestamp: new Date(),
          },
          ...prev,
        ]);
        toast({
          title: "Purchase Successful",
          description: `You have purchased ${
            item.name
          } for $${item.price.toFixed(2)}.`,
        });
      } catch (error) {
        console.error("Error purchasing item:", error);
        toast({
          title: "Error",
          description: "Failed to purchase item. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Insufficient Funds",
        description: `You need $${(item.price - balance).toFixed(
          2
        )} more to purchase this item.`,
        variant: "destructive",
      });
    }
  };

  return (
    <WalletContext.Provider
      value={{ balance, addFunds, purchaseItem, transactions }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
