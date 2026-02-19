"use client";

import { useState } from "react";
import { Calendar, Edit2, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Task } from "@/lib/mockData";
import { tasks } from "@/lib/db";

interface TaskItemProps {
  task: Omit<typeof tasks.$inferSelect, "createdAt">;
}

export function TaskItem({ task }: TaskItemProps) {
  const [isDone, setIsDone] = useState(task.status === "Done");

  return (
    <div className="flex items-start gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/50">
      <Checkbox
        checked={isDone}
        onCheckedChange={(checked) => setIsDone(checked as boolean)}
        className="mt-1"
      />

      <div className="flex-1 space-y-2">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-1">
            <h4
              className={cn(
                "font-medium leading-tight",
                isDone && "text-muted-foreground line-through",
              )}
            >
              {task.title}
            </h4>
            <p className="text-sm text-muted-foreground">{task.description}</p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Edit2 className="h-4 w-4" />
              <span className="sr-only">Edit task</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete task</span>
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {task.dueDate && (
            <Badge variant="outline" className="gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(task.dueDate).toLocaleDateString()}
            </Badge>
          )}
          {task.effortEstimate && (
            <Badge variant="secondary">{task.effortEstimate}</Badge>
          )}
        </div>
      </div>
    </div>
  );
}
