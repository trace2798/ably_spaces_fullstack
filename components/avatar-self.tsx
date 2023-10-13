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

interface AvatarSelfProps {
  self: Member | null;
}

const AvatarSelf: FC<AvatarSelfProps> = ({ self }) => {
  const { user } = useUser();
  const fullName = user?.fullName;
  let initials = "DP";

  if (fullName) {
    const words = fullName.split(" ");
    const firstLetter = words[0].charAt(0);
    const lastLetter = words[words.length - 1].charAt(0);
    initials = `${firstLetter}${lastLetter}`;
  }

  return (
    <>
      <HoverCard>
        <HoverCardTrigger>
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={`${user?.imageUrl || `/placeholder.svg`}`}
              alt={`image of ${fullName}`}
            />
            <AvatarFallback>{initials}</AvatarFallback>
            <div
              className=" bg-indigo-500 w-[10px] h-[10px] z-10 rounded-full absolute bottom-1 left-0 transform translate-y-1/2 translate-x-1/2"
              id="status-indicator"
            />
          </Avatar>
        </HoverCardTrigger>
        <HoverCardContent>{fullName} (You)</HoverCardContent>
      </HoverCard>
    </>
  );
};

export default AvatarSelf;
