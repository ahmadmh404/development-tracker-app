import { Suspense } from "react";
import { Plus, FolderOpen, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppBreadcrumb } from "@/components/app-breadcrumb";
import { FeatureList } from "@/components/feature-list";
import { DecisionCard } from "@/components/decision-card";
import { FeatureDialog } from "@/components/features/feature-dialog";
import { EditableTitle } from "@/components/editable-title";
import { db, decisions, features, projects } from "@/lib/db";
import { eq } from "drizzle-orm";
import { cacheTag } from "next/cache";
import {
  ProjectPageLoading,
  FeatureListLoading,
  DecisionListLoading,
} from "@/components/loading";
import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";

export default function ProjectDetailPage(props: PageProps<"/projects/[id]">) {
  return (
    <Suspense fallback={<ProjectPageLoading />}>
      <SuspendedPage {...props} />
    </Suspense>
  );
}

async function SuspendedPage(props: PageProps<"/projects/[id]">) {
  const { id } = await props.params;
  const project = await getProjectById(id);

  if (!project) {
    return (
      <div className="container mx-auto p-6 md:p-8">
        <ErrorState
          title="Project not found"
          message="The project you're looking for doesn't exist or has been deleted."
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 p-6 md:p-8">
      {/* Breadcrumb */}
      <AppBreadcrumb
        items={[{ label: "Dashboard", href: "/" }, { label: project.name }]}
      />

      {/* Project Header */}
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1 space-y-2">
            <EditableTitle
              value={project.name}
              onChange={(value) => console.log(value)}
              isOpen={false}
              setIsOpen={(isOpen) => console.log(isOpen)}
            />
            <p className="text-pretty text-muted-foreground">
              {project.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Select defaultValue={project.status}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Planning">Planning</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Launched">Launched</SelectItem>
                <SelectItem value="Archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <Badge key={tech} variant="secondary">
              {tech}
            </Badge>
          ))}
        </div>
      </div>

      {/* Tabs for Features and Decisions */}
      <Tabs defaultValue="features" className="space-y-4">
        <TabsList>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="decisions">Recent Decisions</TabsTrigger>
        </TabsList>

        <Suspense fallback={<FeatureListLoading />}>
          <ProjectFeatures projectId={id} />
        </Suspense>

        <Suspense fallback={<DecisionListLoading />}>
          <ProjectDecisions projectId={project.id} />
        </Suspense>
      </Tabs>
    </div>
  );
}

async function ProjectFeatures({ projectId }: { projectId: string }) {
  const features = await getProjectFeatures(projectId);

  return (
    <TabsContent value="features" className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {features.length} features in total
        </p>

        <FeatureDialog>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Feature
          </Button>
        </FeatureDialog>
      </div>

      <FeatureList features={features} projectId={projectId} />
    </TabsContent>
  );
}

async function ProjectDecisions({ projectId }: { projectId: string }) {
  const projectDecisions = await getProjectDecisions(projectId);

  return (
    <TabsContent value="decisions" className="space-y-4">
      {projectDecisions.length === 0 ? (
        <EmptyState
          icon={Lightbulb}
          title="No decisions yet"
          description="Decisions made during development will appear here."
        />
      ) : (
        <div className="space-y-4">
          {projectDecisions.map((decision) => (
            <DecisionCard key={decision.id} decision={decision} />
          ))}
        </div>
      )}
    </TabsContent>
  );
}

export async function getProjectById(id: string) {
  "use cache";
  cacheTag(`project-${id}`);

  return db.query.projects.findFirst({
    where: eq(projects.id, id),
    columns: { lastUpdated: false, createdAt: false },
  });
}

export async function getProjectFeatures(projectId: string) {
  "use cache";
  cacheTag(`project-${projectId}-features`);

  return db.query.features.findMany({
    where: eq(features.projectId, projectId),
    columns: { createdAt: false },
    with: { tasks: { columns: { status: true } } },
  });
}

export async function getProjectDecisions(projectId: string) {
  "use cache";
  cacheTag(`project-${projectId}-decisions`);

  const projectFeatures = await db.query.features.findMany({
    where: eq(features.projectId, projectId),
    columns: { id: true },
    with: { decisions: { columns: { createdAt: false } } },
  });

  return projectFeatures.flatMap((feature) => feature.decisions);
}
