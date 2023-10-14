"use client";

import AvatarCard from "@/components/avatar-card";
import LiveCursors from "@/components/live-cursor";
import { SearchCommand } from "@/components/search-command";
import { SpaceContextProvider } from "@/components/space-context";
import { Spinner } from "@/components/spinner";
import { useConvexAuth } from "convex/react";
import { redirect } from "next/navigation";
import { Navigation } from "./_components/navigation";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return redirect("/");
  }

  return (
    <SpaceContextProvider example="member-locations">
      <LiveCursors />
      <AvatarCard />
      <div className="h-full flex dark:bg-[#1F1F1F]">
        <Navigation />
        <main className="flex-1 h-full overflow-y-auto">
          <SearchCommand />
          {children}
        </main>
      </div>
    </SpaceContextProvider>
  );
};

export default MainLayout;
