---
name: workstream-api-contracts
description: Connect Workstream frontend work to backend FastAPI contracts. Use when generating OpenAPI types, writing API clients, mapping Pydantic schemas, handling Flow auth boundaries, or verifying frontend assumptions against `/home/abiorh/flow/workstream/backend`.
---

# Workstream API Contracts

## Overview

Use this skill whenever frontend code depends on backend contracts. The backend is the source of truth for schemas, auth, lifecycle guards, and enum values.

## Source Order

Inspect backend contracts from:

- `/home/abiorh/flow/workstream/backend/app/api/router.py`
- `/home/abiorh/flow/workstream/backend/app/api/routes/`
- `/home/abiorh/flow/workstream/backend/app/modules/*/router.py`
- `/home/abiorh/flow/workstream/backend/app/modules/*/schemas.py`
- `/home/abiorh/flow/workstream/backend/app/schemas/`
- `/home/abiorh/flow/workstream/backend/tests/`

Use `references/backend-source-map.md` for a quick path map.

## Workflow

1. Identify the route and schema source before writing frontend API assumptions.
2. If the backend is running locally, generate types with:

```bash
npm run openapi:types
```

3. Use generated types and `openapi-fetch` for clients. Do not manually duplicate schema shapes unless the generated type is unavailable and the assumption is clearly temporary.
4. Keep Flow auth as an external token boundary. Do not add frontend login/signup flows unless the backend contract changes.
5. Preserve backend enum strings exactly.
6. Surface structured backend errors in the UI instead of collapsing them into generic failure toasts.

## Output Shape

When planning an integration, state:

- Backend route and schema files checked.
- Required request and response types.
- Auth and role assumptions.
- Error states and domain error codes.
- OpenAPI type generation status.
