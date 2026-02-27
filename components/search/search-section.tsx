"use client";

import { LucideIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface SearchSectionProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
}

export function SearchSection({
  title,
  icon: Icon,
  children,
}: SearchSectionProps) {
  return (
    <div className="py-1">
      <div className="flex items-center gap-2 px-3 py-1.5">
        <Icon className="size-3.5 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground">
          {title}
        </span>
      </div>
      <Separator className="mb-1" />
      {children}
    </div>
  );
}
