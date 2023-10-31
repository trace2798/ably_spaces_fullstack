"use client";
import { useMemo, useRef, useEffect, useContext } from "react";
import { colours } from "../utils/helpers";
import useSpaceMembers from "../hooks/useMembers";
import { MemberCursors, YourCursor } from "./cursors";
import { SpacesContext } from "./space-context";
import { useUser } from "@clerk/clerk-react";
import type { Member } from "../utils/types";
import type { SpaceMember } from "@ably/spaces";
import { useParams } from "next/navigation";
import { Cover } from "./cover";
import { Skeleton } from "./ui/skeleton";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

const LiveCursors = () => {
  const params = useParams();
  console.log(params.documentId);
  // if (!params.documentId) {
  //   // Return a default component or null
  //   return <h1 className="hidden">home</h1>;
  // }
  const document = useQuery(api.documents.getById, {
    documentId: params.documentId as Id<"documents">,
  });
  console.log(document);

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

  if (document === undefined) {
    return (
      <div>
        <Cover.Skeleton />
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>
      </div>
    );
  }

  if (document === null) {
    return <div>Not found</div>;
  }

  return (
    <div
      id="live-cursors"
      ref={liveCursors}
      className={`absolute top-12 left-0 w-full h-full ${
        document.isEditable ? "z-0" : "z-[999]"
      }`}
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
