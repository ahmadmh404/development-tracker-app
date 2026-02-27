import {
  featureStatuses,
  priorities,
  projectStatuses,
  taskStatuses,
} from "./lib/validations";

import { Task, Decision, Feature, Project } from "./lib/db/schema";

export type TaskStatus = (typeof taskStatuses)[number];
export type Priority = (typeof priorities)[number];
export type ProjectStatus = (typeof projectStatuses)[number];
export type FeatureStatus = (typeof featureStatuses)[number];

export type { Task, Decision, Feature, Project };
