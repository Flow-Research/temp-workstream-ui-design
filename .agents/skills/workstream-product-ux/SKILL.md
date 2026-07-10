---
name: workstream-product-ux
description: Plan Workstream frontend product UX before design or implementation. Use when defining IA, user flows, screen inventory, task/review/submission workflows, state models, or operator/reviewer/admin journeys for this React/Vite frontend against the Workstream backend.
---

# Workstream Product UX

## Overview

Use this skill before designing or implementing meaningful Workstream screens. The output is a product-facing UX plan that turns backend lifecycle rules into screens, flows, states, and decisions.

## Source Order

Read only the files needed for the requested flow, starting with:

- `/home/abiorh/flow/workstream/README.md`
- `/home/abiorh/flow/workstream/AGENTS.md`
- `/home/abiorh/flow/workstream/docs/product_brief.md`
- `/home/abiorh/flow/workstream/docs/product_first_user_flows.md`
- `/home/abiorh/flow/workstream/docs/glossary.md`
- `/home/abiorh/flow/workstream/docs/architecture_lifecycle_state_machine.md`
- `/home/abiorh/flow/workstream/docs/operations_roles_permissions.md`

Use `references/source-map.md` for the durable source map.

## Workflow

1. Identify the actor: admin, project manager, operator, worker, reviewer, or internal operator.
2. Identify the backend lifecycle objects involved: project, guide, task, submission packet, checker run, review, finding, revision, contribution, payment, reputation.
3. Map the happy path and blocked paths. Include permission denied, empty, loading, failed, warning, needs revision, rejected, accepted, and payment-pending states when relevant.
4. Produce a screen inventory before UI design. Name each screen, primary job, entry points, exits, required data, actions, and irreversible actions.
5. Define decision points that must be visible to the user. Do not hide policy hash, checker status, prior findings, review decision, or payment state when they affect action.
6. Convert the plan into user-facing screen requirements for design-system or implementation work.

## Output Shape

Return:

- Scope and assumptions.
- Actor and workflow summary.
- Screen inventory.
- State inventory.
- Primary actions and blocked actions.
- Data and API dependencies.
- Open product questions.

Do not produce marketing copy or a landing-page concept unless explicitly requested.
