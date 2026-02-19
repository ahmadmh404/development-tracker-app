// Mock data types and interfaces for the project tracker

import { tasks } from "./db";

export type Priority = "High" | "Medium" | "Low";
export type ProjectStatus =
  | "Planning"
  | "In Progress"
  | "Launched"
  | "Archived";
export type FeatureStatus = "To Do" | "In Progress" | "Done";
export type TaskStatus = "To Do" | "In Progress" | "Done";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate?: string;
  effortEstimate?: string;
}

export interface Decision {
  id: string;
  date: string;
  text: string;
  pros?: string[];
  cons?: string[];
  alternatives?: string;
  featureId: string;
}

export interface Feature {
  id: string;
  name: string;
  description: string;
  priority: Priority;
  status: FeatureStatus;
  effortEstimate: string;
  tasks: Task[];
  projectId: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  techStack: string[];
  lastUpdated: string;
  features: Feature[];
}

// Mock Projects
export const mockProjects: Project[] = [
  {
    id: "1",
    name: "E-Commerce Platform",
    description: "Modern online store with cart and checkout",
    status: "In Progress",
    techStack: ["Next.js", "TypeScript", "Tailwind", "Stripe"],
    lastUpdated: "2026-02-18",
    features: [
      {
        id: "1-1",
        name: "Product Catalog",
        description: "Display products with filtering and search",
        priority: "High",
        status: "Done",
        effortEstimate: "8 hours",
        tasks: [
          {
            id: "1-1-1",
            title: "Create product grid component",
            description: "Build responsive product grid with cards",
            status: "Done",
            dueDate: "2026-02-10",
            effortEstimate: "2 hours",
          },
          {
            id: "1-1-2",
            title: "Add filter sidebar",
            description: "Category and price range filters",
            status: "Done",
            effortEstimate: "3 hours",
          },
        ],
        projectId: "1",
      },
      {
        id: "1-2",
        name: "Refactor Dashboard UI for Better Mobile",
        description:
          "Improve responsive behavior and touch interactions on mobile devices",
        priority: "Medium",
        status: "In Progress",
        effortEstimate: "12 hours",
        tasks: [
          {
            id: "1-2-1",
            title: "Extract Header component",
            description: "Separate header logic for reusability",
            status: "Done",
            effortEstimate: "1 hour",
          },
          {
            id: "1-2-2",
            title: "Migrate grid to flex layout",
            description:
              "Replace CSS grid with flexbox for better mobile control",
            status: "Done",
            dueDate: "2026-02-15",
            effortEstimate: "2 hours",
          },
          {
            id: "1-2-3",
            title: "Add mobile menu toggle",
            description: "Implement hamburger menu for mobile navigation",
            status: "In Progress",
            dueDate: "2026-02-19",
            effortEstimate: "2 hours",
          },
          {
            id: "1-2-4",
            title: "Optimize touch targets",
            description: "Increase button sizes for better mobile UX",
            status: "To Do",
            effortEstimate: "1 hour",
          },
          {
            id: "1-2-5",
            title: "Update media queries",
            description: "Fine-tune breakpoints for tablets and phones",
            status: "To Do",
            effortEstimate: "2 hours",
          },
          {
            id: "1-2-6",
            title: "Test on real devices",
            description: "Manual testing on iOS and Android",
            status: "To Do",
            effortEstimate: "3 hours",
          },
        ],
        projectId: "1",
      },
      {
        id: "1-3",
        name: "Shopping Cart",
        description: "Add to cart functionality with quantity management",
        priority: "High",
        status: "In Progress",
        effortEstimate: "10 hours",
        tasks: [
          {
            id: "1-3-1",
            title: "Create cart context",
            description: "Global state management for cart",
            status: "Done",
            effortEstimate: "2 hours",
          },
          {
            id: "1-3-2",
            title: "Build cart drawer component",
            description: "Slide-out cart with item list",
            status: "In Progress",
            dueDate: "2026-02-20",
            effortEstimate: "4 hours",
          },
          {
            id: "1-3-3",
            title: "Add quantity controls",
            description: "Increment/decrement item quantities",
            status: "To Do",
            effortEstimate: "2 hours",
          },
        ],
        projectId: "1",
      },
      {
        id: "1-4",
        name: "Stripe Integration",
        description: "Payment processing with Stripe Checkout",
        priority: "High",
        status: "To Do",
        effortEstimate: "15 hours",
        tasks: [],
        projectId: "1",
      },
    ],
  },
  {
    id: "2",
    name: "Blog CMS",
    description: "Markdown-based blog with admin panel",
    status: "Planning",
    techStack: ["Next.js", "MDX", "Supabase"],
    lastUpdated: "2026-02-15",
    features: [
      {
        id: "2-1",
        name: "MDX Parser",
        description: "Parse and render markdown content",
        priority: "High",
        status: "To Do",
        effortEstimate: "6 hours",
        tasks: [],
        projectId: "2",
      },
      {
        id: "2-2",
        name: "Admin Dashboard",
        description: "Create and edit posts",
        priority: "Medium",
        status: "To Do",
        effortEstimate: "20 hours",
        tasks: [],
        projectId: "2",
      },
    ],
  },
  {
    id: "3",
    name: "Weather Dashboard",
    description: "Real-time weather data visualization",
    status: "Launched",
    techStack: ["React", "TypeScript", "OpenWeather API"],
    lastUpdated: "2026-01-28",
    features: [
      {
        id: "3-1",
        name: "Location Search",
        description: "Search cities and display weather",
        priority: "High",
        status: "Done",
        effortEstimate: "8 hours",
        tasks: [
          {
            id: "3-1-1",
            title: "Implement search API",
            description: "Connect to OpenWeather geocoding",
            status: "Done",
            effortEstimate: "3 hours",
          },
        ],
        projectId: "3",
      },
    ],
  },
];

// Mock Decisions
export const mockDecisions: Decision[] = [
  {
    id: "d1",
    date: "2026-02-16",
    text: "Chose shadcn Card over custom div for dashboard layout",
    pros: [
      "Consistent styling with rest of app",
      "Built-in responsive behavior",
      "Accessible by default",
    ],
    cons: ["Adds ~10KB to bundle", "Less fine-grained control over styles"],
    alternatives: "Custom div with Tailwind classes",
    featureId: "1-2",
  },
  {
    id: "d2",
    date: "2026-02-14",
    text: "Decided to use Flexbox instead of CSS Grid for mobile-first layout",
    pros: [
      "Better browser support on older mobile devices",
      "More intuitive for single-direction layouts",
      "Easier to adjust spacing dynamically",
    ],
    cons: ["Less powerful for complex 2D layouts", "Requires more nesting"],
    alternatives: "CSS Grid with fallback styles",
    featureId: "1-2",
  },
  {
    id: "d3",
    date: "2026-02-12",
    text: "Selected lucide-react for icons over react-icons",
    pros: [
      "Smaller bundle size",
      "Consistent design language",
      "Better TypeScript support",
    ],
    cons: ["Fewer icon options", "Less community adoption"],
    alternatives: "react-icons, heroicons",
    featureId: "1-2",
  },
  {
    id: "d4",
    date: "2026-02-08",
    text: "Use Zustand for cart state instead of Context API",
    pros: [
      "Better performance with less re-renders",
      "Simpler API",
      "Built-in persistence",
    ],
    cons: ["Additional dependency", "Team needs to learn new library"],
    alternatives: "React Context, Redux",
    featureId: "1-3",
  },
];

// Helper function to get feature by ID
export function getFeatureById(featureId: string): Feature | undefined {
  for (const project of mockProjects) {
    const feature = project.features.find((f) => f.id === featureId);
    if (feature) return feature;
  }
  return undefined;
}

// Helper function to get decisions for a feature
export function getDecisionsForFeature(featureId: string): Decision[] {
  return mockDecisions.filter((d) => d.featureId === featureId);
}

// Helper function to get all recent decisions (across all projects)
export function getRecentDecisions(limit: number = 10): Decision[] {
  return mockDecisions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}

// Helper function to get project by ID
export function getProjectById(projectId: string): Project | undefined {
  return mockProjects.find((p) => p.id === projectId);
}
