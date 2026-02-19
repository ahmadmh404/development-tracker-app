# Code Mode Rules

## Non-Obvious Coding Patterns

**Import Order** (observed in codebase):

1. React/Next imports
2. UI components (shadcn)
3. App components
4. Lib utilities
5. Icons (lucide-react) - always last

**Component Pattern**:

- Early returns for loading/error states
- Hooks at top of component
- Use `EmptyState` component for empty data (from `components/empty-state.tsx`)

**Styling Conventions**:

- Container: `className="container mx-auto space-y-6 p-6 md:p-8"`
- Responsive: `flex flex-col sm:flex-row lg:grid`
- Typography: `text-balance`, `text-pretty`, `text-muted-foreground`

**Data Access**:

- Use helper functions from `lib/mockData.ts`: `getProjectById()`, `getFeatureById()`, `getDecisionsForFeature()`
- Do not create new mock data arrays
