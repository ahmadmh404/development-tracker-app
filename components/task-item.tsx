"use client";

import { useState, useTransition } from "react";
import {
  Calendar,
  Edit2,
  Trash2,
  MoreVertical,
  Loader2,
  Clock,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Task, tasks } from "@/lib/db/schema";
import { TaskDialog } from "./tasks/task-dialog";
import { DeleteDialog } from "./delete-dialog";
import { deleteTask, updateTask } from "@/app/actions/tasks";
import { toast } from "sonner";

interface TaskItemProps {
  featureId: string;
  task: Omit<Task, "createdAt">;
}

export function TaskItem({ featureId, task }: TaskItemProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticDone, setOptimisticDone] = useState(task.status === "Done");

  function handleTaskStatusChange(checked: boolean) {
    setOptimisticDone(checked);
    startTransition(async () => {
      const { error } = await updateTask(task.id, {
        status: checked ? "Done" : "To Do",
      });
      if (error) {
        toast.error(error);
        setOptimisticDone(!checked);
      }
    });
  }

  return (
    <div
      className={cn(
        "group relative flex items-start gap-4 rounded-xl border border-border bg-card p-4 transition-all duration-200",
        "hover:border-primary/40 hover:shadow-sm",
        isPending && "opacity-70 grayscale-[0.5]",
      )}
    >
      {/* Status Action Area */}
      <div className="relative flex h-5 w-5 shrink-0 items-center justify-center mt-0.5">
        <Checkbox
          disabled={isPending}
          checked={optimisticDone}
          onCheckedChange={handleTaskStatusChange}
          className={cn("h-5 w-5 transition-opacity", isPending && "opacity-0")}
        />
        {isPending && (
          <Loader2 className="absolute h-4 w-4 animate-spin text-primary" />
        )}
      </div>

      <div className="flex-1 min-w-0 space-y-3">
        {/* Header Section */}
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <h4
              className={cn(
                "font-semibold leading-none tracking-tight transition-all",
                optimisticDone && "text-muted-foreground line-through",
              )}
            >
              {task.title}
            </h4>
            {task.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {task.description}
              </p>
            )}
          </div>

          {/* Clean Actions Dropdown */}
          <TaskActionsDropdown featureId={featureId} task={task} />
        </div>

        {/* Footer Badges */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          {task.dueDate && (
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
              <Calendar className="h-3 w-3" />
              {new Date(task.dueDate).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}
            </div>
          )}

          {task.effortEstimate && (
            <Badge
              variant="secondary"
              className="text-[10px] px-2 py-0 h-5 font-bold uppercase tracking-wider"
            >
              <Clock className="mr-1 h-2.5 w-2.5" />
              {task.effortEstimate}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}

interface TaskActionsDropdownProps {
  featureId: string;
  task: Omit<Task, "createdAt">;
}

function TaskActionsDropdown({ featureId, task }: TaskActionsDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
        >
          <MoreVertical className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <TaskDialog featureId={featureId} task={task}>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <Edit2 className="mr-2 h-4 w-4" /> Edit Task
          </DropdownMenuItem>
        </TaskDialog>
        <DeleteDialog
          title="Delete Task"
          description="This will permanently remove this task."
          onConfirm={deleteTask.bind(null, task.id)}
        >
          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
            variant="destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DeleteDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
