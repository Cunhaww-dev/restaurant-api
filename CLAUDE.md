# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev                          # Start dev server with hot reload (port 3333)
npm run knex -- migrate:latest       # Run pending migrations
npm run knex -- migrate:rollback     # Revert last migration
npm run knex -- seed:run             # Insert seed data
```

No build, test, or lint scripts are configured yet.

## Environment

Requires a `.env` file with `DATABASE_URL` pointing to a PostgreSQL instance. See `.env.example`. Node version: LTS Krypton (`lts/krypton`), managed via `.nvmrc`.

## Architecture

Layered: **Routes → Controllers → Services → Knex (database)**.

- `src/server.ts` — Express app, port 3333, registers routes + error handler last
- `src/routes/index.ts` — Aggregates all routers; health check at `GET /health/db`
- `src/controllers/` — HTTP layer only: `schema.parse()` + call service + `response.json()`
- `src/services/` — Business logic, Knex queries, `AppError` throws
- `src/schemas/` — Zod schemas for request body/query/param validation
- `src/database/knex.ts` — Knex singleton (PostgreSQL, SSL, pool max 3)
- `src/database/migrations/` — Knex migration files (timestamp-prefixed)
- `src/database/types/` — TypeScript types for DB rows (`*Row`) and inserts (`*Insert`)
- `src/middlewares/error-handling.ts` — Catches `AppError` and `ZodError`, maps to HTTP responses
- `src/utils/AppError.ts` — Custom error class; throw with `new AppError("message", statusCode)`
- `src/docs/swagger/` — OpenAPI spec; `openapi.ts` assembles paths from `paths/`; served at `/docs`

## Path alias

`@/*` maps to `src/*` (configured in `tsconfig.json`).

## Code style

Always use inline exports — place `export` on the declaration itself, never a separate export block at the end of the file:

```ts
// correct
export class ProductService { ... }
export const productService = new ProductService();

// wrong
class ProductService { ... }
export { ProductService };
```

## Adding a new feature

Typical flow: migration → seed (optional) → DB type in `database/types/` → service in `services/` → controller → route file → register in `routes/index.ts` → Swagger path doc in `docs/swagger/paths/`.

## Domain model

- **products** — name (UNIQUE), price
- **tables** — restaurant tables
- **tables_sessions** — tracks open/closed sessions per table (`opened_at`, `closed_at`)
- **orders** — line items tied to a session (`table_session_id`, `product_id`, `quantity`, `unit_price`)
