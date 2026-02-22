"use server";

import { cacheTag } from "next/cache";
import { db, projects } from "@/lib/db";
import { desc, eq } from "drizzle-orm";
import { Project } from "@/lib/db";

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
