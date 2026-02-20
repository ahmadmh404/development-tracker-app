"use client";

import { Project } from "@/lib/db";
import { cn } from "@/lib/utils";
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function ProjectSidebarItem({
  project,
  isActive,
}: {
  project: Pick<Project, "id" | "name" | "status">;
  isActive?: boolean;
}) {
  const pathname = usePathname();
  const isCurrentRoute = pathname.startsWith(`/projects/${project.id}`);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isCurrentRoute}
        tooltip={project.name}
      >
        <Link href={`/projects/${project.id}`}>
          <StatusIndicator status={project.status} />
          <span className="truncate">{project.name}</span>
          {isActive && (
            <span className="ml-auto h-2 w-2 rounded-full bg-sidebar-primary" />
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function StatusIndicator({ status }: { status: string }) {
  const colorClass = cn(
    "h-2 w-2 rounded-full",
    status === "In Progress" && "bg-blue-500",
    status === "Planning" && "bg-yellow-500",
    status === "Launched" && "bg-green-500",
    status === "Archived" && "bg-gray-500",
    !["In Progress", "Planning", "Launched", "Archived"].includes(status) &&
      "bg-gray-500",
  );

  return <div className={colorClass} />;
}
