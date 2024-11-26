import React from "react";
import { useWallet } from "../contexts/WalletContext";
import { Item } from "../types/wallet";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

const items: Item[] = [
  {
    id: "1",
    name: "Small Gold Package",
    price: 4.99,
    description: "1000 gold coins",
    image: "/coin.png",
  },
  {
    id: "2",
    name: "Medium Gold Package",
    price: 9.99,
    description: "2500 gold coins",
    image: "/gold-pot.png",
  },
  {
    id: "3",
    name: "Large Gold Package",
    price: 19.99,
    description: "6000 gold coins",
    image: "/treasure-chest.png",
  },
  {
    id: "4",
    name: "Special Character: Warrior",
    price: 14.99,
    description: "Unlock the Warrior character",
    image: "/viking.png",
  },
  {
    id: "5",
    name: "Special Character: Mage",
    price: 14.99,
    description: "Unlock the Mage character",
    image: "/witch.png",
  },
  {
    id: "6",
    name: "Power-up: Double XP",
    price: 7.99,
    description: "Double XP for 24 hours",
    image: "/level.png",
  },
  {
    id: "7",
    name: "Power-up: Instant Level",
    price: 9.99,
    description: "Instantly gain one level",
    image: "/level-up.png",
  },
];

export const Store: React.FC = () => {
  const { purchaseItem } = useWallet();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <Card key={item.id} className="bg-white/20 backdrop-blur-sm text-white">
          <CardHeader>
            <Image
              src={item.image}
              alt={item.name}
              width={100}
              height={100}
              className="mx-auto mb-2"
            />
            <CardTitle className="text-xl text-center">{item.name}</CardTitle>
            <CardDescription className="text-center text-yellow-200">
              {item.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-center text-yellow-300">
              ${item.price.toFixed(2)}
            </p>
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => purchaseItem(item)}
              className="w-full bg-green-500 hover:bg-green-400 text-purple-900 font-bold"
            >
              Purchase
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
