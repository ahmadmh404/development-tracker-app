# Project Tracker App - Agent Context Template

> **Purpose**: Optimized context for AI Coder/Planner agents working on this codebase.
> **Last Updated**: 2026-02-19
> **Version**: 1.0

---

## CORE RULES

1. **Stack**: Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, shadcn/ui, lucide-react
2. **Database**: PostgreSQL 17 (Docker), Drizzle 1.0+ ORM (to be added)
3. **MVP Scope**: Single-user, no auth. Core entities: Project → Features → (Tasks + Decisions)
4. **Style**: Iterative, lean MVP first. Prefer simplicity over abstraction.

### Critical Constraints

- **DO NOT** add authentication/authorization (out of MVP scope)
- **DO NOT** create new mock data structures - use existing types in `lib/mockData.ts`
- **DO NOT** install new UI libraries - use shadcn/ui components from `components/ui/`
- **ALWAYS** use `cn()` utility from `lib/utils.ts` for conditional class merging
- **ALWAYS** import icons from `lucide-react`
- **ALWAYS** use `'use client'` directive for client components

---

## CURRENT SCHEMA

```typescript
// From lib/mockData.ts - DO NOT MODIFY TYPES WITHOUT EXPLICIT REQUEST

type Priority = "High" | "Medium" | "Low";
type ProjectStatus = "Planning" | "In Progress" | "Launched" | "Archived";
type FeatureStatus = "To Do" | "In Progress" | "Done";
type TaskStatus = "To Do" | "In Progress" | "Done";

interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate?: string;
  effortEstimate?: string;
}

interface Decision {
  id: string;
  date: string;
  text: string;
  pros?: string[];
  cons?: string[];
  alternatives?: string;
  featureId: string;
}

interface Feature {
  id: string;
  name: string;
  description: string;
  priority: Priority;
  status: FeatureStatus;
  effortEstimate: string;
  tasks: Task[];
  projectId: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  techStack: string[];
  lastUpdated: string;
  features: Feature[];
}
```

---

## PROJECT STRUCTURE

```
app/
├── layout.tsx          # Root layout with sidebar + header
├── page.tsx            # Dashboard (stats, current project CTA)
├── globals.css         # Tailwind imports + CSS variables
└── projects/
    └── [id]/
        ├── page.tsx    # Project detail (features list, decisions)
        └── features/
            └── [featureId]/
                └── page.tsx  # Feature detail (tasks, decisions)

components/
├── ui/                 # shadcn/ui primitives (DO NOT EDIT)
├── app-sidebar.tsx     # Desktop navigation sidebar
├── app-header.tsx      # Top header with mobile menu
├── app-breadcrumb.tsx  # Breadcrumb navigation
├── feature-list.tsx    # Feature cards with progress
├── task-item.tsx       # Individual task row
├── decision-card.tsx   # Decision display with pros/cons
└── project-summary.tsx # Project card for dashboard

lib/
├── mockData.ts         # Types + mock data (source of truth for schema)
└── utils.ts            # cn() helper + shared utilities
```

---

## CODING CONVENTIONS

### Imports

```typescript
// 1. React/Next imports
import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

// 2. UI components (shadcn)
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// 3. App components
import { AppBreadcrumb } from "@/components/app-breadcrumb";

// 4. Lib utilities
import { cn } from "@/lib/utils";
import { mockProjects, getProjectById } from "@/lib/mockData";

// 5. Icons (always last)
import { ArrowRight, Plus } from "lucide-react";
```

### Component Pattern

```typescript
'use client'; // Required for client components

interface MyComponentProps {
  projectId: string;
  onAction?: () => void;
}

export function MyComponent({ projectId, onAction }: MyComponentProps) {
  // Hooks at top
  const [state, setState] = useState(initialValue);

  // Early returns for loading/error states
  if (!data) {
    return <EmptyState message="No data found" />;
  }

  // Main render
  return (
    <div className="space-y-4">
      {/* Content */}
    </div>
  );
}
```

### Styling

- Use Tailwind utility classes exclusively
- Use `cn()` for conditional classes: `cn('base-classes', condition && 'conditional-class')`
- Responsive: `className="flex flex-col sm:flex-row lg:grid"`
- Spacing: `space-y-4`, `gap-4`, `p-6 md:p-8`
- Typography: `text-balance`, `text-pretty`, `text-muted-foreground`

---

## PAST DECISIONS (Reference)

| Decision     | Choice            | Rationale                             |
| ------------ | ----------------- | ------------------------------------- |
| Icons        | lucide-react      | Smaller bundle, better TS support     |
| State (cart) | Zustand           | Performance, simpler API than Context |
| Layout       | Flexbox over Grid | Better mobile support                 |
| Cards        | shadcn Card       | Consistent styling, accessible        |

---

## ENVIRONMENT VARIABLES

```env
# Database (PostgreSQL in Docker)
DB_NAME=projecttracker
DB_USER=postgres
DB_PASSWORD=postgres
DB_PORT=5432
```

---

## COMMON TASKS TEMPLATES

### Adding a new page

1. Create `app/path/to/page.tsx`
2. Use `'use client'` if interactive
3. Wrap in container: `<div className="container mx-auto space-y-6 p-6 md:p-8">`
4. Add breadcrumb with `AppBreadcrumb`
5. Import types from `lib/mockData.ts`

### Adding a new component

1. Create in `components/` (not `components/ui/`)
2. Use existing shadcn primitives
3. Export as named export: `export function MyComponent() {}`
4. Add TypeScript props interface

### Modifying data display

1. Check `lib/mockData.ts` for existing types/helpers
2. Use helper functions: `getProjectById()`, `getFeatureById()`, `getDecisionsForFeature()`
3. Do not create new mock data arrays

---

## ANTI-PATTERNS TO AVOID

1. **Prop drilling** - If data needed deep, consider context or lift state
2. **Inline styles** - Use Tailwind classes
3. **New type definitions** - Reuse from `mockData.ts`
4. **Large components** - Split into smaller, focused components
5. **Fetching in layout** - Fetch in page components or use Server Components

---

## TOKEN-EFFICIENT CONTEXT INJECTION

For specific tasks, inject only relevant sections:

| Task Type          | Inject These Sections                             |
| ------------------ | ------------------------------------------------- |
| New page/route     | CORE RULES, PROJECT STRUCTURE, CODING CONVENTIONS |
| New component      | CODING CONVENTIONS, COMMON TASKS                  |
| Data/schema change | CURRENT SCHEMA, lib/mockData.ts content           |
| Bug fix            | Relevant component file + CODING CONVENTIONS      |
| Database/Drizzle   | CORE RULES, ENVIRONMENT VARIABLES                 |

---

## QUICK REFERENCE

- **Add shadcn component**: `npx shadcn@latest add [component-name]`
- **Run dev server**: `npm run dev`
- **Start database**: `docker-compose up -d`
- **Type check**: `npx tsc --noEmit`
