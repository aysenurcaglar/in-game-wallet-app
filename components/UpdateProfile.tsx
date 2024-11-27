import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

interface UpdateProfileProps {
  userName: string;
  avatarUrl: string;
  onUpdateProfile: (newUserName: string, newAvatarUrl: string) => void;
}

export function UpdateProfile({
  userName,
  avatarUrl,
  onUpdateProfile,
}: UpdateProfileProps) {
  const [newUserName, setNewUserName] = useState(userName);
  const [newAvatarUrl, setNewAvatarUrl] = useState(avatarUrl);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(newUserName, newAvatarUrl);
  };

  const handleCancel = () => {
    setNewUserName(userName);
    setNewAvatarUrl(avatarUrl);
    router.back();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="w-[350px] bg-transparent text-white">
        <CardHeader>
          <CardTitle className="text-yellow-300">Update Profile</CardTitle>
          <CardDescription className="text-white">
            Change your profile information here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Your name"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                className="bg-white/50 placeholder-purple-700"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="avatar">Avatar URL</Label>
              <Input
                id="avatar"
                placeholder="https://example.com/avatar.jpg"
                value={newAvatarUrl}
                onChange={(e) => setNewAvatarUrl(e.target.value)}
                className="bg-white/50 placeholder-purple-700"
              />
            </div>
            <div className="flex justify-center">
              <Avatar className="h-20 w-20">
                <AvatarImage src={newAvatarUrl} alt={newUserName} />
                <AvatarFallback>{newUserName.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" className="bg-purple-500 hover:bg-purple-600">
            Save
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
