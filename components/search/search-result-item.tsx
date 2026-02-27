"use client";

import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface SearchResultItemProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  href: string;
  isSelected?: boolean;
  badge?: {
    text: string;
    variant?: "default" | "secondary" | "destructive" | "outline";
    className?: string;
  };
  onClick?: () => void;
}

export function SearchResultItem({
  icon: Icon,
  title,
  subtitle,
  href,
  isSelected,
  badge,
  onClick,
}: SearchResultItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 py-2 px-3 cursor-default select-none",
        isSelected
          ? "bg-accent"
          : "hover:bg-accent data-[selected=true]:bg-accent",
        "rounded-sm",
      )}
      data-selected={isSelected}
    >
      <Icon className="size-4 shrink-0 text-muted-foreground" />
      <div className="flex flex-1 flex-col min-w-0">
        <span className="text-sm font-medium truncate">{title}</span>
        {subtitle && (
          <span className="text-xs text-muted-foreground truncate">
            {subtitle}
          </span>
        )}
      </div>
      {badge && (
        <Badge
          variant={badge.variant || "secondary"}
          className={cn("shrink-0 text-xs", badge.className)}
        >
          {badge.text}
        </Badge>
      )}
    </Link>
  );
}
