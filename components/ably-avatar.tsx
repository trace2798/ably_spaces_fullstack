"use client";
import type { Member } from "../utils/helpers";
import { MAX_USERS_BEFORE_LIST } from "../utils/helpers";
import AvatarDropdown from "./avatar-dropdown";
import AvatarOther from "./avatar-other";
import AvatarSelf from "./avatar-self";
import { Separator } from "./ui/separator";

const Avatars = ({
  otherUsers,
  self,
}: {
  otherUsers: Member[];
  self: Member | null;
}) => {
  return (
    <div className="relative flex">
      <AvatarSelf self={self} />
      <Separator
        orientation="vertical"
        className="bg-indigo-500 h-[30px] mx-4"
      />
      <AvatarOther
        users={otherUsers.slice(0, MAX_USERS_BEFORE_LIST).reverse()}
      />
      {otherUsers.length < MAX_USERS_BEFORE_LIST ? (
        ""
      ) : (
        <AvatarDropdown otherUsers={otherUsers} />
      )}
    </div>
  );
};

export default Avatars;
