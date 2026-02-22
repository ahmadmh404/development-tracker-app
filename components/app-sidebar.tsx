import { Suspense } from "react";
import Link from "next/link";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";
import { FolderKanban, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectDialog } from "@/components/projects/project-dialog";
import { ProjectSidebarItem } from "@/components/projects/project-sidebar-item";
import { SidebarProjectsEmpty } from "@/components/projects/sidebar-projects-empty";
import { SidebarErrorBoundary } from "@/components/error-boundary";
import { getProjects, getActiveProject } from "@/lib/queries/projects";
import { connection } from "next/server";

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      {/* Header - Logo */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <FolderKanban className="!size-[23px] text-sidebar-primary" />
                <span className="text-lg font-semibold">Dev Tracker</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Content - Projects List */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarErrorBoundary>
              <Suspense fallback={<ProjectsLoadingSkeleton />}>
                <ProjectsList />
              </Suspense>
            </SidebarErrorBoundary>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer - New Project Button */}
      <SidebarFooter>
        <ProjectDialog>
          <Button size="sm" className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </ProjectDialog>
      </SidebarFooter>
    </Sidebar>
  );
}

function ProjectsLoadingSkeleton() {
  return (
    <SidebarMenu>
      {[1, 2, 3, 4].map((i) => (
        <SidebarMenuItem key={i}>
          <SidebarMenuSkeleton showIcon />
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

async function ProjectsList() {
  const [projects, activeProject] = await Promise.all([
    getProjects(),
    getActiveProject(),
  ]);

  if (projects.length === 0) {
    return <SidebarProjectsEmpty />;
  }

  return (
    <SidebarMenu>
      {projects.map((project) => (
        <ProjectSidebarItem
          key={project.id}
          project={project}
          isActive={project.id === activeProject?.id}
        />
      ))}
    </SidebarMenu>
  );
}
