"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  FolderKanban,
  CheckCircle2,
  Clock,
  Plus,
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
import { mockProjects } from "@/lib/mockData";
import { ProjectDialog } from "@/components/projects/project-dialog";
import { db, projects, tasks } from "@/lib/db";
import { eq } from "drizzle-orm";

export default function DashboardPage() {
  return (
    <Suspense>
      <SuspendedDashboard />
    </Suspense>
  );
}

async function SuspendedDashboard() {
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const totalFeatures = mockProjects.reduce(
    (sum, p) => sum + p.features.length,
    0,
  );
  const allTasks = mockProjects.flatMap((p) =>
    p.features.flatMap((f) => f.tasks),
  );
  const openTasks = allTasks.filter((t) => t.status !== "Done").length;
  const activeProjects = mockProjects.filter(
    (p) => p.status === "In Progress",
  ).length;

  const currentProject = mockProjects.find((p) => p.status === "In Progress");

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

      {/* Current Project CTA */}
      {currentProject && (
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
      )}

      {/* All Projects */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">All Projects</h2>
          <Button onClick={() => setProjectDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Start New Project
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mockProjects.map((project) => (
            <ProjectSummary key={project.id} project={project} />
          ))}
        </div>
      </div>

      <ProjectDialog
        open={projectDialogOpen}
        onOpenChange={setProjectDialogOpen}
        onSave={(data) => {
          console.log("[v0] Creating new project:", data);
        }}
      />
    </div>
  );
}

// Dashboard Stats

async function DashboardStats() {
  const [activeProjects, totalFeatures, allTasks] = await Promise.all([
    await getActiveProjectsCount(),
    await getTotalFeaturesCount(),
    await getOpenTasksCount(),
  ]);

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
          <div className="text-2xl font-bold">{activeProjects}</div>
          <p className="text-xs text-muted-foreground">
            {mockProjects.length} total projects
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

// Stats queries.
async function getActiveProjectsCount() {
  const activeProjects = await db.query.projects.findMany({
    where: eq(projects.status, "In Progress"),
    columns: { id: true },
  });

  return activeProjects.length;
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
