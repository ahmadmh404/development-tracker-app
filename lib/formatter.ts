import { tasks as tasksTable } from "./db/schema";

// Helper function to calculate progress percentage
export function calculateProgress(
  tasks: Pick<typeof tasksTable.$inferSelect, "status">[],
): number {
  if (tasks.length === 0) return 0;
  const completedTasks = tasks.filter((t) => t.status === "Done").length;
  return Math.round((completedTasks / tasks.length) * 100);
}
