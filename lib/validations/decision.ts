import { z } from "zod";

// Base schema for server actions (pros/cons as arrays)
export const decisionSchema = z.object({
  text: z.string().min(1, "Decision text is required"),
  date: z.date().nullable(),
  pros: z.array(z.string()).nullable(),
  cons: z.array(z.string()).nullable(),
  alternatives: z.string().nullable(),
});

// Form input schema (pros/cons as newline-separated strings)
export const decisionFormSchema = z.object({
  text: z.string().min(1, "Decision text is required"),
  date: z.string().optional(),
  pros: z.string().optional(), // Newline-separated in form
  cons: z.string().optional(), // Newline-separated in form
  alternatives: z.string().optional(),
});

// Types
export type DecisionFormData = z.infer<typeof decisionSchema>;
export type DecisionFormInput = z.infer<typeof decisionFormSchema>;

// Transform form input to server data
export function transformDecisionFormToData(
  data: DecisionFormInput,
): DecisionFormData {
  return {
    ...data,
    pros: data.pros
      ? data.pros
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean)
      : [],
    cons: data.cons
      ? data.cons
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean)
      : [],
    alternatives: data.alternatives ?? null,
    date: data.date ? new Date(data.date) : null,
  };
}

// Transform server data to form input
export function transformDecisionDataToForm(
  data: Partial<DecisionFormData>,
): Partial<DecisionFormInput> {
  return {
    ...data,
    pros: data.pros?.join("\n"),
    cons: data.cons?.join("\n"),
    alternatives: data.alternatives || undefined,
    date: data.date
      ? new Date(data.date).toISOString().split("T")[0]
      : undefined,
  };
}
