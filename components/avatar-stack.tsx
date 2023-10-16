"use client";
import { useUser } from "@clerk/clerk-react";
import { useContext, useEffect, useMemo } from "react";
import { SpacesContext } from "./space-context";
import useMembers from "../hooks/useMembers";
import type { Member } from "../utils/helpers";
import { getMemberColor } from "../utils/mockColors";
import AblyAvatars from "./ably-avatar";

const AvatarStack = () => {
  const { user } = useUser();
  const name = useMemo(() => user?.fullName, [user]);
  const imageUrl = useMemo(() => user?.imageUrl, [user]);
  const memberColor = useMemo(getMemberColor, []);

  /** 💡 Get a handle on a space instance 💡 */
  const space = useContext(SpacesContext);

  /** 💡 Enter the space as soon as it's available 💡 */
  useEffect(() => {
    space?.enter({ name, memberColor, imageUrl });
  }, [space]);

  /** 💡 Get everybody except the local member in the space and the local member 💡 */
  const { allMembers, otherMembers, self } = useMembers(space);
  console.log(allMembers, "All MEMBERS");
  console.log(otherMembers, "Other Member");
  console.log(self, "SELF");
  const uniqueUsers = Array.from(
    new Set(allMembers.map((user) => user.clientId))
  ).map((id) => {
    return allMembers.find((user) => user.clientId === id);
  });

  console.log(uniqueUsers, "UNIQUE");
  return (
    <div id="avatar-stack">
      {/** 💡 Stack of first 10 user avatars including yourself.💡 */}
      <AblyAvatars otherUsers={uniqueUsers as Member[]} />
    </div>
  );
};

export default AvatarStack;
