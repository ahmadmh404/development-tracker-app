import { Suspense } from "react";
import { Plus, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AppBreadcrumb } from "@/components/app-breadcrumb";
import { TaskItem } from "@/components/tasks/task-item";
import { DecisionCard } from "@/components/decisions/decision-card";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { TaskDialog } from "@/components/tasks/task-dialog";
import { DecisionDialog } from "@/components/decisions/decision-dialog";
import { cacheTag } from "next/cache";
import { db } from "@/lib/db";
import { features, projects, tasks, decisions } from "@/lib/db/schema";

import { eq } from "drizzle-orm";
import { EditableTitle } from "@/components/editable-title";
import { cn } from "@/lib/utils";
import { FeaturePageLoading } from "@/components/loading";
import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";
import { getFeatures } from "@/lib/queries/features";
import FeaturePrioritySwitcher from "@/components/features/feature-priority-switcher.";
import FeatureStatusSwitcher from "@/components/features/feature-status-switcher";

export async function generateMetadata({
  params,
}: {
  params: { id: string; featureId: string };
}) {
  const project = await getProjectById(params.id);
  const feature = await getFeatureById(params.featureId);

  if (!project || !feature) {
    return {
      title: "Feature Not Found",
      description:
        "The feature you're looking for doesn't exist or has been deleted.",
    };
  }

  return {
    title: `${feature.name} - ${project.name} - Personal Dev Tracker`,
    description: feature.description,
    openGraph: {
      title: `${feature.name} - ${project.name} - Personal Dev Tracker`,
      description: feature.description,
      url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://development-tracker-app.vercel.app"}/projects/${project.id}/features/${feature.id}`,
      type: "article",
      publishedTime: new Date().toISOString(),
      modifiedTime: new Date().toISOString(),
    },
    twitter: {
      card: "summary_large_image",
      title: `${feature.name} - ${project.name} - Personal Dev Tracker`,
      description: feature.description,
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || "https://development-tracker-app.vercel.app"}/projects/${project.id}/features/${feature.id}`,
    },
  };
}

export async function generateStaticParams() {
  const features = await getFeatures();

  return features.map((feat) => ({ featureId: feat.id }));
}

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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: feature.name,
    description: feature.description,
    isPartOf: {
      "@type": "SoftwareApplication",
      name: project.name,
    },
    author: {
      "@type": "Person",
      name: "Developer",
    },
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Priority",
        value: feature.priority,
      },
      {
        "@type": "PropertyValue",
        name: "Status",
        value: feature.status,
      },
      {
        "@type": "PropertyValue",
        name: "Effort Estimate",
        value: feature.effortEstimate,
      },
    ],
  };

  return (
    <div className="container mx-auto space-y-6 p-6 md:p-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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

          {/* Feature Priority and Status */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Filtering with search params */}
            <FeaturePrioritySwitcher
              featureId={feature.id}
              priority={feature.priority}
            />

            <FeatureStatusSwitcher
              featureId={feature.id}
              status={feature.status}
            />
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
          <ResizablePanel defaultSize={60} minSize={30}>
            <FeatureTasks
              featureId={featureId}
              className="h-full space-y-4 pr-4"
            />
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Decisions Panel */}
          <ResizablePanel defaultSize={40} minSize={30}>
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
            <DecisionCard
              key={decision.id}
              decision={decision}
              featureId={featureId}
            />
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
