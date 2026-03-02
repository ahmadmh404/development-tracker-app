"use server";

import { db } from "@/lib/db";
import { features, projects } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { featureSchema, type FeatureFormData } from "@/lib/validations";
import { getProjectById } from "@/lib/queries/projects";
import { getFeatureById } from "@/lib/queries/features";
import { redirect } from "next/navigation";

export async function getFeaturesByProjectId(projectId: string) {
  return db.query.features.findMany({
    where: eq(features.projectId, projectId),
    with: {
      tasks: true,
      decisions: true,
    },
    orderBy: (features, { asc }) => [asc(features.createdAt)],
  });
}

// ═══════════════════════════════════════════════════════════════
// WRITE OPERATIONS
// ═══════════════════════════════════════════════════════════════

export async function createFeature(projectId: string, data: FeatureFormData) {
  const existingProject = await getProjectById(projectId);
  if (existingProject == null) return { error: "Project not found" };

  const validated = featureSchema.parse(data);

  const [feature] = await db
    .insert(features)
    .values({
      ...validated,
      priority: validated.priority ?? "Medium",
      status: validated.status ?? "To Do",
      effortEstimate: validated.effortEstimate ?? null,
      projectId,
    })
    .returning();

  // Update project's lastUpdated timestamp
  await db
    .update(projects)
    .set({ lastUpdated: new Date() })
    .where(eq(projects.id, projectId));

  revalidateTag(`project-${projectId}-features`, "max");

  return { error: null };
}

export async function updateFeature(
  id: string,
  data: Partial<FeatureFormData>,
) {
  const existingFeature = await getFeatureById(id);
  if (!existingFeature) return { error: "Feature not found" };

  const [feature] = await db
    .update(features)
    .set(data)
    .where(eq(features.id, id))
    .returning();

  // Update project's lastUpdated timestamp
  await db
    .update(projects)
    .set({ lastUpdated: new Date() })
    .where(eq(projects.id, existingFeature.projectId));

  revalidateTag(`feature-${id}`, "max");
  revalidateTag(`project-${id}-features`, "max");

  return { error: null };
}

export async function deleteFeature(id: string) {
  const existingFeature = await getFeatureById(id);
  if (!existingFeature) return { error: "Feature not found" };

  await db.delete(features).where(eq(features.id, id));

  // Update project's lastUpdated timestamp
  await db
    .update(projects)
    .set({ lastUpdated: new Date() })
    .where(eq(projects.id, existingFeature.projectId));

  revalidateTag(`project-${existingFeature.projectId}`, "amx");
  redirect(`/projects/${existingFeature.projectId}`);
}

// update feature's name

export async function editFeatureName(id: string, name: string) {
  const existingFeature = await getFeatureById(id);
  if (!existingFeature) return { error: "Feature not found" };

  await db.update(features).set({ name }).where(eq(features.id, id));

  // Update project's lastUpdated timestamp
  await db
    .update(projects)
    .set({ lastUpdated: new Date() })
    .where(eq(projects.id, existingFeature.projectId));

  revalidateTag(`feature-${id}`, "max");
  revalidateTag(`project-${id}-features`, "max");

  return { error: null };
}
