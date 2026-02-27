"use server";

import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { decisionSchema, type DecisionFormData } from "@/lib/validations";
import { decisions, projects } from "@/lib/db/schema";
import { getDecisionById } from "@/lib/queries/decisions";
import { getFeatureById } from "@/lib/queries/features";

// ═══════════════════════════════════════════════════════════════
// WRITE OPERATIONS
// ═══════════════════════════════════════════════════════════════

export async function createDecision(
  featureId: string,
  data: DecisionFormData,
) {
  const validated = decisionSchema.parse(data);

  // Get feature to find project for revalidation
  const feature = await getFeatureById(featureId);

  if (!feature) return { error: "Feature not found" };

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

  return { decision, error: null };
}

export async function updateDecision(
  id: string,
  data: Partial<DecisionFormData>,
) {
  const existingDecision = await getDecisionById(id);
  if (!existingDecision) return { error: "Decision not found" };

  const validated = decisionSchema.partial().parse(data);

  const [decision] = await db
    .update(decisions)
    .set({
      ...validated,
      date: data.date ? new Date(data.date) : undefined,
      pros: validated.pros ?? [],
      cons: validated.cons ?? [],
      alternatives: validated.alternatives ?? null,
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

  return { error: null };
}

export async function deleteDecision(id: string) {
  const existingDecision = await getDecisionById(id);
  if (!existingDecision) return { error: "Decision not found" };

  await db.delete(decisions).where(eq(decisions.id, id));

  // Update project's lastUpdated timestamp
  await db
    .update(projects)
    .set({ lastUpdated: new Date() })
    .where(eq(projects.id, existingDecision.feature.projectId));

  revalidatePath(`/projects/${existingDecision.feature.projectId}`);

  return { error: null };
}
