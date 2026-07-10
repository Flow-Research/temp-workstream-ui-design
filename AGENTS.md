# Workstream Frontend

This repository is the canonical Workstream frontend. Workstream is Flow's task evaluation and contribution infrastructure: project guides, task queues, submission packets, automated checks, reviewer routing, revision loops, contribution records, payment status, and reputation signals.

## Product Boundary

- Build an internal operations UI, not a landing page.
- Keep the first version focused on project guide -> task -> submission -> checks -> review -> revision -> contribution/payment/reputation records.
- Do not add Workstream-owned login, signup, password reset, password storage, or primary auth sessions. Workstream verifies Flow-issued tokens through the backend.
- Treat the backend at `/home/abiorh/flow/workstream` as the source of product language, lifecycle rules, roles, and API contracts.
- Preserve backend stored values and review decisions exactly. Product review decisions are only `accept`, `needs_revision`, and `reject`.

## Design Process

- Design first, then build. For non-trivial screens, run product UX, design-system, implementation, API-contract, and visual-QA thinking before reporting completion.
- Use Figma for design-system foundations, screen composition, and meaningful visual review before implementing large UI surfaces.
- Make Workstream feel like serious operations software: dense enough for repeated use, calm, legible, auditable, and fast to scan.
- Prioritize tables, queues, status filters, structured detail panes, evidence panels, review checklists, audit trails, and compact workflow controls.
- Avoid generic AI-looking UI: purple or blue-purple gradient dominance, glow blobs, glass cards, oversized marketing heroes, bento filler, emoji-heavy copy, fake inspirational text, and decorative empty cards.
- No cards inside cards. Use cards for repeated records, modals, and framed tools only.
- Text must not overflow or overlap at desktop, tablet, or mobile widths.

## Frontend Stack

- React + Vite + TypeScript is locked.
- Use Radix primitives for accessible controls, lucide-react for icons, TanStack Query for server state, TanStack Router for routing, TanStack Table for dense tabular views, React Hook Form + Zod for forms, and OpenAPI-generated types for backend contracts.
- Use local font packages from `@fontsource/inter` and `@fontsource/jetbrains-mono`; do not depend on remote font CDNs.
- Keep UI state explicit: loading, empty, error, permission denied, blocked, warning, ready, submitted, review pending, needs revision, accepted, rejected, and payment pending/paid states where applicable.

## Verification

- Before reporting UI work complete, run `npm run typecheck`, `npm run lint`, `npm run test`, and the relevant Playwright visual/accessibility checks.
- Use Playwright screenshots for real visual review at desktop, tablet, and mobile widths.
- Accessibility is not optional: keyboard operation, focus visibility, labels, landmarks, and contrast must be checked for new interactive surfaces.
- If a backend API integration changes, regenerate or verify OpenAPI types against the running backend.
