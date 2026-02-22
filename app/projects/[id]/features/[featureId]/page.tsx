import { Suspense } from "react";
import { Plus, Lightbulb } from "lucide-react";
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
import {
  FeaturePageLoading,
  TasksLoading,
  DecisionsLoading,
} from "@/components/loading";
import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";

export default function FeatureDetailPage(
  props: PageProps<"/projects/[id]/features/[featureId]">,
) {
  return (
    <Suspense fallback={<FeaturePageLoading />}>
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
        <ErrorState
          title="Feature not found"
          message="The feature you're looking for doesn't exist or has been deleted."
        />
      </div>
    );
  }

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
            <EditableTitle value={feature.name} />
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
          <ResizablePanel defaultSize={70} minSize={30}>
            <FeatureTasks
              featureId={featureId}
              className="h-full space-y-4 pr-4"
            />
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Decisions Panel */}
          <ResizablePanel defaultSize={30} minSize={30}>
            <FeatureDecisions
              featureId={feature.id}
              className="h-full space-y-4 pl-4"
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
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
        <TaskDialog featureId={featureId}>
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
              <EmptyState
                title="No tasks"
                description="Add your first task"
                className="p-4"
              />
            ) : (
              todoTasks.map((task) => (
                <TaskItem featureId={featureId} key={task.id} task={task} />
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
              <EmptyState
                title="No tasks"
                description="Tasks in progress will appear here"
                className="p-4"
              />
            ) : (
              inProgressTasks.map((task) => (
                <TaskItem featureId={featureId} key={task.id} task={task} />
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
              <EmptyState
                title="No tasks"
                description="Completed tasks will appear here"
                className="p-4"
              />
            ) : (
              doneTasks.map((task) => (
                <TaskItem featureId={featureId} key={task.id} task={task} />
              ))
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
        <DecisionDialog featureId={featureId}>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Log Decision
          </Button>
        </DecisionDialog>
      </div>

      <div className="space-y-4">
        {decisions.length === 0 ? (
          <EmptyState
            icon={Lightbulb}
            title="No decisions yet"
            description="Log decisions made during development."
          />
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
