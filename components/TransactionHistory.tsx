import React from "react";
import { useWallet } from "../contexts/WalletContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const TransactionHistory: React.FC = () => {
  const { transactions } = useWallet();

  return (
    <Card className="bg-white/20 backdrop-blur-sm text-white">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          Your Transaction History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-yellow-300">Type</TableHead>
              <TableHead className="text-yellow-300">Amount</TableHead>
              <TableHead className="text-yellow-300">Item</TableHead>
              <TableHead className="text-yellow-300">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id} className="hover:bg-white/10">
                <TableCell>
                  {transaction.type === "add_funds" ? "Add Funds" : "Purchase"}
                </TableCell>
                <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                <TableCell>{transaction.itemName || "-"}</TableCell>
                <TableCell>{transaction.timestamp.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
