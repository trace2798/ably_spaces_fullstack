"use client";
import { useMemo, useRef, useEffect, useContext } from "react";
import { colours } from "../utils/helpers";
import useSpaceMembers from "../hooks/useMembers";
import { MemberCursors, YourCursor } from "./cursors";
import { SpacesContext } from "./space-context";
import { useUser } from "@clerk/clerk-react";
import type { Member } from "../utils/types";
import type { SpaceMember } from "@ably/spaces";

/** 💡 Select a mock name to assign randomly to a new user that enters the space💡 */
const LiveCursors = () => {
  const { isSignedIn, user, isLoaded } = useUser();
  const name = user?.firstName;
  /** 💡 Select a color to assign randomly to a new user that enters the space💡 */
  const userColors = useMemo(
    () => colours[Math.floor(Math.random() * colours.length)],
    []
  );

  /** 💡 Get a handle on a space instance 💡 */
  const space = useContext(SpacesContext);

  useEffect(() => {
    space?.enter({ name, userColors });
  }, [space]);

  const { self, otherMembers } = useSpaceMembers(space);

  const liveCursors = useRef(null);

  return (
    <div
      id="live-cursors"
      ref={liveCursors}
      className="absolute top-0 left-0 w-full h-full"
    >
      <YourCursor
        self={self as Member | null}
        space={space}
        parentRef={liveCursors}
      />
      <MemberCursors
        otherUsers={
          otherMembers.filter((m: SpaceMember) => m.isConnected) as Member[]
        }
        space={space}
        selfConnectionId={self?.connectionId}
      />
    </div>
  );
};

export default LiveCursors;
