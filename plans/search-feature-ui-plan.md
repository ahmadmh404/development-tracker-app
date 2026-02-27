# Search Feature UI - Architecture Plan

## Overview

Implement a real-time search feature in the application header that allows users to search for **Projects** and **Features**. The search results appear in a dropdown component below the search input, updating in real-time as the user types.

---

## Current State Analysis

### Existing Components

- [`components/app-header.tsx`](components/app-header.tsx:1) - Contains the search input (currently non-functional)
- [`components/ui/command.tsx`](components/ui/command.tsx:1) - Command palette component from shadcn/cmdk (already installed)
- [`components/ui/popover.tsx`](components/ui/popover.tsx:1) - Popover component from Radix UI (available)

### Data Types (from [`lib/db/schema.ts`](lib/db/schema.ts:1))

```typescript
// Project type
type Project = {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  techStack: string[];
  lastUpdated: Date;
  createdAt: Date;
};

// Feature type
type Feature = {
  id: string;
  name: string;
  description: string;
  priority: Priority;
  status: FeatureStatus;
  effortEstimate: string | null;
  projectId: string;
  createdAt: Date;
};
```

---

## Architecture

### Component Structure

```
components/
└── search/
    ├── search-dropdown.tsx      # Main dropdown container
    ├── search-input.tsx         # Enhanced search input with trigger
    ├── search-result-item.tsx   # Individual result item
    └── search-section.tsx       # Section header (Projects/Features)
```

### Server Actions (to create)

```typescript
// app/actions/search.ts

export async function searchProjects(query: string): Promise<Project[]>
# - Search projects by name (case-insensitive)
# - Return top 5 results

export async function searchFeatures(query: string): Promise<(Feature & { project: { name: string } })[]>
# - Search features by name (case-insensitive)
# - Return top 5 results
# - Include project name for context
```

### UI Flow

1. User focuses on search input in [`app-header.tsx`](components/app-header.tsx:16)
2. User types query (minimum 2 characters)
3. Server action fetches matching projects and features in parallel
4. Dropdown appears below search input showing:
   - **Projects Section** (if any matches)
     - Each project shows: name, status badge
     - Click navigates to `/projects/[id]`
   - **Features Section** (if any matches)
     - Each feature shows: name, project name (context), priority badge
     - Click navigates to `/projects/[projectId]/features/[featureId]`
5. User clicks outside or presses Escape to close

---

## Implementation Steps

### Step 1: Create Server Actions

**File**: `app/actions/search.ts`

```typescript
"use server";

import { db } from "@/lib/db";
import { projects, features } from "@/lib/db/schema";
import { sql, or, desc } from "drizzle-orm";

export async function searchProjects(query: string) {
  if (!query || query.length < 2) return [];

  return db.query.projects.findMany({
    where: sql`${projects.name} ILIKE ${`%${query}%`}`,
    limit: 5,
    orderBy: [desc(projects.lastUpdated)],
  });
}

export async function searchFeatures(query: string) {
  if (!query || query.length < 2) return [];

  return db.query.features.findMany({
    where: sql`${features.name} ILIKE ${`%${query}%`}`,
    limit: 5,
    orderBy: [desc(features.createdAt)],
    with: {
      project: {
        columns: { name: true },
      },
    },
  });
}
```

### Step 2: Create Search Result Item Component

**File**: `components/search/search-result-item.tsx`

- Use `'use client'` directive
- Accept `icon`, `title`, `subtitle`, `href`, `badge` props
- Use `cn()` from `lib/utils.ts` for conditional classes
- Show hover state with `data-[selected=true]:bg-accent`

### Step 3: Create Search Section Component

**File**: `components/search/search-section.tsx`

- Accept `title` and `children` props
- Render section header with `text-muted-foreground text-xs font-medium`
- Render separator below

### Step 4: Create Search Dropdown Component

**File**: `components/search/search-dropdown.tsx`

- Use `'use client'` directive
- Manage `isOpen` state
- Use `useTransition` for async operations
- Render results in two sections: Projects, Features
- Handle empty state: "No results found"
- Handle loading state with skeleton items

### Step 5: Create Search Input Component

**File**: `components/search/search-input.tsx`

- Use `'use client'` directive
- Wrap Input with PopoverTrigger
- Connect to SearchDropdown
- Debounce input (300ms recommended)

### Step 6: Update App Header

**File**: `components/app-header.tsx`

- Replace basic Input with SearchInput component
- Import new search components
- Remove existing non-functional search input

---

## UI/UX Specifications

### Search Input

- Position: Right side of header
- Width: `max-w-md` (approx 320px)
- Placeholder: "Search projects, features..."
- Icon: `Search` from lucide-react (left side)
- Minimum query length: 2 characters
- Debounce: 300ms

### Dropdown Panel

- Position: Below search input, aligned to left
- Width: Same as search input
- Max height: `max-h-[400px]` with overflow scroll
- Background: `bg-popover`
- Border: 1px `border-border`
- Border radius: `rounded-md`
- Shadow: `shadow-md`

### Result Items

- Height: `py-2 px-3`
- Layout: Icon (left) | Title + Subtitle (center, flex-1) | Badge (right)
- Icon size: `size-4`
- Hover: `data-[selected=true]:bg-accent`
- Cursor: `cursor-default select-none`

### Sections

- **Projects Section**
  - Header: "Projects" with `FolderKanban` icon
  - Item icon: `FolderKanban`
  - Badge: Project status (color-coded)

- **Features Section**
  - Header: "Features" with `Layers` icon
  - Item icon: `Layers`
  - Badge: Priority (High/Medium/Low with colors)
  - Subtitle: Project name for context

### Empty State

- Show when query length >= 2 but no results
- Message: "No results found for '[query]'"
- Centered text, `text-muted-foreground`

### Loading State

- Show 3 skeleton items per section while loading
- Use `Skeleton` from `components/ui/skeleton.tsx`

---

## Component Props

### SearchResultItemProps

```typescript
interface SearchResultItemProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  href: string;
  badge?: {
    text: string;
    variant?: "default" | "secondary" | "destructive" | "outline";
    className?: string;
  };
  onClick?: () => void;
}
```

### SearchDropdownProps

```typescript
interface SearchDropdownProps {
  query: string;
  onSelect: (href: string) => void;
}
```

### SearchInputProps

```typescript
interface SearchInputProps {
  className?: string;
}
```

---

## Acceptance Criteria

1. ✅ Search input appears in header with search icon
2. ✅ Typing triggers search after 2+ characters
3. ✅ Results update in real-time as user types
4. ✅ Projects section shows at top when matches exist
5. ✅ Features section shows below projects
6. ✅ Each result shows relevant info (name, status/priority, project context)
7. ✅ Clicking result navigates to correct page
8. ✅ Clicking outside or pressing Escape closes dropdown
9. ✅ Loading state shows while fetching results
10. ✅ Empty state shows when no matches found
11. ✅ Works on mobile (responsive)

---

## File Dependencies

### New Files to Create

1. `app/actions/search.ts` - Server actions
2. `components/search/search-dropdown.tsx` - Dropdown component
3. `components/search/search-input.tsx` - Search input with trigger
4. `components/search/search-result-item.tsx` - Result item
5. `components/search/search-section.tsx` - Section header

### Files to Modify

1. `components/app-header.tsx` - Integrate search components

### Existing Components to Reuse

- `components/ui/input.tsx` - Input component
- `components/ui/popover.tsx` - Popover for dropdown
- `components/ui/badge.tsx` - Status/priority badges
- `components/ui/skeleton.tsx` - Loading skeletons
- `lucide-react` icons - `Search`, `FolderKanban`, `Layers`
