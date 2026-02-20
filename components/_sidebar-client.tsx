"use client";

import { useSidebar } from "@/contexts/sidebar-context";
import { cn } from "@/lib/utils";
import { FolderKanban, Plus } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import { Button } from "./ui/button";
import { ProjectDialog } from "./projects/project-dialog";

export function SidebarClient({ children }: { children: ReactNode }) {
  const { isOpen } = useSidebar();

  return (
    <div
      className={cn(
        "flex h-full flex-col border-r border-border bg-sidebar transition-all duration-300",
        isOpen ? "w-64" : "w-0 overflow-hidden",
      )}
    >
      {/* Logo/Title */}
      <div className="flex h-16 items-center border-b border-sidebar-border px-6">
        <Link href="/" className="flex items-center gap-2">
          <FolderKanban className="h-6 w-6 text-sidebar-primary" />
          <span className="text-lg font-semibold text-sidebar-foreground">
            Dev Tracker
          </span>
        </Link>
      </div>

      {/* Projects */}
      {children}

      {/* Bottom Actions */}
      <div className="border-t border-sidebar-border p-4">
        <ProjectDialog>
          <Button className="w-full" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </ProjectDialog>
      </div>
    </div>
  );
}
