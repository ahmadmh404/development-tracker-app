"use server";

import { db } from "@/lib/db";
import { features, projects, tasks } from "@/lib/db/schema";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { taskSchema, type TaskFormData } from "@/lib/validations";

// ═══════════════════════════════════════════════════════════════
// READ OPERATIONS
// ═══════════════════════════════════════════════════════════════

export async function getTaskById(id: string) {
  return db.query.tasks.findFirst({
    where: eq(tasks.id, id),
    columns: { featureId: true },
    with: {
      feature: {
        columns: { projectId: true },
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

export async function createTask(featureId: string, data: TaskFormData) {
  const validated = taskSchema.parse(data);

  // Get feature to find project for revalidation
  const feature = await db.query.features.findFirst({
    where: eq(features.id, featureId),
  });
  if (!feature) throw new Error("Feature not found");

  const [task] = await db
    .insert(tasks)
    .values({
      ...validated,
      featureId,
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
  revalidatePath(`/projects/${feature.projectId}/features/${featureId}`);
  return task;
}

export async function updateTask(id: string, data: Partial<TaskFormData>) {
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
