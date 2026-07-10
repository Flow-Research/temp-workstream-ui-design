# Workstream Handoff Package

This folder is the written companion to the coded design studio. It tells the
frontend engineer what to build, what not to invent, and how to preserve the
product behavior already expressed in the studio.

## Read Order

1. `product-handoff.md` - product scope, actors, lifecycle, and non-goals.
2. `screen-inventory.md` - screens, jobs, actions, blocked states, and exits.
3. `design-system.md` - visual foundations and anti-generic UI rules.
4. `implementation-map.md` - production app structure, data contracts, and API
   mapping.
5. `qa-checklist.md` - acceptance checks before a frontend handoff is accepted.

## Coded Reference

- Main studio shell: `../../src/App.tsx`
- Studio styling and tokens: `../../src/App.css`
- Generated OpenAPI types: `../../src/api/workstream.schema.ts`
- API client/query helpers: `../../src/api`
- Visual tests: `../../tests/visual/app-smoke.spec.ts`
- Manual screenshots: `../../artifacts/manual-end-to-end-handoff`
- Redacted API drill report: `../../artifacts/api-drill`

## Handoff Rule

The frontend engineer should not copy this studio as the final app one file at a
time. The right build is a production route/component system that preserves the
same product decisions, density, wording, states, and visual quality while
using real backend data.
