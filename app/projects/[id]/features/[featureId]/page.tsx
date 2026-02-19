"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Edit2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppBreadcrumb } from "@/components/app-breadcrumb";
import { TaskItem } from "@/components/task-item";
import { DecisionCard } from "@/components/decision-card";
import {
  getProjectById,
  getFeatureById,
  getDecisionsForFeature,
  type Priority,
  type FeatureStatus,
} from "@/lib/mockData";
import { DecisionDialog } from "@/components/decisions/decision-dialog";
import { TaskDialog } from "@/components/tasks/task-dialog";

export default function FeatureDetailPage() {
  const params = useParams();
  const projectId = params.id as string;
  const featureId = params.featureId as string;

  const project = getProjectById(projectId);
  const feature = getFeatureById(featureId);
  const decisions = getDecisionsForFeature(featureId);

  const [isEditingName, setIsEditingName] = useState(false);
  const [featureName, setFeatureName] = useState(feature?.name || "");
  const [priority, setPriority] = useState<Priority>(
    feature?.priority || "Medium",
  );
  const [status, setStatus] = useState<FeatureStatus>(
    feature?.status || "To Do",
  );
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [decisionDialogOpen, setDecisionDialogOpen] = useState(false);

  if (!project || !feature) {
    return (
      <div className="container mx-auto p-6 md:p-8">
        <p className="text-muted-foreground">Feature not found</p>
      </div>
    );
  }

  const todoTasks = feature.tasks.filter((t) => t.status === "To Do");
  const inProgressTasks = feature.tasks.filter(
    (t) => t.status === "In Progress",
  );
  const doneTasks = feature.tasks.filter((t) => t.status === "Done");

  return (
    <div className="container mx-auto space-y-6 p-6 md:p-8">
      {/* Breadcrumb */}
      <AppBreadcrumb
        items={[
          { label: "Dashboard", href: "/" },
          { label: project.name, href: `/projects/${project.id}` },
          { label: feature.name },
        ]}
      />

      {/* Feature Header */}
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1 space-y-2">
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <Input
                  value={featureName}
                  onChange={(e) => setFeatureName(e.target.value)}
                  className="max-w-md"
                />
                <Button size="sm" onClick={() => setIsEditingName(false)}>
                  Save
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h1 className="text-balance text-3xl font-bold tracking-tight">
                  {featureName}
                </h1>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setIsEditingName(true)}
                >
                  <Edit2 className="h-4 w-4" />
                  <span className="sr-only">Edit feature name</span>
                </Button>
              </div>
            )}
            <p className="text-pretty text-muted-foreground">
              {feature.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={priority}
              onValueChange={(v) => setPriority(v as Priority)}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={status}
              onValueChange={(v) => setStatus(v as FeatureStatus)}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="To Do">To Do</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Done">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline">Estimate: {feature.effortEstimate}</Badge>
        </div>
      </div>

      {/* Main Content - Tasks and Decisions */}
      <div className="flex gap-6 lg:grid-cols-2">
        {/* Tasks Section */}
        <div className="w-2/3 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Tasks</h2>
            <Button size="sm" onClick={() => setTaskDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </div>

          {/* Column-based task layout */}
          <div className="grid gap-4 sm:grid-cols-3">
            {/* To Do Column */}
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                <h3 className="text-sm font-medium">To Do</h3>
                <span className="text-xs text-muted-foreground">
                  {todoTasks.length}
                </span>
              </div>
              <div className="space-y-2">
                {todoTasks.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-border p-4 text-center">
                    <p className="text-xs text-muted-foreground">No tasks</p>
                  </div>
                ) : (
                  todoTasks.map((task) => (
                    <TaskItem key={task.id} task={task} />
                  ))
                )}
              </div>
            </div>

            {/* In Progress Column */}
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                <h3 className="text-sm font-medium">In Progress</h3>
                <span className="text-xs text-muted-foreground">
                  {inProgressTasks.length}
                </span>
              </div>
              <div className="space-y-2">
                {inProgressTasks.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-border p-4 text-center">
                    <p className="text-xs text-muted-foreground">No tasks</p>
                  </div>
                ) : (
                  inProgressTasks.map((task) => (
                    <TaskItem key={task.id} task={task} />
                  ))
                )}
              </div>
            </div>

            {/* Done Column */}
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                <h3 className="text-sm font-medium">Done</h3>
                <span className="text-xs text-muted-foreground">
                  {doneTasks.length}
                </span>
              </div>
              <div className="space-y-2">
                {doneTasks.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-border p-4 text-center">
                    <p className="text-xs text-muted-foreground">No tasks</p>
                  </div>
                ) : (
                  doneTasks.map((task) => (
                    <TaskItem key={task.id} task={task} />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Decisions Section */}
        <div className=" w-1/3 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Decisions</h2>
            <Button size="sm" onClick={() => setDecisionDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Log Decision
            </Button>
          </div>

          <div className="space-y-4">
            {decisions.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  No decisions logged yet for this feature.
                </p>
              </div>
            ) : (
              decisions.map((decision) => (
                <DecisionCard key={decision.id} decision={decision} />
              ))
            )}
          </div>
        </div>
      </div>

      <TaskDialog
        open={taskDialogOpen}
        onOpenChange={setTaskDialogOpen}
        onSave={() => {}}
      />

      <DecisionDialog
        open={decisionDialogOpen}
        onOpenChange={setDecisionDialogOpen}
        onSave={() => {}}
      />
    </div>
  );
}
