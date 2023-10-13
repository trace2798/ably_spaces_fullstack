"use client";
import { useMemo } from "react";
import { useContext, useEffect } from "react";
import { SpacesContext } from "../components/space-context";
import Avatars from "./avatar";
import { getMemberColor } from "../utils/mockColors";
import useMembers from "../hooks/useMembers";
import type { Member } from "../utils/helpers";
import { useUser } from "@clerk/clerk-react";

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
  const { otherMembers, self } = useMembers(space);

  return (
    <div id="avatar-stack">
      {/** 💡 Stack of first 5 user avatars including yourself.💡 */}
      <Avatars
        self={self as Member | null}
        otherUsers={otherMembers as Member[]}
      />
    </div>
  );
};

export default AvatarStack;
