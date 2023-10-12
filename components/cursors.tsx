"use client";
import React, { useEffect, useState } from "react";
import type { Space, CursorUpdate as _CursorUpdate } from "@ably/spaces";
import CursorSvg from "./cursor-svg";
import useCursor from "../hooks/useCursor";
import { Member } from "../utils/types";
import { useUser } from "@clerk/clerk-react";
import { getMemberColor } from "@/utils/mockColors";

// 💡 This component is used to render the cursor of the user
const YourCursor = ({
  self,
  space,
  parentRef,
}: {
  self: Member | null;
  space?: Space;
  parentRef: React.RefObject<HTMLDivElement>;
}) => {
  const [cursorPosition, setCursorPosition] = useState<{
    left: number;
    top: number;
    state: string;
  }>({ left: 0, top: 0, state: "move" });
  const { isSignedIn, user, isLoaded } = useUser();
  const handleSelfCursorMove = useCursor(
    setCursorPosition,
    parentRef,
    space,
    self?.connectionId
  );
  if (!self) {
    return null;
  }
  if (cursorPosition.state === "leave") return null;
  const defaultColor = "#b147ff";
  const defaultName = "indigo";
  const { cursorColor = defaultColor, nameColor = defaultName } =
    self.profileData?.userColors || {};
  // const { cursorColor, nameColor } = self.profileData.userColors ?? `${"#b147ff"}`;

  return (
    <div
      className="absolute"
      onMouseMove={(e) => handleSelfCursorMove(e)}
      style={{
        top: `${cursorPosition.top}px`,
        left: `${cursorPosition.left}px`,
      }}
    >
      <CursorSvg cursorColor={cursorColor} />
      <div
        className={`px-4 py-2 m-2 ${nameColor} rounded-full text-sm text-white whitespace-nowrap`}
      >
        {user?.firstName} (You)
      </div>
    </div>
  );
};

type CursorUpdate = Omit<_CursorUpdate, "data"> & {
  data: { state: "move" | "leave" };
};

// 💡 This component is used to render the cursors of other users in the space
// const MemberCursors = ({
//   otherUsers,
//   space,
//   selfConnectionId,
// }: {
//   otherUsers: Member[];
//   space?: Space;
//   selfConnectionId?: string;
// }) => {
//   const [positions, setPositions] = useState<{
//     [connectionId: string]: {
//       position: { x: number; y: number };
//       state: string | undefined;
//     };
//   }>({});

//   useEffect(() => {
//     if (!space) return;

//     space.cursors.subscribe("update", (event) => {
//       let e = event as CursorUpdate;
//       // 💡 Ignore our own cursor
//       if (e.connectionId === selfConnectionId) return;

//       setPositions((positions) => ({
//         ...positions,
//         [e.connectionId]: { position: e.position, state: e.data.state },
//       }));
//     });
//     return () => {
//       space.cursors.unsubscribe();
//     };
//   }, [space]);

//   return (
//     <>
//       {otherUsers.map(({ connectionId, profileData }) => {
//         if (!positions[connectionId]) return;
//         if (positions[connectionId].state === "leave") return;
//         const defaultColor = getMemberColor();
//         const defaultName = "something something";
//         const { cursorColor = defaultColor, nameColor = defaultName } =
//           profileData?.userColors || {};
//         // const { cursorColor, nameColor } =
//         //   profileData.userColors ?? getMemberColor();
//         return (
//           <div
//             key={connectionId}
//             id={`member-cursor-${connectionId}`}
//             className="absolute"
//             style={{
//               left: `${positions[connectionId].position.x}px`,
//               top: `${positions[connectionId].position.y}px`,
//             }}
//           >
//             <CursorSvg cursorColor={cursorColor} />
//             <div
//               className={`px-4 py-2 m-2 ${nameColor} rounded-full text-sm text-white whitespace-nowrap member-cursor`}
//             >
//               {profileData.name}
//             </div>
//           </div>
//         );
//       })}
//     </>
//   );
// };

// export { MemberCursors, YourCursor };
const MemberCursors = ({
  otherUsers,
  space,
  selfConnectionId,
}: {
  otherUsers: Member[];
  space?: Space;
  selfConnectionId?: string;
}) => {
  const [positions, setPositions] = useState<{
    [connectionId: string]: {
      position: { x: number; y: number };
      state: string | undefined;
    };
  }>({});

  useEffect(() => {
    if (!space) return;

    space.cursors.subscribe("update", (event) => {
      let e = event as CursorUpdate;
      // 💡 Ignore our own cursor
      if (e.connectionId === selfConnectionId) return;

      setPositions((positions) => ({
        ...positions,
        [e.connectionId]: { position: e.position, state: e.data.state },
      }));
    });
    return () => {
      space.cursors.unsubscribe();
    };
  }, [space]);

  return (
    <>
      {otherUsers.map(({ connectionId, profileData }) => {
        if (!positions[connectionId]) return;
        if (positions[connectionId].state === "leave") return;

        const defaultColor = getMemberColor();
        const defaultName = "something something";
        const { cursorColor = defaultColor, nameColor = defaultName } =
          profileData?.userColors || {};

        return (
          <div
            key={connectionId}
            id={`member-cursor-${connectionId}`}
            className="absolute"
            style={{
              left: `${positions[connectionId].position.x}px`,
              top: `${positions[connectionId].position.y}px`,
            }}
          >
            <CursorSvg cursorColor={cursorColor} />
            <div
              className={`px-4 py-2 m-2 ${nameColor} rounded-full text-sm text-white whitespace-nowrap member-cursor`}
            >
              {profileData.name}
            </div>
          </div>
        );
      })}
    </>
  );
};

export { MemberCursors, YourCursor };
