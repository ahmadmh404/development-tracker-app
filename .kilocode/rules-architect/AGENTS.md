# Architect Mode Rules

## Non-Obvious Architectural Constraints

**MVP Scope Limitations**:

- Single-user application - no authentication/authorization system
- No multi-tenancy or user management
- Data persistence currently mock-only (Drizzle integration pending)

**Entity Relationships**:

```
Project (1) ──► (N) Feature
Feature (1) ──► (N) Task
Feature (1) ──► (N) Decision
```

- Refactors are modeled as Features with `isRefactor` implied by name/description
- Decisions are feature-scoped, not project-scoped

**State Management**:

- Currently using React local state only
- Zustand mentioned in past decisions for cart state (E-Commerce project example)
- No global state library in project-tracker app yet

**Database Integration Path**:

- PostgreSQL container configured in `docker-compose.yml`
- Environment variables in `.env`
- Drizzle to be added: `npm i drizzle-orm pg dotenv; npm i -D drizzle-kit tsx @types/pg`
- Schema should mirror types in `lib/mockData.ts`
