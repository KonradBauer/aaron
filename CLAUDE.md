# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

This project uses the Payload CMS skill at `.claude/skills/payload/`.
Start with `.claude/skills/payload/SKILL.md` for a quick reference, then see `.claude/skills/payload/reference/` for detailed docs.

## Stack

Payload CMS 3.x + Next.js 16 (App Router) + MongoDB + React 19 + TypeScript. Package manager: **pnpm**.

## Commands

```bash
pnpm dev              # dev server (http://localhost:3000)
pnpm devsafe          # rm -rf .next && dev (use when hot-reload breaks)
pnpm build            # production build
pnpm start            # serve production build

pnpm lint             # ESLint
pnpm test             # int + e2e
pnpm test:int         # Vitest integration tests (tests/int/**/*.int.spec.ts)
pnpm test:e2e         # Playwright E2E tests (tests/e2e/)

pnpm generate:types   # regenerate src/payload-types.ts after collection changes
pnpm generate:importmap  # regenerate admin/importMap.js after plugin/component changes
```

Run `pnpm generate:types` after every change to collection fields — `src/payload-types.ts` is auto-generated and must stay in sync.

## Environment

Copy `.env.example` → `.env`. Required vars:

```
DATABASE_URL=mongodb://127.0.0.1/<dbname>
PAYLOAD_SECRET=<random string>
```

Docker MongoDB: `docker-compose up -d` (set `DATABASE_URL` to `mongodb://127.0.0.1/<dbname>`).

## Architecture

### Next.js Route Groups

Two parallel route groups in `src/app/`:

| Group | Path | Purpose |
|-------|------|---------|
| `(frontend)` | `/` | Public-facing site (React Server Components) |
| `(payload)` | `/admin`, `/api/*` | Payload admin panel + REST/GraphQL API |

Payload is mounted via `withPayload()` in `next.config.ts` — both layers run in a single Next.js process.

### Payload Config (`src/payload.config.ts`)

Central config: collections, editor, DB adapter, secret, TypeScript output path. All collections are registered here. Adding a new collection = add to `collections: [...]` array and run `generate:types`.

### Collections (`src/collections/`)

Each file exports a `CollectionConfig`. Current collections:
- `Users` — auth-enabled, used as admin panel user
- `Media` — upload-enabled with `alt` field required

### Data access in Server Components

Frontend pages call Payload directly (no HTTP):
```ts
const payload = await getPayload({ config: await config })
const { user } = await payload.auth({ headers })
```

### Tests

- **Integration** (`tests/int/`): Vitest + jsdom, file pattern `*.int.spec.ts`
- **E2E** (`tests/e2e/`): Playwright + Chromium, auto-starts dev server on port 3000

## Coding Rules

Full rules in `.claude/rules/coding-rules.md`. Key constraints:

- No `any` — use `unknown` with type guards or define an interface
- No `!` non-null assertions — handle nullability explicitly
- No empty `catch {}` — always log or re-throw
- Files > 300 lines → split; functions > 50 lines → extract
- Max nesting 2 levels — use early return
- Never modify tests to fix failures — fix the implementation

Pre-commit gate: `pnpm test:int` → typecheck → `pnpm lint` (in that order).

## Dev Pipeline Skills

For non-trivial features use the `/dev-*` skill pipeline (documented in `.claude/docs/dev-pipeline.md`):

```
/dev-brainstorm → /dev-plan → /dev-docs → /dev-docs-execute ↔ /dev-docs-review → /dev-docs-complete
```

Or for full autopilot after `/dev-docs`:
```
/dev-autopilot docs/active/[nazwa]
```

Knowledge base for past solutions: `docs/solutions/` (use `/dev-compound` to add entries).

## AI Model Workflow

When using the `/dev-brainstorm` skill, planning and architectural analysis should be performed assuming **Claude Opus 4.8** capabilities. However, implementation, code generation, and execution should be optimized for **Claude Sonnet 4.5**, as this is the model that will perform the actual development work.

Guidelines:
- `/dev-brainstorm` → think and plan at Opus/o4.8-level depth and quality.
- `/dev-plan` and subsequent stages → produce artifacts that are executable by Sonnet 4.5 without requiring additional interpretation.
- Prefer explicit implementation details, clear acceptance criteria, and concrete task breakdowns over high-level assumptions.
- When a plan is too complex for a single implementation pass, split it into incremental milestones suitable for Sonnet 4.5 execution.