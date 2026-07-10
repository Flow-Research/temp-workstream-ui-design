---
name: workstream-design-system
description: Define and review Workstream design-system foundations before UI implementation. Use when choosing typography, colors, spacing, density, components, Figma tokens, screen composition, or when preventing generic AI-looking UI in the Workstream operations frontend.
---

# Workstream Design System

## Overview

Use this skill before creating Figma screens, UI components, page layouts, or CSS tokens. Workstream should look like a serious internal operations product: quiet, precise, dense, and trustworthy.

## Taste Rules

- Prefer calm operational composition over expressive marketing composition.
- Use compact navigation, queues, tables, inspector panes, filters, status bars, timelines, and evidence panels.
- Keep border radii at 8px or less unless a component requires otherwise.
- Do not use nested cards, glow blobs, gradient blobs, glassmorphism, oversized heroes, bento filler, emoji decoration, fake avatars, or inspirational placeholder copy.
- Avoid a one-note palette. Do not let purple, purple-blue, beige, slate-blue, brown, or orange dominate the interface.
- Use icons for familiar tool actions and text labels for consequential domain actions.
- Make every dense surface scannable: aligned columns, predictable status placement, clear row actions, and stable control dimensions.

## Required Foundations

Before implementing broad UI, define:

- Typography: Inter for UI, JetBrains Mono for hashes, ids, logs, code, and policy digests.
- Type scale: compact app scale, not landing-page scale.
- Spacing: 4px base rhythm with 8/12/16/24px common steps.
- Color tokens: surface, panel, border, text, muted text, focus, danger, warning, success, info, pending, revision, rejected, accepted.
- Component primitives: button, icon button, input, textarea, select, checkbox, switch, tabs, dialog, dropdown menu, tooltip, table, badge, timeline, evidence list, review finding item.
- States: loading, empty, disabled, error, permission denied, blocked, warning, success, pending.

## Figma Workflow

Use the Figma skills and tools for design-system work. Search existing design libraries before creating components. If no useful library exists, create Workstream-specific tokens and components in a dedicated Figma file before composing screens.

For each major screen, produce a design brief:

- Screen job.
- Information hierarchy.
- Primary and secondary actions.
- Data density expectation.
- Empty/loading/error states.
- Mobile/tablet behavior.
- Accessibility risks.

Use `references/ui-quality-bar.md` as the quality checklist.
