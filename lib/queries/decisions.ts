"use server";

import { eq } from "drizzle-orm";
import { decisions } from "../db/schema";
import { db } from "../db";
import { cacheTag } from "next/cache";

export async function getDecisionById(id: string) {
  "use cache";
  cacheTag(`decisions-${id}`);

  return db.query.decisions.findFirst({
    where: eq(decisions.id, id),
    columns: { id: true, featureId: true },
    with: { feature: { columns: { projectId: true } } },
  });
}
