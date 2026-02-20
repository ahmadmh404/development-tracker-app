"use client";

import { FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "../ui/sidebar";

interface SidebarProjectsEmptyProps {
  className?: string;
}

export function SidebarProjectsEmpty({ className }: SidebarProjectsEmptyProps) {
  const { open } = useSidebar();

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-3 py-6 text-center",
        !open && "hidden",
        className,
      )}
    >
      <FolderOpen className="mb-2 h-8 w-8 text-muted-foreground/50" />
      <p className="text-xs text-muted-foreground">No projects yet</p>
      <p className="text-xs text-muted-foreground/70">
        Create your first project below
      </p>
    </div>
  );
}
