# Loader States Plan by Feature

## Overview

This document outlines the loading state strategy for the Project Tracker App. The app currently uses React `Suspense` boundaries but lacks proper loading fallbacks. This plan provides a consistent approach to implementing loading states across all features.

## Existing Components

The app already has these UI components available:

- **[`Skeleton`](components/ui/skeleton.tsx)** - Animated pulse component for content placeholders
- **[`Spinner`](components/ui/spinner.tsx)** - Loader2 icon spinner for inline loading
- **[`EmptyState`](components/empty-state.tsx)** - Component for empty data states

## Loading State Patterns

### Pattern 1: Skeleton Cards

Use for grid/list layouts where multiple items are loading.

```tsx
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

function CardSkeleton() {
  return (
    <Card>
      <CardHeader className="space-y-2">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-full" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-1/2" />
      </CardContent>
    </Card>
  );
}
```

### Pattern 2: Inline Spinner

Use for buttons, small areas, or inline loading states.

```tsx
import { Spinner } from "@/components/ui/spinner";

function LoadingButton() {
  return (
    <Button disabled>
      <Spinner className="mr-2" />
      Loading...
    </Button>
  );
}
```

### Pattern 3: Full Page Loading

Use for page-level Suspense fallbacks.

```tsx
function PageLoading() {
  return (
    <div className="container mx-auto space-y-6 p-6 md:p-8">
      <Skeleton className="h-8 w-48" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
```

---

## Feature-by-Feature Implementation

### 1. Dashboard Page (`app/page.tsx`)

#### Components Needing Loading States:

| Component             | Loading Type           | Priority |
| --------------------- | ---------------------- | -------- |
| `DashboardStats`      | 3 Stat Card Skeletons  | High     |
| `CurrentProjectCTA`   | Single Card Skeleton   | Medium   |
| `ProjectsSummaryList` | Grid of Card Skeletons | High     |

#### Implementation:

```tsx
// components/loading/dashboard-loading.tsx

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function DashboardStatsLoading() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4 rounded-full" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 mb-1" />
            <Skeleton className="h-3 w-32" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function CurrentProjectCTALoading() {
  return (
    <Card className="border-primary/50 bg-primary/5">
      <CardHeader>
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-9 w-24" />
        </div>
      </CardContent>
    </Card>
  );
}

export function ProjectsSummaryListLoading() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-4 w-1/2" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-16" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
```

#### Usage in `app/page.tsx`:

```tsx
import {
  DashboardStatsLoading,
  CurrentProjectCTALoading,
  ProjectsSummaryListLoading
} from '@/components/loading/dashboard-loading';

// Replace existing Suspense boundaries:
<Suspense fallback={<DashboardStatsLoading />}>
  <DashboardStats />
</Suspense>

<Suspense fallback={<CurrentProjectCTALoading />}>
  <CurrentProjectCTA />
</Suspense>

<Suspense fallback={<ProjectsSummaryListLoading />}>
  <ProjectsSummaryList />
</Suspense>
```

---

### 2. Project Detail Page (`app/projects/[id]/page.tsx`)

#### Components Needing Loading States:

| Component          | Loading Type                 | Priority |
| ------------------ | ---------------------------- | -------- |
| Page Header        | Title + Description Skeleton | High     |
| `ProjectFeatures`  | Feature List Skeleton        | High     |
| `ProjectDecisions` | Decision Cards Skeleton      | Medium   |

#### Implementation:

```tsx
// components/loading/project-loading.tsx

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function ProjectHeaderLoading() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-9 w-40" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-5 w-14" />
      </div>
    </div>
  );
}

export function FeatureListLoading() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-28" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-5 w-20" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <div className="flex gap-4">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function DecisionListLoading() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 2 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-16 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
```

---

### 3. Feature Detail Page (`app/projects/[id]/features/[featureId]/page.tsx`)

#### Components Needing Loading States:

| Component          | Loading Type                  | Priority |
| ------------------ | ----------------------------- | -------- |
| Feature Header     | Title + Controls Skeleton     | High     |
| `FeatureTasks`     | Kanban-style Column Skeletons | High     |
| `FeatureDecisions` | Decision Cards Skeleton       | Medium   |

#### Implementation:

```tsx
// components/loading/feature-loading.tsx

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function FeatureHeaderLoading() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-36" />
        </div>
      </div>
      <Skeleton className="h-5 w-28" />
    </div>
  );
}

export function TasksLoading() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-8 w-24" />
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, colIndex) => (
          <div key={colIndex} className="space-y-3">
            <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-6" />
            </div>
            <div className="space-y-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-3 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DecisionsLoading() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-8 w-28" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4 space-y-2">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

---

### 4. Sidebar Navigation (`components/app-sidebar.tsx`)

#### Loading State:

```tsx
// components/loading/sidebar-loading.tsx

import { Skeleton } from "@/components/ui/skeleton";

export function SidebarLoading() {
  return (
    <div className="space-y-4 p-4">
      <Skeleton className="h-6 w-32" />
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-full" />
        ))}
      </div>
    </div>
  );
}
```

---

### 5. Dialog Loading States

For dialogs that perform async operations (save, delete, etc.):

```tsx
// components/loading/dialog-loading.tsx

import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";

export function SubmitButton({
  isSubmitting,
  children,
}: {
  isSubmitting: boolean;
  children: React.ReactNode;
}) {
  return (
    <Button type="submit" disabled={isSubmitting}>
      {isSubmitting && <Spinner className="mr-2" />}
      {children}
    </Button>
  );
}
```

---

## Error States

Enhance the existing `EmptyState` component to handle errors:

```tsx
// components/error-state.tsx

import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title,
  message = "Something went wrong. Please try again.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-destructive/50 bg-destructive/10 p-12 text-center",
        className,
      )}
    >
      <AlertCircle className="mb-4 h-12 w-12 text-destructive" />
      <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
      <p className="mb-4 text-sm text-muted-foreground">{message}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      )}
    </div>
  );
}
```

---

## Implementation Checklist

### Phase 1: Core Loading Components

- [ ] Create `components/loading/` directory
- [ ] Create `dashboard-loading.tsx`
- [ ] Create `project-loading.tsx`
- [ ] Create `feature-loading.tsx`
- [ ] Create `sidebar-loading.tsx`
- [ ] Create `dialog-loading.tsx`
- [ ] Create `error-state.tsx`

### Phase 2: Dashboard Page

- [ ] Add `DashboardStatsLoading` fallback
- [ ] Add `CurrentProjectCTALoading` fallback
- [ ] Add `ProjectsSummaryListLoading` fallback

### Phase 3: Project Detail Page

- [ ] Add `ProjectHeaderLoading` fallback
- [ ] Add `FeatureListLoading` fallback
- [ ] Add `DecisionListLoading` fallback

### Phase 4: Feature Detail Page

- [ ] Add `FeatureHeaderLoading` fallback
- [ ] Add `TasksLoading` fallback
- [ ] Add `DecisionsLoading` fallback

### Phase 5: Dialog Forms

- [ ] Add loading states to `ProjectDialog`
- [ ] Add loading states to `FeatureDialog`
- [ ] Add loading states to `TaskDialog`
- [ ] Add loading states to `DecisionDialog`

---

## Best Practices

1. **Consistent Timing**: Use `animate-pulse` for all skeletons to maintain visual consistency.

2. **Proportional Sizing**: Skeletons should approximate the size of the content they replace.

3. **Progressive Loading**: Load critical content first (headers, primary actions), then secondary content.

4. **Error Boundaries**: Wrap async components in error boundaries with retry functionality.

5. **Accessibility**: Add `aria-busy="true"` to loading containers and `aria-live="polite"` for loading announcements.

6. **Performance**: Use CSS animations (animate-pulse) instead of JavaScript animations for better performance.

---

## File Structure

```
components/
├── loading/
│   ├── dashboard-loading.tsx
│   ├── project-loading.tsx
│   ├── feature-loading.tsx
│   ├── sidebar-loading.tsx
│   ├── dialog-loading.tsx
│   └── index.ts
├── error-state.tsx
└── empty-state.tsx
```
