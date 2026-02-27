"use server";

import { db, projects, features } from "@/lib/db";
import { sql, desc } from "drizzle-orm";
import type { Project, Feature } from "@/lib/db/schema";

// Type for feature with project info
type FeatureWithProject = Feature & {
  project: { name: string };
};

export type SearchResults = {
  projects: Project[];
  features: FeatureWithProject[];
};

export async function searchProjects(query: string): Promise<Project[]> {
  if (!query || query.length < 2) return [];

  return db.query.projects.findMany({
    where: sql`${projects.name} ILIKE ${`%${query}%`}`,
    limit: 5,
    orderBy: [desc(projects.lastUpdated)],
  });
}

export async function searchFeatures(
  query: string,
): Promise<FeatureWithProject[]> {
  if (!query || query.length < 2) return [];

  return db.query.features.findMany({
    where: sql`${features.name} ILIKE ${`%${query}%`}`,
    limit: 5,
    orderBy: [desc(features.createdAt)],
    with: {
      project: {
        columns: { name: true },
      },
    },
  });
}

export async function searchAll(query: string): Promise<SearchResults> {
  const [projectsResults, featuresResults] = await Promise.all([
    searchProjects(query),
    searchFeatures(query),
  ]);

  return {
    projects: projectsResults,
    features: featuresResults,
  };
}
