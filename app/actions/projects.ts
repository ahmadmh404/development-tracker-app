"use server";

import { db, projects } from "@/lib/db";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// ═══════════════════════════════════════════════════════════════
// SCHEMAS
// ═══════════════════════════════════════════════════════════════

const projectSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  description: z.string(),
  status: z
    .enum(["Planning", "In Progress", "Launched", "Archived"])
    .optional(),
  techStack: z.array(z.string()).optional(),
});

// ═══════════════════════════════════════════════════════════════
// READ OPERATIONS
// ═══════════════════════════════════════════════════════════════

export async function getProjects() {
  return db.query.projects.findMany({
    with: {
      features: {
        with: {
          tasks: true,
          decisions: true,
        },
      },
    },
    orderBy: (projects, { desc }) => [desc(projects.lastUpdated)],
  });
}

export async function getProjectById(id: string) {
  return db.query.projects.findFirst({
    where: eq(projects.id, id),
    with: {
      features: {
        columns: { status: true },
        with: { tasks: { columns: { status: true } } },
      },
    },
    columns: { status: true },
  });
}

// ═══════════════════════════════════════════════════════════════
// WRITE OPERATIONS
// ═══════════════════════════════════════════════════════════════

export async function createProject(data: z.infer<typeof projectSchema>) {
  const validated = projectSchema.parse(data);

  const [project] = await db
    .insert(projects)
    .values({
      ...validated,
      status: validated.status ?? "Planning",
      techStack: validated.techStack ?? [],
    })
    .returning();

  revalidatePath("/projects");
  return project;
}

export async function updateProject(
  id: string,
  data: Partial<z.infer<typeof projectSchema>>,
) {
  const [project] = await db
    .update(projects)
    .set({
      ...data,
      lastUpdated: new Date(),
    })
    .where(eq(projects.id, id))
    .returning();

  revalidatePath("/projects");
  revalidatePath(`/projects/${id}`);
  return project;
}

export async function deleteProject(id: string) {
  await db.delete(projects).where(eq(projects.id, id));
  revalidatePath("/projects");
}

// ═══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS (matching mockData pattern)
// ═══════════════════════════════════════════════════════════════

export async function calculateProgress(projectId: string): Promise<number> {
  const project = await getProjectById(projectId);
  if (!project) return 0;

  const allTasks = project.features.flatMap((f) => f.tasks);
  if (allTasks.length === 0) return 0;

  const completedTasks = allTasks.filter((t) => t.status === "Done").length;
  return Math.round((completedTasks / allTasks.length) * 100);
}
