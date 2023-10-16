"use client";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Member } from "@/utils/helpers";
import { useUser } from "@clerk/clerk-react";
import { FC } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { redirect } from "next/navigation";

interface AvatarOtherProps {
  users: Member[];
}

const AvatarOther: FC<AvatarOtherProps> = ({ users }) => {
  const { user } = useUser();
  if (!user) {
    redirect("/");
  }
  const fullName = user?.fullName;
  let initials = "DP";
  console.log("USERS", users);
  if (fullName) {
    const words = fullName.split(" ");
    const firstLetter = words[0].charAt(0);
    const lastLetter = words[words.length - 1].charAt(0);
    initials = `${firstLetter}${lastLetter}`;
  }
  const loggedInUser = users.filter((u) => u.clientId === user.id);
  const otherUsers = users.filter((u) => u.clientId !== user.id);
  const orderedUsers = [...loggedInUser, ...otherUsers];

  return (
    <>
      {orderedUsers.map((user, index) => {
        const fullName = user?.profileData.name;
        let initials = "DP";
        // console.log("USERS", users);
        if (fullName) {
          const words = fullName.split(" ");
          const firstLetter = words[0].charAt(0);
          const lastLetter = words[words.length - 1].charAt(0);
          initials = `${firstLetter}${lastLetter}`;
        }
        return (
          <HoverCard key={index}>
            <HoverCardTrigger>
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={`${user?.profileData.imageUrl || "default_image_url"}`}
                  alt={`image of`}
                />
                <AvatarFallback>{initials}</AvatarFallback>
                <div
                  className="bg-green-500 w-[10px] h-[10px] rounded-full absolute bottom-1 left-0 transform translate-y-1/2 translate-x-1/2"
                  id="status-indicator"
                />
              </Avatar>
            </HoverCardTrigger>
            <HoverCardContent className="capitalize">
              {user?.profileData.name}
            </HoverCardContent>
          </HoverCard>
        );
      })}
    </>
  );
};

export default AvatarOther;
