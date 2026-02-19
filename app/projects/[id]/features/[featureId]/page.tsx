import { Suspense } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { TaskDialog } from "@/components/tasks/task-dialog";
import { DecisionDialog } from "@/components/decisions/decision-dialog";
import { cacheTag } from "next/cache";
import { db, decisions, features, projects, tasks } from "@/lib/db";
import { eq } from "drizzle-orm";
import { EditableTitle } from "@/components/editable-title";
import { cn } from "@/lib/utils";

export default function FeatureDetailPage(
  props: PageProps<"/projects/[id]/features/[featureId]">,
) {
  return (
    <Suspense>
      <SuspendedPage {...props} />
    </Suspense>
  );
}

async function SuspendedPage(
  props: PageProps<"/projects/[id]/features/[featureId]">,
) {
  const { id, featureId } = await props.params;
  const project = await getProjectById(id);
  const feature = await getFeatureById(featureId);

  if (!project || !feature) {
    return (
      <div className="container mx-auto p-6 md:p-8">
        <p className="text-muted-foreground">Feature not found</p>
      </div>
    );
  }

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
          <EditableTitle
            value={feature.name}
            onChange={(name) => {}}
            isOpen={false}
            setIsOpen={(open) => console.log("is open")}
          />
          <p className="text-pretty text-muted-foreground">
            {feature.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Filtering with search params */}
          <Select
            value={feature.priority}
            // onValueChange={(v) => setPriority(v as Priority)}
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

          <Select value={feature.status}>
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
    {/* Mobile: Flex column layout */}
    <div className="flex flex-col gap-6 lg:hidden">
      {/* Tasks Section */}
      <FeatureTasks featureId={feature.id} className="space-y-4" />

      {/* Decisions Section */}
      <FeatureDecisions featureId={feature.id} className="space-y-4" />
    </div>

    {/* Desktop: Resizable panels */}
    <div className="hidden lg:block">
      <ResizablePanelGroup direction="horizontal" className="min-h-[600px]">
        {/* Tasks Panel */}
        <ResizablePanel defaultSize={55} minSize={30}>
          <FeatureTasks
            featureId={featureId}
            className="h-full space-y-4 pr-4"
          />
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Decisions Panel */}
        <ResizablePanel defaultSize={45} minSize={30}>
          <FeatureDecisions
            featureId={feature.id}
            className="h-full space-y-4 pl-4"
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  </div>;
}

async function FeatureTasks({
  featureId,
  className,
}: {
  featureId: string;
  className?: string;
}) {
  const tasks = await getFeatureTasks(featureId);
  const todoTasks = tasks.filter((task) => task.status === "To Do");
  const inProgressTasks = tasks.filter((task) => task.status === "In Progress");
  const doneTasks = tasks.filter((task) => task.status === "Done");

  return (
    <div className={cn("", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Tasks</h2>
        <TaskDialog
          onSave={(data) => {
            console.log("[v0] Creating new task:", data);
          }}
        >
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </TaskDialog>
      </div>

      {/* Column-based task layout */}
      <div className="grid gap-4 xl:grid-cols-3">
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
              todoTasks.map((task) => <TaskItem key={task.id} task={task} />)
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
              doneTasks.map((task) => <TaskItem key={task.id} task={task} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

async function FeatureDecisions({
  className,
  featureId,
}: {
  className: string;
  featureId: string;
}) {
  const decisions = await getFeatureDecision(featureId);

  return (
    <div className={cn("", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Decisions</h2>
        <DecisionDialog
          onSave={(data) => {
            console.log("[v0] Logging new decision:", data);
          }}
        >
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Log Decision
          </Button>
        </DecisionDialog>
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
  );
}

async function getProjectById(projectId: string) {
  "use cache";
  cacheTag(`project-${projectId}`);

  return db.query.projects.findFirst({
    where: eq(projects.id, projectId),
    columns: { lastUpdated: false, createdAt: false },
  });
}

async function getFeatureById(featureId: string) {
  "use cache";
  cacheTag(`feature-${featureId}`);

  return db.query.features.findFirst({
    where: eq(features.id, featureId),
    columns: { createdAt: false },
    with: { tasks: { columns: { createdAt: false } } },
  });
}

async function getFeatureTasks(featureId: string) {
  "use cache";
  cacheTag(`feature-${featureId}-tasks`);

  return db.query.tasks.findMany({
    where: eq(tasks.featureId, featureId),
    columns: { createdAt: false },
  });
}

async function getFeatureDecision(featureId: string) {
  "use cache";
  cacheTag(`feature-${featureId}-decisions`);

  return db.query.decisions.findMany({
    where: eq(decisions.featureId, featureId),
    columns: { createdAt: false },
  });
}
