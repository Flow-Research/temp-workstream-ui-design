# Workstream Frontend Design Studio

This repository is the coded product design studio for Workstream. It is not a
marketing site and it is not intended to be the final production frontend. The
purpose is to give the frontend engineer a build-ready reference for the
Workstream operations UI: screen jobs, state models, role language, data
contracts, design-system direction, responsive behavior, and quality gates.

Workstream is Flow's task evaluation and contribution infrastructure: project
guides, task queues, submission packets, automated checks, reviewer routing,
revision loops, contribution records, payment status, and reputation signals.

## What To Handoff

- Live coded studio: `src/App.tsx` and `src/App.css`.
- Product handoff package: `docs/handoff`.
- Generated backend contract types: `src/api/workstream.schema.ts`.
- Typed API client/query foundation: `src/api`.
- Responsive QA coverage: `tests/visual/app-smoke.spec.ts`.
- Manual review screenshots: `artifacts/manual-end-to-end-handoff`.
- Redacted live API drill report: `artifacts/api-drill`.

The frontend engineer should treat the coded screens as a product and design
reference, then rebuild the production app with proper routes, real data
loading, forms, mutations, table state, and permission handling.

## What The Frontend Engineer Should See

The studio opens directly into an internal operations UI, not a landing page.
The left navigation contains these handoff screens:

- Admin Dashboard.
- People & Access.
- Product Map.
- API Workbench.
- Project Setup.
- Task Queue.
- Contributor Dashboard.
- Submitter Workspace.
- Checks Monitor.
- Review Ops.
- Review Workspace.
- Revision Loop.
- Records Ops.

The theme switch in the top bar toggles light and dark modes. Both modes are
part of the handoff and should influence the final token system.

## Real API Workbench

The `API Workbench` screen exists for live backend testing before the full
frontend is built. It is not a replay screen and it is not tied to one project.
Use it with whichever project the team decides to exercise at demo time.

The workbench lets a presenter:

- Point the browser at a running backend, or leave the backend URL blank to use
  the Vite proxy.
- Paste separate operator and submitter Flow-compatible bearer tokens.
- Create a project through the API or paste existing project/guide/task ids.
- Edit request JSON for guide setup, task release, pre-submit checks,
  submission creation, finalization, checker runs, audit, and final task state.
- Run one selected endpoint or continue the workflow from the selected action.
- Inspect real backend responses and captured ids.

The underlying redacted drill artifacts are kept only as historical backend
evidence:

```text
artifacts/api-drill/WS-POL-001-16-live-api-drill-report.md
artifacts/api-drill/WS-POL-001-16-live-api-drill-report.pdf
```

For local development, Vite proxies `/api` and `/health` to
`http://127.0.0.1:8000`. Start the backend separately, then run:

```text
npm run dev
```

For a local Flow-token backend, make sure the backend uses matching local auth
settings. This repo includes a helper that prints an operator token and a
submitter token:

```bash
npm run tokens:local
```

The helper output includes the backend environment values it used. The backend
must use the same `WORKSTREAM_FLOW_AUTH_ISSUER`,
`WORKSTREAM_FLOW_AUTH_AUDIENCE`, and
`WORKSTREAM_FLOW_AUTH_LOCAL_HMAC_SECRET` values for those tokens to verify.

## Product Language

- A `contributor` can have submitter capability, reviewer capability, or both.
- Use `submitter` for the person who claims a task, works it, submits a packet,
  and handles revisions.
- Use `reviewer` for the person who claims review work and records `accept`,
  `needs_revision`, or `reject`.
- Use `admin` as the umbrella operations authority. Specific admin scopes such
  as `project_manager` and `audit_manager` are capabilities, not separate
  dashboards.
- Do not show `worker` in the UI. If backend or older docs use that term,
  translate it to `submitter` at the product-language layer.

## Running The Studio

Verified locally with:

```text
Node v24.13.1
npm 11.10.0
```

Fresh setup:

```bash
npm ci
npm run dev
```

The local app usually runs at:

```text
http://127.0.0.1:5173/
```

If Vite chooses another port, use the URL printed by `npm run dev`.

## Handoff Docs

Read these before rebuilding the production frontend:

1. `docs/handoff/product-handoff.md` - product scope, actors, lifecycle,
   payment, reputation, and review rules.
2. `docs/handoff/screen-inventory.md` - every screen's job, actions, blocked
   states, and handoff notes.
3. `docs/handoff/design-system.md` - typography, density, layout, status, theme,
   and anti-generic UI rules.
4. `docs/handoff/implementation-map.md` - suggested route structure, data layer,
   API mapping, and production component boundaries.
5. `docs/handoff/qa-checklist.md` - acceptance checks for the final frontend.

Manual screenshots for quick review live in:

```text
artifacts/manual-end-to-end-handoff/
```

## Verification

Before handing off or after changing visible UI:

```bash
npm run format:check
npm run typecheck
npm run lint
npm run test
npm run qa:visual
```

`npm run qa:visual` runs Playwright checks across desktop, tablet, and mobile,
including overflow and accessibility checks. It can take a while because it
exercises every major screen.

For API type regeneration from a running backend:

```bash
npm run openapi:types
```

For API type regeneration from the local backend app without an HTTP server:

```bash
npm run openapi:types:local
```

The local OpenAPI command expects the backend repository to be available beside
this repo at:

```text
../workstream
```

That mirrors the original workspace layout:

```text
/home/abiorh/flow/workstream
/home/abiorh/flow/workstream_frontend
```

## Build Boundary

The production frontend should use React, Vite, TypeScript, TanStack Router,
TanStack Query, TanStack Table, Radix primitives, React Hook Form, Zod,
`openapi-fetch`, local `@fontsource/inter`, local
`@fontsource/jetbrains-mono`, and `lucide-react`.

Workstream must not own login, signup, password reset, password storage, or
primary auth sessions. It consumes Flow-issued tokens and lets the backend
verify actor context.

## Repository Hygiene

The repo intentionally excludes generated or local-only artifacts such as
`node_modules`, `dist`, Playwright reports, test results, and the old design
research ZIP. Recreate generated files through the scripts above instead of
committing local output.
