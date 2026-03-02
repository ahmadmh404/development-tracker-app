"use server";

import { cacheTag } from "next/cache";
import { db } from "@/lib/db";
import { Feature, Project, projects, Task } from "@/lib/db/schema";

import { desc, eq } from "drizzle-orm";

type ProjectsData = Omit<
  Project & {
    features: Pick<
      Feature & {
        tasks: Pick<Task, "status">[];
      },
      "id" | "tasks"
    >[];
  },
  "createdAt"
>[];

export async function getProjects(): Promise<ProjectsData> {
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

export async function getProjectById(id: string) {
  return db.query.projects.findFirst({
    where: eq(projects.id, id),
    with: {
      features: {
        columns: {},
        with: { tasks: { columns: { status: true } } },
      },
    },
  });
}

export async function getActiveProject(): Promise<{ id: string } | null> {
  "use cache";
  cacheTag("active-projects");

  return (
    (await db.query.projects.findFirst({
      where: eq(projects.status, "In Progress"),
      columns: { id: true },
      orderBy: desc(projects.lastUpdated),
    })) ?? null
  );
}
