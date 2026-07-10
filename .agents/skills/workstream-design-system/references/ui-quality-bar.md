# Workstream UI Quality Bar

Reject UI that looks generated, decorative, or generic.

Required qualities:

- Real product density: enough data on screen for operators to compare, decide, and move.
- Stable layout: dynamic labels, badges, and buttons must not shift core layout.
- Honest state: every async, blocked, warning, failed, and empty state must be visible.
- Clear hierarchy: one primary action per surface, secondary actions grouped predictably.
- Domain language: use Workstream nouns from the backend glossary.
- Auditability: review decisions, checker results, hashes, evidence, and payment state must be traceable where relevant.
- Professional restraint: no ornamental gradients, floating decoration, or filler illustration.

Typography:

- Use Inter for UI.
- Use JetBrains Mono only for ids, hashes, code, logs, policy versions, and machine-readable artifacts.
- Do not scale font size with viewport width.
- Do not use negative letter spacing.

Layout:

- Use full-width app bands and panes, not page sections styled as floating cards.
- Use two-pane or three-pane layouts for review, evidence, and queue workflows.
- Use tables for repeatable records when comparison matters.
- Keep action bars sticky only when they materially improve workflow.
