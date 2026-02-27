"use server";

import { db } from "@/lib/db";
import { features, projects, tasks } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { taskSchema, type TaskFormData } from "@/lib/validations";
import { getTaskById } from "@/lib/queries/tasks";

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
  return { error: null };
}

export async function updateTask(id: string, data: Partial<TaskFormData>) {
  const existingTask = await getTaskById(id);
  if (!existingTask) return { error: "Task not found" };

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

  return { task, error: null };
}

export async function deleteTask(id: string) {
  const existingTask = await getTaskById(id);
  if (!existingTask) return { error: "Task not found" };

  await db.delete(tasks).where(eq(tasks.id, id));

  // Update project's lastUpdated timestamp
  await db
    .update(projects)
    .set({ lastUpdated: new Date() })
    .where(eq(projects.id, existingTask.feature.projectId));

  revalidatePath(`/projects/${existingTask.feature.projectId}`);

  return { error: null };
}

// ═══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════
