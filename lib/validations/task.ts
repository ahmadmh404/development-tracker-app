import { z } from "zod";

// Status enum matching the database schema
export const taskStatuses = ["To Do", "In Progress", "Done"] as const;

// Base schema for server actions
export const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().default(""),
  status: z.enum(taskStatuses).nullable(),
  dueDate: z.date().nullable(), // ISO date string
  effortEstimate: z.string().nullable(),
  featureId: z.string().uuid(),
});

// Form input schema (same as base for tasks)
export const taskFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().default(""),
  status: z.enum(taskStatuses).optional(),
  dueDate: z.string().optional(), // Date input returns string
  effortEstimate: z.string().optional(),
  featureId: z.string().uuid(),
});

// Types
export type TaskFormData = z.infer<typeof taskSchema>;
export type TaskFormInput = z.infer<typeof taskFormSchema>;

// Transform form input to server data
export function transformTaskFormToData(data: TaskFormInput): TaskFormData {
  return {
    ...data,
    status: data.status ?? null,
    effortEstimate: data.effortEstimate ?? null,
    dueDate: data.dueDate ? new Date(data.dueDate) : null,
  };
}

// Transform server data to form input
export function transformTaskDataToForm(
  data: Partial<TaskFormData>,
): Partial<TaskFormInput> {
  return {
    ...data,
    status: data.status || undefined,
    effortEstimate: data.effortEstimate || undefined,
    // Ensure dueDate is in YYYY-MM-DD format for date input
    dueDate: data.dueDate
      ? new Date(data.dueDate).toISOString().split("T")[0]
      : undefined,
  };
}
