---
name: workstream-ui-implementation
description: Implement Workstream frontend code in React, Vite, and TypeScript. Use when creating routes, components, state management, forms, tables, styles, tests, or app architecture for the Workstream operations UI.
---

# Workstream UI Implementation

## Overview

Use this skill when modifying frontend source code. Follow the local stack and the design-system decisions before adding new implementation patterns.

## Stack Defaults

- React + Vite + TypeScript.
- TanStack Router for route structure.
- TanStack Query for backend server state.
- TanStack Table for dense queues and record lists.
- Radix primitives for dialogs, menus, popovers, select, tabs, tooltips, checkboxes, switches, scroll areas, and separators.
- React Hook Form + Zod for forms and validation.
- OpenAPI-generated types plus `openapi-fetch` for backend clients.
- lucide-react for icons.
- Inter and JetBrains Mono from local `@fontsource` packages.

## Implementation Rules

- Keep shared primitives small and boring. Do not create broad abstractions before two real call sites prove the need.
- Keep domain components aligned to Workstream nouns: Project, Guide, Task, Submission, Checker Run, Review, Finding, Revision, Contribution, Payment, Reputation.
- Model explicit UI states instead of inferring from missing data.
- Preserve backend enum values exactly at API boundaries.
- Use accessible labels, focus states, and keyboard-operable controls.
- Keep fixed-format UI dimensions stable with CSS constraints.
- Do not put page content in nested cards.

## Verification

For implementation work, run:

```bash
npm run typecheck
npm run lint
npm run test
```

For visible UI changes, also run:

```bash
npm run qa:visual
```

If a command cannot run because the backend or browser is missing, state that explicitly and keep the failure output.
