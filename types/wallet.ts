import { Timestamp } from "firebase/firestore";
import { User } from "firebase/auth";

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
  user: User | null; // Add this line
  displayName: string;
  avatarUrl: string;
  updateProfile: (newDisplayName: string, newAvatarUrl: string) => void;
}
