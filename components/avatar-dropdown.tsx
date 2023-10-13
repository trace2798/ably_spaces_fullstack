"use client";
import { FC } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MAX_USERS_BEFORE_LIST, Member } from "@/utils/helpers";
import UserInfo from "./UserInfo";

interface AvatarDropdownProps {
  otherUsers: Member[];
}

const AvatarDropdown: FC<AvatarDropdownProps> = ({ otherUsers }) => {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="ml-5 h-9 w-9 rounded-full border border-muted-foreground">
          +{otherUsers.slice(MAX_USERS_BEFORE_LIST).length}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="flex flex-col">
          <DropdownMenuLabel>Online Users</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <>
            {otherUsers.slice(MAX_USERS_BEFORE_LIST).map((user) => (
              <DropdownMenuItem
                className="hover:bg-slate-700 hover:rounded-lg px-2 py-2 md:px-3"
                key={user.clientId}
              >
                <UserInfo user={user} />
              </DropdownMenuItem>
            ))}
          </>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default AvatarDropdown;
