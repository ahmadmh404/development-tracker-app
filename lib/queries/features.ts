"use server";

import { cacheTag } from "next/cache";
import { db } from "@/lib/db";
import { Feature } from "@/lib/db/schema";

export async function getFeatures(): Promise<
  Pick<Feature, "id" | "name" | "status">[]
> {
  "use cache";
  cacheTag("features");

  return db.query.features.findMany({
    columns: { id: true, name: true, status: true },
  });
}
