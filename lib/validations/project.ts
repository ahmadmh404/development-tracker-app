import { z } from "zod";

// Status enum matching the database schema
export const projectStatuses = [
  "Planning",
  "In Progress",
  "Launched",
  "Archived",
] as const;

// Base schema for server actions (techStack as array)
export const projectSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  description: z.string().default(""),
  status: z.enum(projectStatuses),
  techStack: z.array(z.string()).default([]),
});

// Form input schema (techStack as comma-separated string for user input)
export const projectFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  description: z.string().default(""),
  status: z.enum(projectStatuses),
  techStack: z.string(), // Comma-separated in form
});

// Types
export type ProjectFormData = z.infer<typeof projectSchema>;
export type ProjectFormInput = z.infer<typeof projectFormSchema>;

// Transform form input to server data
export function transformProjectFormToData(
  data: ProjectFormInput,
): ProjectFormData {
  return {
    ...data,
    status: data.status ?? null,
    techStack: data.techStack
      ? data.techStack
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [],
  };
}

// Transform server data to form input
export function transformProjectDataToForm(
  data: Partial<ProjectFormData>,
): Partial<ProjectFormInput> {
  return {
    ...data,
    status: data.status || undefined,
    techStack: data.techStack?.join(", "),
  };
}
