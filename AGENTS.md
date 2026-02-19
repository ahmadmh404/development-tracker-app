# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Build Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # ESLint check
```

Note: No test framework configured yet.

## Critical Patterns

**Types Source of Truth**: All data types defined in `lib/mockData.ts`. Do NOT create new type definitions for Project/Feature/Task/Decision - import from mockData.

**Path Alias**: `@/*` maps to project root (not `src/`). Example: `import { Button } from '@/components/ui/button'`.

**Class Merging**: Always use `cn()` from `lib/utils.ts` for conditional classes:

```typescript
import { cn } from '@/lib/utils';
className={cn('base-classes', condition && 'conditional-class')}
```

**Client Components**: Add `'use client'` directive at top of files using hooks (useState, useParams, etc.).

**Icons**: Use lucide-react only (configured in components.json). Example: `import { Plus, ArrowRight } from 'lucide-react'`.

## Architecture Notes

- **MVP Scope**: Single-user, no authentication. Do not add auth features.
- **Database**: PostgreSQL in Docker (see docker-compose.yml). Drizzle not yet integrated.
- **UI Library**: shadcn/ui with "new-york" style. Add components via `npx shadcn@latest add [component]`.
- **Entity Hierarchy**: Project → Features → (Tasks + Decisions). Refactors are normal Features.
