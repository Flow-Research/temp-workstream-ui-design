# QA Checklist

Use this checklist before accepting frontend work from the handoff.

## Required Commands

```bash
npm run format:check
npm run typecheck
npm run lint
npm run test
npm run qa:visual
```

If an API contract changed:

```bash
npm run openapi:types
```

or, without a running backend HTTP server:

```bash
npm run openapi:types:local
```

## Visual Review

Capture and inspect:

- Desktop viewport around 1440px.
- Tablet viewport.
- Mobile viewport.
- Light theme.
- Dark theme.

Check:

- No horizontal overflow.
- No overlapping text or controls.
- No clipped button labels.
- Long ids, hashes, emails, and status values wrap or truncate intentionally.
- Focus rings are visible.
- Touch targets are usable on mobile.
- Dense tables remain readable.
- Empty, error, blocked, warning, and success states are visually distinct.

## Accessibility

Every interactive surface must have:

- Keyboard operation.
- Visible focus.
- Proper labels.
- Landmarks where useful.
- Dialog focus management.
- No axe violations unless explicitly justified and ticketed.

## Product Language

Reject frontend work that:

- Uses `worker` in visible UI instead of `submitter`.
- Treats profile rows as permission grants.
- Invents review decision values beyond `accept`, `needs_revision`, `reject`.
- Treats checker outcomes as review decisions.
- Treats payment status as task/review status.
- Applies negative reputation from reviewer lease release or expiry in v0.1.
- Creates a separate finance role or dashboard.

## Screen Acceptance

For each screen, confirm:

- Actor is clear.
- Primary job is visible above the fold.
- Next action is obvious.
- Blocked action explains why it is blocked.
- Required evidence is visible before a consequential decision.
- Backend state names are preserved where they are stored values.
- User-facing labels use the product language from this handoff.

## Current Studio Baseline

The coded design studio has already been checked with Playwright across desktop,
tablet, and mobile:

```text
36 passed
```

Reference screenshots live in:

```text
artifacts/manual-end-to-end-handoff/
```
