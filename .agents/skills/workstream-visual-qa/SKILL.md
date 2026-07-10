---
name: workstream-visual-qa
description: Verify Workstream frontend UI quality before completion. Use when reviewing visible UI changes, responsive layouts, screenshots, accessibility, text overflow, browser behavior, or anything that must not look generic or AI-generated.
---

# Workstream Visual QA

## Overview

Use this skill before reporting visible UI work complete. Verification must include functional checks, responsive browser checks, accessibility checks, and direct screenshot inspection.

## Required Checks

Run:

```bash
npm run typecheck
npm run lint
npm run test
npm run qa:visual
```

For major screens, inspect screenshots at:

- 1440px desktop.
- Tablet viewport.
- Mobile viewport.

Check:

- No horizontal overflow.
- No overlapping text or controls.
- No button label clipping.
- Keyboard focus is visible and usable.
- Axe accessibility violations are resolved or explicitly documented.
- Empty, loading, error, blocked, warning, and success states exist where relevant.
- Visual design follows the Workstream design-system quality bar.

## When Figma Is Involved

If screens were designed in Figma, compare implementation screenshots to the Figma frame. The implementation does not need pixel-perfect decorative parity, but spacing, density, hierarchy, typography, and component behavior must match the intended system.

Use `references/checklist.md` for the review checklist and `scripts/run-ui-verification.sh` for the local verification sequence.
