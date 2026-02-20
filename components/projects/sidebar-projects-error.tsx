"use client";

import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProjectsErrorProps {
  className?: string;
  message?: string;
}

export function SidebarProjectsError({
  className,
  message = "Failed to load projects",
}: SidebarProjectsErrorProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-3 py-6 text-center",
        className,
      )}
    >
      <AlertCircle className="mb-2 h-8 w-8 text-destructive/70" />
      <p className="text-xs text-muted-foreground">{message}</p>
      <p className="text-xs text-muted-foreground/70">Please try again later</p>
    </div>
  );
}
