"use server";

import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { projectSchema, type ProjectFormData } from "@/lib/validations";

// ═══════════════════════════════════════════════════════════════
// READ OPERATIONS
// ═══════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════
// WRITE OPERATIONS
// ═══════════════════════════════════════════════════════════════

export async function createProject(data: ProjectFormData) {
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
  data: Partial<ProjectFormData>,
) {
  const existingProject = await getProjectById(id);
  if (existingProject != null) return { error: "Project not found" };

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

  return { error: null };
}

export async function deleteProject(id: string) {
  const existingProject = await getProjectById(id);
  if (existingProject != null) return { error: "Project not found" };

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

// edit project title
export async function editProjectName(id: string, name: string) {
  const existingProject = await getProjectById(id);
  if (existingProject == null) return { error: "Project not found" };

  await db
    .update(projects)
    .set({
      name,
      lastUpdated: new Date(),
    })
    .where(eq(projects.id, id))
    .returning();

  revalidatePath("/projects");
  revalidatePath(`/projects/${id}`);

  return { error: null };
}
