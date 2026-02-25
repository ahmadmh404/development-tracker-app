"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { cn } from "@/lib/utils";
import { TaskItem } from "./task-item";
import { Task } from "@/types";

interface TaskColumnProps {
  id: string;
  featureId: string;
  title: string;
  tasks: Omit<Task, "createdAt">[];
  count: number;
  colorClass: string;
}

export function TaskColumn({
  id,
  featureId,
  title,
  tasks,
  count,
  colorClass,
}: TaskColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  const taskIds = tasks.map((task) => task.id);

  return (
    <div className="space-y-2">
      <div
        className={cn(
          "flex items-center justify-between rounded-xl px-4 py-2.5 border transition-colors",
          colorClass,
        )}
      >
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <span
          className={cn(
            "flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full text-xs font-medium",
            colorClass
              .replace("bg-gradient-to-br from-", "bg-")
              .replace("/10 to-", "/10 text-")
              .replace("/5", ""),
            colorClass.includes("blue") &&
              "bg-blue-500/10 text-blue-600 dark:text-blue-400",
            colorClass.includes("amber") &&
              "bg-amber-500/10 text-amber-600 dark:text-amber-400",
            colorClass.includes("green") &&
              "bg-green-500/10 text-green-600 dark:text-green-400",
          )}
        >
          {count}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "space-y-2 min-h-[200px] rounded-xl p-2 transition-colors",
          isOver && "bg-primary/5 ring-2 ring-primary/20",
        )}
      >
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border/50 p-6 text-center">
              <p className="text-xs text-muted-foreground">No tasks</p>
            </div>
          ) : (
            tasks.map((task) => (
              <TaskItem key={task.id} featureId={featureId} task={task} />
            ))
          )}
        </SortableContext>
      </div>
    </div>
  );
}
