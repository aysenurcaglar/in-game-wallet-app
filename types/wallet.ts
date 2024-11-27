import { Timestamp } from "firebase/firestore";

export interface Item {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
}

export interface Transaction {
  id: string;
  type: "purchase" | "add_funds";
  amount: number;
  itemName?: string;
  timestamp: Date | Timestamp;
}

export interface WalletContextType {
  balance: number;
  addFunds: (amount: number) => void;
  purchaseItem: (item: Item) => void;
  transactions: Transaction[];
}
