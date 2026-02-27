"use server";

import { db } from "@/lib/db";
import { features, projects } from "@/lib/db/schema";

import { sql, desc } from "drizzle-orm";
import type { Project, Feature } from "@/lib/db/schema";
import { MIN_SEARCH_LENGTH, SEARCH_MAX_RESULTS } from "@/lib/constants";

// Type for feature with project info
type FeatureWithProject = Feature & {
  project: { name: string };
};

export type SearchResults = {
  projects: Project[];
  features: FeatureWithProject[];
};

export async function searchProjects(query: string): Promise<Project[]> {
  if (!query || query.length < MIN_SEARCH_LENGTH) return [];

  return db.query.projects.findMany({
    where: sql`${projects.name} ILIKE ${`%${query}%`}`,
    limit: SEARCH_MAX_RESULTS,
    orderBy: [desc(projects.lastUpdated)],
  });
}

export async function searchFeatures(
  query: string,
): Promise<FeatureWithProject[]> {
  if (!query || query.length < MIN_SEARCH_LENGTH) return [];

  return db.query.features.findMany({
    where: sql`${features.name} ILIKE ${`%${query}%`}`,
    limit: SEARCH_MAX_RESULTS,
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
