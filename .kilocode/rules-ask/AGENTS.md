# Ask Mode Rules

## Non-Obvious Documentation Context

**Entity Hierarchy**:

- Project → Features → (Tasks + Decisions)
- Refactors are treated as normal Features (not a separate entity type)
- Decisions are linked to Features via `featureId`

**Mock Data Structure**:

- All types defined in `lib/mockData.ts` - this is the schema source of truth
- Helper functions available: `getProjectById()`, `getFeatureById()`, `getDecisionsForFeature()`, `calculateProgress()`

**UI Component Library**:

- shadcn/ui with "new-york" style variant
- Components in `components/ui/` are auto-generated - do not edit directly
- Add new components via: `npx shadcn@latest add [component-name]`

**Routing Structure**:

- Dashboard: `/` (root)
- Project detail: `/projects/[id]`
- Feature detail: `/projects/[id]/features/[featureId]`
