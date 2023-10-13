"use client";
import { ReactNode } from "react";
import { ClerkProvider, useAuth, useSession } from "@clerk/clerk-react";
import { AblyProvider } from "ably/react";
import { nanoid } from "nanoid";
import { Realtime } from "ably";



// const { session } = useSession();
const client = new Realtime.Promise({
  clientId: nanoid(),
  key: process.env.NEXT_PUBLIC_ABLY_API_KEY,
});
// const client = new Realtime.Promise({
//   clientId: useAuth.name,
//   key: process.env.NEXT_PUBLIC_ABLY_API_KEY,
// });

export const AblyClientProvider = ({ children }: { children: ReactNode }) => {
  return <AblyProvider client={client}>{children}</AblyProvider>;
};
