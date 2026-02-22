import { z } from "zod";

// Status and Priority enums matching the database schema
export const featureStatuses = ["To Do", "In Progress", "Done"] as const;
export const priorities = ["High", "Medium", "Low"] as const;

// Base schema for server actions
export const featureSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  description: z.string().default(""),
  priority: z.enum(priorities).nullable(),
  status: z.enum(featureStatuses).nullable(),
  effortEstimate: z.string().nullable().nullable(),
});

// Form input schema (same as base for features - no transformations needed)
export const featureFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  description: z.string().default(""),
  priority: z.enum(priorities).optional(),
  status: z.enum(featureStatuses).optional(),
  effortEstimate: z.string().optional(),
});

// Types
export type FeatureFormData = z.infer<typeof featureSchema>;
export type FeatureFormInput = z.infer<typeof featureFormSchema>;

// Transform form input to server data (no transformation needed for features)
export function transformFeatureFormToData(
  data: FeatureFormInput,
): FeatureFormData {
  return {
    ...data,
    priority: data.priority ?? null,
    status: data.status ?? null,
    effortEstimate: data.effortEstimate || null,
  };
}

// Transform server data to form input
export function transformFeatureDataToForm(
  data: Partial<FeatureFormData>,
): Partial<FeatureFormInput> {
  return {
    ...data,
    priority: data.priority ?? undefined,
    status: data.status ?? undefined,
    effortEstimate: data.effortEstimate ?? undefined,
  };
}
