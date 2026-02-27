"use server";

import { cacheTag } from "next/cache";
import { db } from "@/lib/db";
import { Project, projects } from "@/lib/db/schema";

import { desc, eq } from "drizzle-orm";

export async function getProjects(): Promise<
  Pick<Project, "id" | "name" | "status">[]
> {
  "use cache";
  cacheTag("projects");

  return db.query.projects.findMany({
    columns: { id: true, name: true, status: true },
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
