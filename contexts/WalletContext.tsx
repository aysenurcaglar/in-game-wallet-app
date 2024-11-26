import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Item, Transaction, WalletContextType } from '../types/wallet';
import { useToast } from '@/hooks/use-toast';

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { toast } = useToast();

  const addFunds = (amount: number) => {
    setBalance((prevBalance) => prevBalance + amount);
    setTransactions((prevTransactions) => [
      {
        id: Date.now().toString(),
        type: 'add_funds',
        amount,
        timestamp: new Date(),
      },
      ...prevTransactions,
    ]);
    toast({
      title: "Funds Added",
      description: `$${amount.toFixed(2)} has been added to your balance.`,
    });
  };

  const purchaseItem = (item: Item) => {
    if (balance >= item.price) {
      setBalance((prevBalance) => prevBalance - item.price);
      setTransactions((prevTransactions) => [
        {
          id: Date.now().toString(),
          type: 'purchase',
          amount: item.price,
          itemName: item.name,
          timestamp: new Date(),
        },
        ...prevTransactions,
      ]);
      toast({
        title: "Purchase Successful",
        description: `You have purchased ${item.name} for $${item.price.toFixed(2)}.`,
      });
    } else {
      toast({
        title: "Insufficient Funds",
        description: `You need $${(item.price - balance).toFixed(2)} more to purchase this item.`,
        variant: "destructive",
      });
    }
  };

  return (
    <WalletContext.Provider value={{ balance, addFunds, purchaseItem, transactions }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

