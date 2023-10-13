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
  return (
    <>
      <HoverCard>
        <HoverCardTrigger>
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={`${user?.imageUrl || "default_image_url"}`}
              alt="@shadcn"
            />
            <AvatarFallback>CN</AvatarFallback>
            <div
              className="bg-green-500 w-[10px] h-[10px] rounded-full absolute bottom-1 left-0 transform translate-y-1/2 translate-x-1/2"
              id="status-indicator"
            />
          </Avatar>
        </HoverCardTrigger>
        <HoverCardContent>
          The React Framework – created and maintained by @vercel.
        </HoverCardContent>
      </HoverCard>
    </>
  );
};

export default AvatarSelf;
