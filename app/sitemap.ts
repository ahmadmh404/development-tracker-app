import { MetadataRoute } from "next";
import { getProjects } from "@/lib/queries/projects";
import { getFeatures } from "@/lib/queries/features";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects();
  const features = await getFeatures();

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!;

  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
  ];

  const projectRoutes = projects.map((project) => ({
    url: `${baseUrl}/projects/${project.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const featureRoutes = features.map((feature) => ({
    url: `${baseUrl}/projects/${feature.projectId}/features/${feature.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...projectRoutes, ...featureRoutes];
}
