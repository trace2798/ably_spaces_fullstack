"use client";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Member } from "@/utils/helpers";

import { FC } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useUser } from "@clerk/clerk-react";

interface AvatarOtherProps {
  users: Member[];
  usersCount: number;
}

const AvatarOther: FC<AvatarOtherProps> = ({ users, usersCount }) => {
  const { user } = useUser();
  const fullName = user?.fullName;
  let initials = "DP";
  console.log("USERS", users);
  if (fullName) {
    const words = fullName.split(" ");
    const firstLetter = words[0].charAt(0);
    const lastLetter = words[words.length - 1].charAt(0);
    initials = `${firstLetter}${lastLetter}`;
  }

  return (
    <>
      {users.map((user, index) => {
        <HoverCard key={index}>
          <HoverCardTrigger>
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={`${user?.clientId || "default_image_url"}`}
                alt={`image of ${fullName}`}
              />
              <AvatarFallback>{initials}</AvatarFallback>
              <div
                className="bg-green-500 w-[10px] h-[10px] rounded-full absolute bottom-1 left-0 transform translate-y-1/2 translate-x-1/2"
                id="status-indicator"
              />
            </Avatar>
          </HoverCardTrigger>
          <HoverCardContent>{user?.clientId}</HoverCardContent>
        </HoverCard>;
      })}
    </>
  );
};

export default AvatarOther;
