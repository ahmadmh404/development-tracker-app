"use server";

import { db, decisions, features, projects } from "@/lib/db";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { decisionSchema, type DecisionFormData } from "@/lib/validations";

// ═══════════════════════════════════════════════════════════════
// READ OPERATIONS
// ═══════════════════════════════════════════════════════════════

export async function getDecisionById(id: string) {
  return db.query.decisions.findFirst({
    where: eq(decisions.id, id),
    columns: { id: true, featureId: true },
    with: { feature: { columns: { projectId: true } } },
  });
}

export async function getDecisionsByFeatureId(featureId: string) {
  return db.query.decisions.findMany({
    where: eq(decisions.featureId, featureId),
    orderBy: [desc(decisions.date)],
  });
}

export async function getRecentDecisions(limit: number = 10) {
  return db.query.decisions.findMany({
    limit,
    with: {
      feature: {
        with: {
          project: true,
        },
      },
    },
    orderBy: [desc(decisions.date)],
  });
}

// ═══════════════════════════════════════════════════════════════
// WRITE OPERATIONS
// ═══════════════════════════════════════════════════════════════

export async function createDecision(
  featureId: string,
  data: DecisionFormData,
) {
  const validated = decisionSchema.parse(data);

  // Get feature to find project for revalidation
  const feature = await db.query.features.findFirst({
    where: eq(features.id, featureId),
  });

  if (!feature) throw new Error("Feature not found");

  const [decision] = await db
    .insert(decisions)
    .values({
      ...validated,
      featureId,
      date: validated.date ? new Date(validated.date) : new Date(),
      pros: validated.pros ?? [],
      cons: validated.cons ?? [],
      alternatives: validated.alternatives ?? null,
    })
    .returning();

  // Update project's lastUpdated timestamp
  await db
    .update(projects)
    .set({ lastUpdated: new Date() })
    .where(eq(projects.id, feature.projectId));

  revalidatePath(`/projects/${feature.projectId}`);
  revalidatePath(`/projects/${feature.projectId}/features/${featureId}`);
  return decision;
}

export async function updateDecision(
  id: string,
  data: Partial<DecisionFormData>,
) {
  const existingDecision = await getDecisionById(id);
  if (!existingDecision) throw new Error("Decision not found");

  const [decision] = await db
    .update(decisions)
    .set({
      ...data,
      date: data.date ? new Date(data.date) : undefined,
    })
    .where(eq(decisions.id, id))
    .returning();

  // Update project's lastUpdated timestamp
  await db
    .update(projects)
    .set({ lastUpdated: new Date() })
    .where(eq(projects.id, existingDecision.feature.projectId));

  revalidatePath(`/projects/${existingDecision.feature.projectId}`);
  revalidatePath(
    `/projects/${existingDecision.feature.projectId}/features/${existingDecision.featureId}`,
  );
  return decision;
}

export async function deleteDecision(id: string) {
  const existingDecision = await getDecisionById(id);
  if (!existingDecision) throw new Error("Decision not found");

  await db.delete(decisions).where(eq(decisions.id, id));

  // Update project's lastUpdated timestamp
  await db
    .update(projects)
    .set({ lastUpdated: new Date() })
    .where(eq(projects.id, existingDecision.feature.projectId));

  revalidatePath(`/projects/${existingDecision.feature.projectId}`);
}
