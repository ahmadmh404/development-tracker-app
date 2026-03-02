import Link from "next/link";
import { Clock, Edit2, MoreVertical, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { calculateProgress, deleteProject } from "@/app/actions/projects";
import { Feature, Project, Task } from "@/lib/db/schema";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ProjectDialog } from "./project-dialog";
import { DeleteDialog } from "../delete-dialog";
import { Button } from "../ui/button";

interface ProjectSummaryProps {
  project: Omit<
    Project & {
      features: Pick<
        Feature & { tasks: Pick<Task, "status">[] },
        "id" | "tasks"
      >[];
    },
    "createdAt"
  >;
}

export async function ProjectSummary({ project }: ProjectSummaryProps) {
  // Calculate overall progress
  const allTasks = project.features.flatMap((f) => f.tasks);
  const progress = await calculateProgress(project.id);
  const completedTasks = allTasks.filter((t) => t.status === "Done").length;
  const totalTasks = allTasks.length;

  return (
    <Link href={`/projects/${project.id}`}>
      <Card className="group transition-colors hover:border-primary/50">
        <CardHeader>
          <div className="relative flex items-start gap-5">
            <div className="w-full flex items-start justify-between gap-4">
              <div className="flex-1 space-y-1">
                <CardTitle className="text-xl">{project.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {project.description}
                </p>
              </div>
              <Badge
                variant={
                  project.status === "In Progress"
                    ? "default"
                    : project.status === "Planning"
                      ? "secondary"
                      : project.status === "Launched"
                        ? "default"
                        : "outline"
                }
                className={
                  project.status === "In Progress"
                    ? "bg-blue-500"
                    : project.status === "Launched"
                      ? "bg-green-500"
                      : ""
                }
              >
                {project.status}
              </Badge>
            </div>

            <div className="opacity-0 group-hover:opacity-100 transition-all duration-300">
              {/* <ProjectActionsDropdown project={project} /> */}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">
                {completedTasks}/{totalTasks} tasks
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <Badge key={tech} variant="outline" className="text-xs">
                {tech}
              </Badge>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>
              Updated {new Date(project.lastUpdated).toLocaleDateString()}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

interface ProjectActionsDropdownProps {
  project: Omit<Project, "createdAt">;
}

function ProjectActionsDropdown({ project }: ProjectActionsDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
        >
          <MoreVertical className="h-4 w-4 text-muted-foreground" />
          <span className="sr-only">Actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <ProjectDialog project={project} mode="edit">
          <DropdownMenuItem>
            <Edit2 className="mr-2 h-4 w-4" /> Edit
          </DropdownMenuItem>
        </ProjectDialog>

        <DeleteDialog
          title="Delete Project"
          description="This action cannot be undone."
          onConfirm={deleteProject.bind(null, project.id)}
        >
          <DropdownMenuItem variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DeleteDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
