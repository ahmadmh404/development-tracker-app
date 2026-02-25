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
import { FeaturePageLoading } from "@/components/loading";
import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";
import { TaskColumn } from "@/components/tasks/tasks-column";

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
            <EditableTitle
              id={feature.id}
              value={feature.name}
              mode="feature"
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

      {/* Main Content + Mobile flex column - Tasks and Decisions */}
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
      <div className="grid gap-3 grid-cols-1 xs:grid-cols-2 sm:grid-cols-3">
        <TaskColumn
          id="To Do"
          featureId={featureId}
          title="To Do"
          tasks={todoTasks}
          count={todoTasks.length}
          colorClass="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/10"
        />

        <TaskColumn
          id="In Progress"
          featureId={featureId}
          title="In Progress"
          tasks={inProgressTasks}
          count={inProgressTasks.length}
          colorClass="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/10"
        />

        <TaskColumn
          id="Done"
          featureId={featureId}
          title="Done"
          tasks={doneTasks}
          count={doneTasks.length}
          colorClass="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/10"
        />
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
