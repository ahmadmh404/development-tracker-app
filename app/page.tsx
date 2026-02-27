import { Suspense } from "react";
import Link from "next/link";
import {
  ArrowRight,
  FolderKanban,
  CheckCircle2,
  Clock,
  Plus,
  FolderOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProjectSummary } from "@/components/project-summary";
import { ProjectDialog } from "@/components/projects/project-dialog";
import { db } from "@/lib/db";
import { cacheTag } from "next/cache";
import {
  DashboardStatsLoading,
  CurrentProjectCTALoading,
  ProjectsSummaryListLoading,
} from "@/components/loading";
import { EmptyState } from "@/components/empty-state";

export default function DashboardPage() {
  return (
    <Suspense>
      <SuspendedDashboard />
    </Suspense>
  );
}

async function SuspendedDashboard() {
  return (
    <div className="container mx-auto space-y-8 p-6 md:p-8">
      {/* Hero Section */}
      <div className="space-y-2">
        <h1 className="text-balance text-4xl font-bold tracking-tight">
          Welcome back
        </h1>
        <p className="text-pretty text-lg text-muted-foreground">
          Track your development projects, features, and decisions in one place.
        </p>
      </div>

      {/* Quick Stats */}
      <Suspense fallback={<DashboardStatsLoading />}>
        <DashboardStats />
      </Suspense>

      {/* Current Project CTA */}
      <Suspense fallback={<CurrentProjectCTALoading />}>
        <CurrentProjectCTA />
      </Suspense>

      {/* All Projects */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">All Projects</h2>
          <ProjectDialog>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Start New Project
            </Button>
          </ProjectDialog>
        </div>

        <Suspense fallback={<ProjectsSummaryListLoading />}>
          <ProjectsSummaryList />
        </Suspense>
      </div>
    </div>
  );
}

// Dashboard Stats
async function DashboardStats() {
  const [totalProject, totalFeatures, allTasks] = await Promise.all([
    await getAllProjects(),
    await getTotalFeaturesCount(),
    await getOpenTasksCount(),
  ]);

  const activeProjects = totalProject.filter(
    (pr) => pr.status === "In Progress",
  );

  const openTasks = allTasks.filter(
    (todo) => todo.status === "In Progress",
  ).length;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
          <FolderKanban className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeProjects.length}</div>
          <p className="text-xs text-muted-foreground">
            {totalProject.length} total projects
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Features</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalFeatures}</div>
          <p className="text-xs text-muted-foreground">Across all projects</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Open Tasks</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{openTasks}</div>
          <p className="text-xs text-muted-foreground">
            {allTasks.length} total tasks
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// Current Project CTA
async function CurrentProjectCTA() {
  const currentProject = (await getActiveProjects())?.at(0);

  return (
    currentProject && (
      <Card className="border-primary/50 bg-primary/5">
        <CardHeader>
          <CardTitle>Continue Working</CardTitle>
          <CardDescription>
            Pick up where you left off with your active project
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold">{currentProject.name}</h3>
              <p className="text-sm text-muted-foreground">
                {currentProject.description}
              </p>
            </div>
            <Button asChild>
              <Link href={`/projects/${currentProject.id}`}>
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  );
}

// Projects Summary List
async function ProjectsSummaryList() {
  const projects = await getAllProjects();

  if (projects.length === 0) {
    return (
      <EmptyState
        icon={FolderOpen}
        title="No projects yet"
        description="Start your first project to begin tracking your development work."
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectSummary key={project.id} project={project} />
      ))}
    </div>
  );
}

// Stats queries.
async function getActiveProjects() {
  "use cache";
  cacheTag("projects");

  return await db.query.projects.findMany({
    columns: { id: true, name: true, description: true },
  });
}

// Total features count.
async function getTotalFeaturesCount() {
  const features = await db.query.features.findMany({
    columns: { id: true },
  });

  return features.length;
}

// Open tasks count.
async function getOpenTasksCount() {
  const todos = await db.query.tasks.findMany({
    columns: { id: true, status: true },
  });

  return todos;
}

// get all projects
async function getAllProjects() {
  "use cache";
  cacheTag("projects");

  return await db.query.projects.findMany({
    columns: { createdAt: false },
    with: {
      features: {
        columns: { id: true },
        with: { tasks: { columns: { status: true } } },
      },
    },
  });
}
