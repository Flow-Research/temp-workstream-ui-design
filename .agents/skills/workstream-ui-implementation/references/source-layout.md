# Frontend Source Layout

Preferred structure once implementation starts:

- `src/app/`: app shell, providers, route tree.
- `src/api/`: generated OpenAPI types and API client.
- `src/components/primitives/`: small reusable UI primitives.
- `src/components/workstream/`: domain-level reusable components.
- `src/features/projects/`: project guide and policy setup flows.
- `src/features/tasks/`: task queue, task detail, screening, assignment.
- `src/features/submissions/`: submission packets and pre-submit checks.
- `src/features/reviews/`: review queue, findings, decisions, revision replay.
- `src/features/payments/`: contribution and payment status surfaces.
- `src/styles/`: tokens and global app styles.
- `src/test/`: test setup and helpers.
