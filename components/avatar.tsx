"use client";
import { useState } from "react";
import {
  MAX_USERS_BEFORE_LIST,
  calculateRightOffset,
  calculateTotalWidth,
} from "../utils/helpers";
import UserInfo from "./UserInfo";

import { cn } from "@/lib/utils";
import type { Member } from "../utils/helpers";
import AvatarDropdown from "./avatar-dropdown";
import AvatarSelf from "./avatar-self";

const SelfAvatar = ({ self }: { self: Member | null }) => {
  const [hover, setHover] = useState(false);

  return (
    <div
      className="bg-orange-600 h-8 w-8 shrink-0 rounded-full flex items-center justify-center relative"
      onMouseOver={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <p className="text-xs text-white">You</p>
      <div
        className="bg-green-500 w-[10px] h-[10px] rounded-full absolute bottom-1 left-0 transform translate-y-1/2 translate-x-1/2"
        id="status-indicator"
      />

      {hover && self ? (
        <div className="absolute -top-16 px-2 py-2 bg-indigo-400 rounded-lg text-white min-w-[240px]">
          <UserInfo user={self} isSelf={true} />
        </div>
      ) : null}
    </div>
  );
};

const OtherAvatars = ({
  users,
  usersCount,
}: {
  users: Member[];
  usersCount: number;
}) => {
  const [hoveredClientId, setHoveredClientId] = useState<string | null>(null);
  return (
    <>
      {users.map((user, index) => {
        const rightOffset = calculateRightOffset({ usersCount, index });
        const userInitials = user.profileData.name
          .split(" ")
          .map((word: string) => word.charAt(0))
          .join("");
        const avatarCSS = cn(
          {
            [user.profileData.memberColor]: user.isConnected,
            "bg-gray-200": !user.isConnected,
          },
          "h-8 w-8 shrink-0 rounded-full flex items-center justify-center relative border border-gray-400"
        );
        const initialsCSS = cn(
          {
            "text-white": user.isConnected,
            "text-gray-400": !user.isConnected,
          },
          "relative z-20 text-xs"
        );
        const statusIndicatorCSS = cn(
          {
            "bg-green-500": user.isConnected,
            "bg-gray-400": !user.isConnected,
          },
          "w-[10px] h-[10px] rounded-full absolute bottom-1 left-0 transform translate-y-1/2 translate-x-1/2 z-10"
        );

        return (
          <div
            className="right-0 flex flex-col items-center absolute"
            key={user.clientId}
            style={{
              right: rightOffset,
              zIndex: users.length - index,
            }}
          >
            <div
              className={avatarCSS}
              onMouseOver={() => setHoveredClientId(user.clientId)}
              onMouseLeave={() => setHoveredClientId(null)}
              id="avatar"
            >
              <p className={initialsCSS}>{userInitials}</p>
              <div className={statusIndicatorCSS} id="status-indicator" />
            </div>

            {hoveredClientId === user.clientId ? (
              <div className="absolute -top-16 px-2 py-2 bg-black rounded-lg text-white min-w-[240px]">
                <UserInfo user={user} />
              </div>
            ) : null}
          </div>
        );
      })}
    </>
  );
};

const Avatars = ({
  otherUsers,
  self,
}: {
  otherUsers: Member[];
  self: Member | null;
}) => {
  const totalWidth = calculateTotalWidth({ users: otherUsers });

  return (
    <div className="relative flex" style={{ width: `${totalWidth}px` }}>
      {/* <SelfAvatar self={self} /> */}
      <AvatarSelf self={self} />
      <OtherAvatars
        usersCount={otherUsers.length}
        users={otherUsers.slice(0, MAX_USERS_BEFORE_LIST).reverse()}
      />
      <AvatarDropdown otherUsers={otherUsers} />
    </div>
  );
};

export default Avatars;
