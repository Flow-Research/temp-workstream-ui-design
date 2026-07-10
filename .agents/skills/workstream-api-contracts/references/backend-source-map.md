# Backend Source Map

Key backend paths:

- `/home/abiorh/flow/workstream/backend/app/main.py`: FastAPI app entry.
- `/home/abiorh/flow/workstream/backend/app/api/router.py`: top-level router.
- `/home/abiorh/flow/workstream/backend/app/api/routes/auth.py`: auth boundary.
- `/home/abiorh/flow/workstream/backend/app/modules/projects/router.py`: project routes.
- `/home/abiorh/flow/workstream/backend/app/modules/projects/schemas.py`: project schemas.
- `/home/abiorh/flow/workstream/backend/app/modules/tasks/router.py`: task routes.
- `/home/abiorh/flow/workstream/backend/app/modules/tasks/schemas.py`: task schemas.
- `/home/abiorh/flow/workstream/backend/app/modules/checkers/router.py`: checker routes.
- `/home/abiorh/flow/workstream/backend/app/modules/checkers/schemas.py`: checker schemas.
- `/home/abiorh/flow/workstream/backend/tests/`: expected behavior and edge cases.

Local backend OpenAPI URL when the service is running:

```text
http://127.0.0.1:8000/openapi.json
```
