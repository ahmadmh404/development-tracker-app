import {
  pgTable,
  text,
  timestamp,
  pgEnum,
  uuid,
  varchar,
  jsonb,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import {
  featureStatuses,
  priorities,
  projectStatuses,
  taskStatuses,
} from "../validations";

// ═══════════════════════════════════════════════════════════════
// ENUMS
// ═══════════════════════════════════════════════════════════════

export const priorityEnum = pgEnum("priority", priorities);
export const projectStatusEnum = pgEnum("project_status", projectStatuses);
export const featureStatusEnum = pgEnum("feature_status", featureStatuses);
export const taskStatusEnum = pgEnum("task_status", taskStatuses);

// ═══════════════════════════════════════════════════════════════
// TABLES
// ═══════════════════════════════════════════════════════════════

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  status: projectStatusEnum("status").default("Planning").notNull(),
  techStack: jsonb("tech_stack").$type<string[]>().default([]).notNull(),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const features = pgTable("features", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  priority: priorityEnum("priority").default("Medium").notNull(),
  status: featureStatusEnum("status").default("To Do").notNull(),
  effortEstimate: varchar("effort_estimate", { length: 50 }),
  projectId: uuid("project_id")
    .references(() => projects.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  status: taskStatusEnum("status").default("To Do").notNull(),
  dueDate: timestamp("due_date"),
  effortEstimate: varchar("effort_estimate", { length: 50 }),
  featureId: uuid("feature_id")
    .references(() => features.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const decisions = pgTable("decisions", {
  id: uuid("id").primaryKey().defaultRandom(),
  date: timestamp("date").defaultNow().notNull(),
  text: text("text").notNull(),
  pros: jsonb("pros").$type<string[]>().default([]),
  cons: jsonb("cons").$type<string[]>().default([]),
  alternatives: text("alternatives"),
  featureId: uuid("feature_id")
    .references(() => features.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ═══════════════════════════════════════════════════════════════
// RELATIONS
// ═══════════════════════════════════════════════════════════════

export const projectsRelations = relations(projects, ({ many }) => ({
  features: many(features),
}));

export const featuresRelations = relations(features, ({ one, many }) => ({
  project: one(projects, {
    fields: [features.projectId],
    references: [projects.id],
  }),
  tasks: many(tasks),
  decisions: many(decisions),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  feature: one(features, {
    fields: [tasks.featureId],
    references: [features.id],
  }),
}));

export const decisionsRelations = relations(decisions, ({ one }) => ({
  feature: one(features, {
    fields: [decisions.featureId],
    references: [features.id],
  }),
}));

// ═══════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type Feature = typeof features.$inferSelect;
export type NewFeature = typeof features.$inferInsert;
export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
export type Decision = typeof decisions.$inferSelect;
export type NewDecision = typeof decisions.$inferInsert;
