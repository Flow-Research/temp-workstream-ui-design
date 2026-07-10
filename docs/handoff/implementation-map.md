# Implementation Map

## Production App Structure

Recommended route structure:

| Route                               | Screen                                       |
| ----------------------------------- | -------------------------------------------- |
| `/`                                 | Admin Dashboard or role-aware home           |
| `/people`                           | People And Access                            |
| `/product-map`                      | Product Map or internal runbook during build |
| `/api-workbench`                    | Real backend API workbench                   |
| `/projects/:projectId/setup`        | Project Setup                                |
| `/projects/:projectId/tasks`        | Task Queue                                   |
| `/contributor`                      | Contributor Dashboard                        |
| `/tasks/:taskId/work`               | Submitter Workspace                          |
| `/submissions/:submissionId/checks` | Checks Monitor                               |
| `/review-ops`                       | Review Ops                                   |
| `/review/:queueEntryId`             | Review Workspace                             |
| `/tasks/:taskId/revisions`          | Revision Loop                                |
| `/records`                          | Records Ops                                  |

Use TanStack Router for route definitions and route-level data boundaries.

## Data Layer

The API foundation already exists:

- Generated OpenAPI types: `../../src/api/workstream.schema.ts`
- API client: `../../src/api/client.ts`
- Query keys/options: `../../src/api/queries.ts`
- React Query provider: `../../src/app/AppProviders.tsx`

Use TanStack Query for server state. Preserve backend enum values at API
boundaries and translate only display language at the UI edge.

## Existing Query Helpers

The current foundation includes query helpers for:

- Health.
- Current actor.
- Project.
- Task.
- Task work context.
- Task submission requirements.
- Submission checker runs.

The production build should add mutation hooks and additional queries as backend
endpoints are finalized for:

- Project setup actions.
- Task screening and release.
- Task claim and submitter assignment.
- Pre-submit check.
- Submission finalize.
- Review queue claim/release.
- Review decision recording.
- Revision resubmission.
- Contribution record list/detail.
- Payment status list/detail.
- Role grant/revoke when Workstream-owned role grants are implemented.
- Audit event streams.

## Source Of Truth

Use the backend at `/home/abiorh/flow/workstream` as the source of:

- Product lifecycle rules.
- API contracts.
- Permission boundaries.
- Stored enum values.
- Review decisions.
- Contribution/payment state.

Use this design studio as the source of:

- Screen composition.
- Product language.
- Density and visual quality.
- Actor journeys.
- Required states and handoff behavior.

## Component Breakdown

Recommended production component groups:

```text
src/components/primitives
src/components/layout
src/components/status
src/features/admin
src/features/people
src/features/projects
src/features/tasks
src/features/submissions
src/features/checks
src/features/review
src/features/revisions
src/features/records
src/features/audit
src/api
src/routes
```

Do not keep all screens in one production `App.tsx`. The current one-file
studio is acceptable for design review, not for the final frontend.

The `API Workbench` screen is a temporary bridge for real backend probing before
the production UI exists. Keep or remove it in production based on internal
tooling needs; do not let it become the main user workflow.

## API Integration Rules

- Regenerate OpenAPI types when backend contracts change.
- Use `openapi-fetch` instead of ad hoc fetch strings.
- Keep query keys stable and object-specific.
- Model loading, empty, error, permission denied, blocked, warning, success,
  and ready states explicitly.
- Treat Flow token auth as external. Workstream frontend should attach tokens
  supplied by the hosting/auth layer, not create primary auth.
- Convert legacy backend display text like `worker` to `submitter` only in UI
  labels. Do not mutate stored backend values.

## Table And Form Rules

Use TanStack Table for:

- Task queues.
- Review queues.
- Contributor work lists.
- Contribution/payment records.
- Audit events.

Use React Hook Form and Zod for:

- Project setup forms.
- Task creation/screening forms.
- Submission packet forms.
- Review decision forms.
- Revision resubmission forms.
- Role grant/revoke forms when endpoints exist.

## Handoff Acceptance

The frontend implementation is acceptable when:

- Every screen in `screen-inventory.md` exists as a production route or an
  intentionally deferred ticket.
- Every consequential action has loading, success, error, and blocked states.
- Reviewer decisions remain exactly `accept`, `needs_revision`, `reject`.
- Contribution record creation is visible after accepted review.
- Payment status is visible as `pending`, `payment_submitted`, or `paid`.
- Contributor dashboard shows submitter and reviewer capabilities together.
- Admin dashboard includes setup, task queue, review ops, records/payment, and
  audit lanes.
