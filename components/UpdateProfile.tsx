"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useWallet } from "@/contexts/WalletContext";
interface ProfileUpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileUpdateDialog({
  open,
  onOpenChange,
}: ProfileUpdateDialogProps) {
  const { user, updateProfile } = useWallet();
  const [newUserName, setNewUserName] = useState(user?.displayName || "");
  const [newAvatarUrl, setNewAvatarUrl] = useState(user?.photoURL || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile(newUserName, newAvatarUrl);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Update Profile</DialogTitle>
            <DialogDescription>
              Change your profile information here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="avatar" className="text-right">
                Avatar URL
              </Label>
              <Input
                id="avatar"
                value={newAvatarUrl}
                onChange={(e) => setNewAvatarUrl(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="flex justify-center">
              <Avatar className="h-20 w-20">
                <AvatarImage src={newAvatarUrl} alt={newUserName} />
                <AvatarFallback>
                  {newUserName
                    ? newUserName.charAt(0).toUpperCase()
                    : user?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
