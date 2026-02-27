"use server";

import { eq } from "drizzle-orm";
import { tasks } from "../db/schema";
import { db } from "../db";
import { cacheTag } from "next/cache";

export async function getTaskById(id: string) {
  "use cache";
  cacheTag(`tasks-${id}`);

  return db.query.tasks.findFirst({
    where: eq(tasks.id, id),
    columns: { id: true, featureId: true },
    with: { feature: { columns: { projectId: true } } },
  });
}
