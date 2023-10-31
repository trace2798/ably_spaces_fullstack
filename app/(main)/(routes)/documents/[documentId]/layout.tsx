"use client";
import { Navigation } from "@/app/(main)/_components/navigation";
import { AblyClientProvider } from "@/components/ably-provider";
import AvatarCard from "@/components/avatar-card";
import LiveCursors from "@/components/live-cursor";
import { SearchCommand } from "@/components/search-command";
import { SpaceContextProvider } from "@/components/space-context";
import { Spinner } from "@/components/spinner";
import { useConvexAuth } from "convex/react";
import { redirect } from "next/navigation";

const DocumentLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return redirect("/");
  }

  return (
    <>
      <LiveCursors />
      <AvatarCard />
      <div className="h-full flex">
        <main className="flex-1 h-full overflow-y-auto">
          <SearchCommand />
          {children}
        </main>
      </div>
    </>
  );
};

export default DocumentLayout;
