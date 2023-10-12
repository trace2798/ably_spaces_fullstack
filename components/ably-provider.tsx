"use client";
import { ReactNode } from "react";
import { ClerkProvider, useAuth, useSession } from "@clerk/clerk-react";
import { AblyProvider } from "ably/react";
import { nanoid } from "nanoid";
import { Realtime } from "ably";

// const { session } = useSession();

const client = new Realtime.Promise({
  clientId: nanoid(),
  key: "XxjO6w.FbqV6Q:niIIlHt70Rs_lSkxqacPvwZvB9fDYCiqOwCYaElU6EE",
});

export const AblyClientProvider = ({ children }: { children: ReactNode }) => {
  return <AblyProvider client={client}>{children}</AblyProvider>;
};
