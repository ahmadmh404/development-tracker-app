"use server";

import { db, features, projects } from "@/lib/db";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { featureSchema, type FeatureFormData } from "@/lib/validations";

// Re-export schema for use in forms
export { featureSchema, type FeatureFormData };

// ═══════════════════════════════════════════════════════════════
// READ OPERATIONS
// ═══════════════════════════════════════════════════════════════

export async function getFeatureById(id: string) {
  return db.query.features.findFirst({
    where: eq(features.id, id),
    columns: { projectId: true },
  });
}

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

export async function createFeature(data: FeatureFormData) {
  const validated = featureSchema.parse(data);

  const [feature] = await db
    .insert(features)
    .values({
      ...validated,
      priority: validated.priority ?? "Medium",
      status: validated.status ?? "To Do",
      effortEstimate: validated.effortEstimate ?? null,
    })
    .returning();

  // Update project's lastUpdated timestamp
  await db
    .update(projects)
    .set({ lastUpdated: new Date() })
    .where(eq(projects.id, validated.projectId));

  revalidatePath(`/projects/${validated.projectId}`);
  revalidatePath(`/projects/${validated.projectId}/features`);
  return feature;
}

export async function updateFeature(
  id: string,
  data: Partial<FeatureFormData>,
) {
  const existingFeature = await getFeatureById(id);
  if (!existingFeature) throw new Error("Feature not found");

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

  revalidatePath(`/projects/${existingFeature.projectId}`);
  revalidatePath(`/projects/${existingFeature.projectId}/features/${id}`);
  return feature;
}

export async function deleteFeature(id: string) {
  const existingFeature = await getFeatureById(id);
  if (!existingFeature) throw new Error("Feature not found");

  await db.delete(features).where(eq(features.id, id));

  // Update project's lastUpdated timestamp
  await db
    .update(projects)
    .set({ lastUpdated: new Date() })
    .where(eq(projects.id, existingFeature.projectId));

  revalidatePath(`/projects/${existingFeature.projectId}`);
}
