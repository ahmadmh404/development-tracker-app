# Debug Mode Rules

## Non-Obvious Debugging Patterns

**Database Issues**:

- PostgreSQL runs in Docker: `docker-compose up -d` to start
- Connection uses env vars from `.env`: DB_NAME, DB_USER, DB_PASSWORD, DB_PORT
- Drizzle not yet integrated - all data is mock data from `lib/mockData.ts`

**Common Issues**:

- "Project not found" → Check route param matches mock project IDs ('1', '2', '3')
- Missing styles → Ensure Tailwind class is not typo'd (no runtime error, just missing style)
- Hydration errors → Check for client/server mismatches in components using `'use client'`

**Mock Data Mutation**:

- Current implementation uses local state, not persistent
- Changes lost on page refresh - this is expected MVP behavior
