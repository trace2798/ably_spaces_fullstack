"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@clerk/clerk-react";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { Globe, Lock, MoreHorizontal, Trash } from "lucide-react";

import { Id } from "@/convex/_generated/dataModel";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface MenuProps {
  documentId: Id<"documents">;
  creatorName: string;
  isPublic?: boolean;
}

export const Menu = ({ documentId, creatorName, isPublic }: MenuProps) => {
  const router = useRouter();
  const { user } = useUser();

  const archive = useMutation(api.documents.archive);

  const changeVisibility = useMutation(api.documents.toggleVisibility);

  const onArchive = () => {
    const promise = archive({ id: documentId });

    toast.promise(promise, {
      loading: "Moving to trash...",
      success: "Note moved to trash!",
      error: "Failed to archive note.",
    });

    router.push("/documents");
  };

  const onChangeVisibility = () => {
    const promise = changeVisibility({ id: documentId });

    toast.promise(promise, {
      loading: "Changing Visibility...",
      success: "Visibility Changed",
      error: "Failed to change visibility.",
    });

    router.push("/documents");
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="ghost">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-60"
          align="end"
          alignOffset={8}
          forceMount
        >
          <DropdownMenuItem onClick={onArchive}>
            <Trash className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <div className="text-xs text-muted-foreground p-2">
            Created by: {creatorName}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {isPublic ? (
        <HoverCard>
          <HoverCardTrigger className="flex flex-col group">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onChangeVisibility()}
            >
              <Globe className="text-indigo-400 w-5 h-5 group-hover:hidden" />
              <Lock className="text-indigo-400 w-5 h-5 hidden group-hover:block" />
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-fit text-sm">
            Click to make it private
          </HoverCardContent>
        </HoverCard>
      ) : (
        <HoverCard>
          <HoverCardTrigger className="flex flex-col group">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onChangeVisibility()}
            >
              <Lock className="text-indigo-400 w-5 h-5 group-hover:hidden" />
              <Globe className="text-indigo-400 w-5 h-5 hidden group-hover:block" />
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-fit text-sm">
            Click to make it public
          </HoverCardContent>
        </HoverCard>
      )}
    </>
  );
};

Menu.Skeleton = function MenuSkeleton() {
  return <Skeleton className="h-10 w-10" />;
};
