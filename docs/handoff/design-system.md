# Design System Handoff

## Design Intent

Workstream should look like serious operations software. The strongest visual
signal is not decoration; it is structured density, clear hierarchy, durable
state labels, and fast comparison.

The production app should feel:

- Calm.
- Precise.
- Auditable.
- Dense enough for repeated operator use.
- Legible at desktop, tablet, and mobile widths.

## Anti-Generic Rules

Avoid:

- Purple or blue-purple gradient dominance.
- Glow blobs, glass cards, bento filler, or decorative empty cards.
- Oversized marketing heroes.
- Fake inspirational copy.
- Emoji-heavy UI.
- Nested cards.
- One-note beige, slate-blue, brown, orange, or purple palettes.
- UI text that explains obvious interface behavior instead of product state.

## Typography

Use local font packages only:

- UI font: Inter.
- Mono font: JetBrains Mono for ids, hashes, logs, policy digests, and compact
  technical values.

Type should be compact. Reserve large type for actual page headers only. Tables,
panels, filters, and inspectors should use tight headings and stable row
heights.

## Layout System

Use:

- Persistent left navigation on desktop.
- Top context bar for current screen and theme/status controls.
- Full-width screen bands for major sections.
- Tables for queues and records.
- Inspector panes for selected objects.
- Status strips for lifecycle state.
- Timeline or linked rows for immutable history.
- Compact action bars for workflow decisions.

Avoid:

- Cards inside cards.
- Floating page sections that look decorative.
- Large blank panels.
- Responsive layouts that hide the important state.

## Component Primitives

The production app should implement a proper component library around:

- Button.
- Icon button.
- Input.
- Textarea.
- Select.
- Checkbox.
- Switch.
- Tabs.
- Dialog.
- Dropdown menu.
- Tooltip.
- Table.
- Badge.
- Status strip.
- Evidence list.
- Finding item.
- Audit event row.
- Contribution/payment row.
- Empty state.
- Error state.
- Permission-denied state.
- Blocked state.

Use Radix primitives for accessible interaction and lucide-react icons for
familiar tool actions.

## Status Tokens

Status labels should be stable and meaningful. The app needs visual treatment
for:

- Neutral.
- Info.
- Pending.
- Warning.
- Danger.
- Success.
- Revision.
- Rejected.
- Accepted.
- Payment pending.
- Payment submitted.
- Paid.
- Blocked.

Use color to support text, not replace it. Every status chip needs readable
text.

## Light And Dark Themes

The coded studio supports light/dark theme switching. Production should preserve
that capability with tokens rather than duplicate CSS.

Dark theme should remain operational and legible, not a high-contrast neon
variant.

## Responsive Behavior

Desktop:

- Keep navigation visible.
- Use two-column layouts for table plus inspector.
- Favor dense comparison.

Tablet:

- Collapse wide grids.
- Preserve table context with horizontal-safe layouts or row summaries.
- Keep workflow action bars reachable.

Mobile:

- Use stacked sections.
- Convert dense tables into readable record lists where needed.
- Keep primary actions visible without overlap.
- Never let long ids, hashes, button labels, or status text overflow.

## Quality Bar

A screen is not handoff-ready unless:

- It has the right actor and job.
- It shows the lifecycle state that affects action.
- It shows blocked states and why action cannot continue.
- It uses submitter/reviewer/contributor/admin language correctly.
- It avoids generic AI-looking composition.
- It passes accessibility and no-overflow checks across desktop, tablet, and
  mobile.
