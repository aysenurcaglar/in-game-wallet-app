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
import { doc, updateDoc, arrayUnion, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { User, updateProfile as updateFirebaseProfile } from "firebase/auth";

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user, userData } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [avatarUrl, setAvatarUrl] = useState(user?.photoURL || "");
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { toast } = useToast();

  // Helper function to convert Firestore Timestamp to Date
  const convertTimestamps = (trans: any[]): Transaction[] => {
    return trans.map((t) => ({
      ...t,
      timestamp:
        t.timestamp instanceof Timestamp ? t.timestamp.toDate() : t.timestamp,
    }));
  };

  useEffect(() => {
    if (user && userData) {
      setBalance(userData.balance);
      setTransactions(convertTimestamps(userData.transactions));
      setDisplayName(userData.displayName || user.displayName || "");
      setAvatarUrl(userData.avatarUrl || user.photoURL || "");
    }
  }, [user, userData]);

  const updateProfile = async (
    newDisplayName: string,
    newAvatarUrl: string
  ) => {
    if (!user) return;

    try {
      // Update Firebase Auth profile
      await updateFirebaseProfile(user, {
        displayName: newDisplayName,
        photoURL: newAvatarUrl,
      });

      // Update Firestore
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        displayName: newDisplayName,
        avatarUrl: newAvatarUrl,
      });

      // Update local state
      setDisplayName(newDisplayName);
      setAvatarUrl(newAvatarUrl);

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

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
        )} more in your balance to purchase this item.`,
        variant: "destructive",
      });
    }
  };

  return (
    <WalletContext.Provider
      value={{
        balance,
        addFunds,
        purchaseItem,
        transactions,
        user: user as User,
        displayName,
        avatarUrl,
        updateProfile,
      }}
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
