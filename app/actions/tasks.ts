"use server";

import { db, tasks, features, projects } from "@/lib/db";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// ═══════════════════════════════════════════════════════════════
// SCHEMAS
// ═══════════════════════════════════════════════════════════════

const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  description: z.string(),
  status: z.enum(["To Do", "In Progress", "Done"]).optional(),
  dueDate: z.string().optional(),
  effortEstimate: z.string().optional(),
  featureId: z.string().uuid(),
});

// ═══════════════════════════════════════════════════════════════
// READ OPERATIONS
// ═══════════════════════════════════════════════════════════════

export async function getTasks() {
  return db.query.tasks.findMany({
    with: {
      feature: {
        with: {
          project: true,
        },
      },
    },
    orderBy: (tasks, { desc }) => [desc(tasks.createdAt)],
  });
}

export async function getTaskById(id: string) {
  return db.query.tasks.findFirst({
    where: eq(tasks.id, id),
    with: {
      feature: {
        with: {
          project: true,
        },
      },
    },
  });
}

export async function getTasksByFeatureId(featureId: string) {
  return db.query.tasks.findMany({
    where: eq(tasks.featureId, featureId),
    orderBy: (tasks, { asc }) => [asc(tasks.createdAt)],
  });
}

// ═══════════════════════════════════════════════════════════════
// WRITE OPERATIONS
// ═══════════════════════════════════════════════════════════════

export async function createTask(data: z.infer<typeof taskSchema>) {
  const validated = taskSchema.parse(data);

  // Get feature to find project for revalidation
  const feature = await db.query.features.findFirst({
    where: eq(features.id, validated.featureId),
  });
  if (!feature) throw new Error("Feature not found");

  const [task] = await db
    .insert(tasks)
    .values({
      ...validated,
      status: validated.status ?? "To Do",
      dueDate: validated.dueDate ? new Date(validated.dueDate) : null,
      effortEstimate: validated.effortEstimate ?? null,
    })
    .returning();

  // Update project's lastUpdated timestamp
  await db
    .update(projects)
    .set({ lastUpdated: new Date() })
    .where(eq(projects.id, feature.projectId));

  revalidatePath(`/projects/${feature.projectId}`);
  revalidatePath(
    `/projects/${feature.projectId}/features/${validated.featureId}`,
  );
  return task;
}

export async function updateTask(
  id: string,
  data: Partial<z.infer<typeof taskSchema>>,
) {
  const existingTask = await getTaskById(id);
  if (!existingTask) throw new Error("Task not found");

  const [task] = await db
    .update(tasks)
    .set({
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
    })
    .where(eq(tasks.id, id))
    .returning();

  // Update project's lastUpdated timestamp
  await db
    .update(projects)
    .set({ lastUpdated: new Date() })
    .where(eq(projects.id, existingTask.feature.projectId));

  revalidatePath(`/projects/${existingTask.feature.projectId}`);
  revalidatePath(
    `/projects/${existingTask.feature.projectId}/features/${existingTask.featureId}`,
  );
  return task;
}

export async function deleteTask(id: string) {
  const existingTask = await getTaskById(id);
  if (!existingTask) throw new Error("Task not found");

  await db.delete(tasks).where(eq(tasks.id, id));

  // Update project's lastUpdated timestamp
  await db
    .update(projects)
    .set({ lastUpdated: new Date() })
    .where(eq(projects.id, existingTask.feature.projectId));

  revalidatePath(`/projects/${existingTask.feature.projectId}`);
}

// ═══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

export async function calculateTaskProgress(
  featureId: string,
): Promise<number> {
  const tasksList = await getTasksByFeatureId(featureId);
  if (tasksList.length === 0) return 0;

  const completedTasks = tasksList.filter((t) => t.status === "Done").length;
  return Math.round((completedTasks / tasksList.length) * 100);
}
