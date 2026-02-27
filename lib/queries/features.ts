"use server";

import { cacheTag } from "next/cache";
import { db } from "@/lib/db";
import { Feature, features } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function getFeatures(): Promise<
  Pick<Feature, "id" | "name" | "status">[]
> {
  "use cache";
  cacheTag("features");

  return db.query.features.findMany({
    columns: { id: true, name: true, status: true },
  });
}

export async function getFeatureById(id: string) {
  return db.query.features.findFirst({
    where: eq(features.id, id),
    columns: { projectId: true },
  });
}
