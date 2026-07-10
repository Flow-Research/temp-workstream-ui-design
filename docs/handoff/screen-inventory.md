# Screen Inventory

Each production screen should have loading, empty, error, permission denied,
blocked, warning, ready, submitted, review pending, needs revision, accepted,
rejected, payment pending, payment submitted, and paid states where relevant.

## Admin Dashboard

Primary actor: admin, project_manager, audit_manager.

Job: show operational health across setup, task release, submitter work,
reviewer routing, contribution records, payment status, and audit.

Primary actions:

- Open project setup.
- Open people and access.
- Open task queue release.
- Open review operations.
- Open records and payment status.

Visible gates:

- Project guide readiness.
- Policy/checker lock state.
- Open task lifecycle risk.
- Review queue lease pressure.
- Contribution/payment exceptions.
- Audit events needing review.

Implementation notes:

- Use summary metrics only when they link to actionable queues.
- Payment belongs here as a dashboard lane, not as a separate role.

## People And Access

Primary actor: admin, project_manager.

Job: show actor identities, profiles, token roles, and scoped capability gaps.

Primary actions:

- Inspect actor profile.
- Inspect contributor capability.
- Inspect admin capability.
- Prepare for role grant/revoke workflows when backend endpoints exist.

Visible gates:

- Profile state is not permission.
- Token roles currently authorize routes until Workstream-owned role grants are
  fully available.
- Contributor can be submitter, reviewer, or both.
- Admin capabilities such as project_manager and audit_manager remain explicit
  scopes.

Implementation notes:

- Never imply profile rows grant route access.
- Do not show the Claude research ZIP or research artifacts in product UI.

## Product Map

Primary actor: product owner, frontend engineer, admin during handoff.

Job: explain the end-to-end Workstream run from setup to paid contribution.

Primary actions:

- Inspect screen list.
- Inspect role model.
- Inspect lifecycle guardrails.

Visible gates:

- Every handoff has actor, screen, action, and blocked state.
- Reviewer decisions are only `accept`, `needs_revision`, `reject`.
- Accepted review creates a contribution record.

Implementation notes:

- In production this can become an internal help/runbook route or be removed
  from the deployed app. It must remain available during build handoff.

## Project Setup

Primary actor: admin, project_manager.

Job: run guide setup from source capture through policy/checker readiness.

Primary actions:

- Review guide source snapshot.
- Review sufficiency report.
- Acknowledge non-blocking warnings.
- Approve derived submission artifact policy.
- Activate ready project.

Visible gates:

- Immutable source snapshot.
- Guide sufficiency status.
- Effective submission artifact policy hash.
- Pre-submit checker bundle hash.
- Post-submit checker, review, revision, and payment policy readiness.

Blocked states:

- Missing guide material.
- Blocking sufficiency gap.
- Policy derivation failed.
- Checker policy not compiled.

## Task Queue

Primary actor: admin, project_manager, operator.

Job: screen tasks and release only tasks with locked guide, policy, checker, and
payout context.

Primary actions:

- Compare tasks.
- Inspect task locked context.
- Release ready tasks.
- Hold or send back tasks with contract gaps.

Visible gates:

- Required task fields.
- Reviewability.
- Locked guide/policy/checker context.
- Payment policy context.
- Submitter/reviewer separation.

Implementation notes:

- Favor dense tables with stable columns.
- Use inspector panes for selected task detail.

## Contributor Dashboard

Primary actor: contributor.

Job: show one dashboard for the contributor's submitter work, reviewer grants,
revision obligations, contribution records, payment status, and reputation
signals.

Primary actions:

- Open claimed submitter task.
- Open needed revision.
- Open review queue when reviewer grant exists.
- Inspect contribution and payment status.
- Inspect reputation/audit signals.

Visible gates:

- Submitter capability.
- Reviewer capability.
- Tasks waiting on contributor action.
- Review work available to claim.
- Payment pending/payment submitted/paid state.

Implementation notes:

- Do not split submitter and reviewer into separate user identities.
- Show capabilities as lanes in one contributor dashboard.

## Submitter Workspace

Primary actor: submitter.

Job: claim or continue a task, understand locked requirements, assemble a
submission packet, run pre-submit checks, and finalize submission.

Primary actions:

- Read locked task context.
- Add artifacts and evidence.
- Run pre-submit check.
- Fix blocking failures.
- Finalize submission packet.

Visible gates:

- Required artifacts.
- Required evidence.
- Hash/attestation requirements.
- Blocking checker failures.
- Revision findings that must be addressed.

Blocked states:

- Task not claimable.
- Missing artifact/evidence.
- Pre-submit checker failed.
- Revision deadline or limit exceeded.

## Checks Monitor

Primary actor: admin, project_manager, reviewer, submitter where scoped.

Job: separate pre-submit feedback, durable checker results, warnings, and
review-routing readiness.

Primary actions:

- Inspect checker results.
- Inspect blocked failure details.
- Open routed review queue entry.
- Inspect warning evidence.

Visible gates:

- Pre-submit check is not a review decision.
- Durable checker result status.
- Submitter-fixable versus internal setup/provenance defects.
- Review pending readiness.

UI language note:

- If backend payload uses older `worker` language, render it as `submitter`.

## Review Ops

Primary actor: admin, project_manager, reviewer.

Job: keep reviewer routing moving without losing authority, lease state, or
review-chain evidence.

Primary actions:

- View pending review queue.
- View leased review entries.
- Inspect lease expiry.
- Inspect preferred reviewer window.
- Release a lease when current reviewer owns it.
- Open review workspace.

Visible gates:

- Active reviewer grant required.
- Preferred reviewer window.
- Lease duration and expiry.
- Manual release audit.
- Timeout audit.

Blocked states:

- Unauthorized reviewer.
- Reviewer preference active.
- Already leased by another reviewer.
- Task closed.

## Review Workspace

Primary actor: reviewer.

Job: review locked evidence and record one immutable decision.

Primary actions:

- Inspect guide/task/submission/checker evidence.
- Add structured findings.
- Record `accept`.
- Record `needs_revision`.
- Record `reject`.

Visible gates:

- Decision requires cited evidence.
- `needs_revision` requires non-empty findings.
- `reject` requires findings and is terminal in v0.1.
- Reviewer cannot review own submission.

Implementation notes:

- Keep decision controls clear and consequential.
- Do not hide checker warnings from reviewer.

## Revision Loop

Primary actor: submitter, reviewer.

Job: turn prior review findings into a new immutable submission version and
route it back through review.

Primary actions:

- Submitter reads prior findings.
- Submitter attaches fix notes and evidence.
- Submitter finalizes new submission version.
- Reviewer claims preferred review when still within preference window.

Visible gates:

- Prior submission version remains visible.
- Prior review remains visible.
- New version links to prior version.
- Preferred reviewer window.
- Lease expiry burns stickiness.

## Records Ops

Primary actor: admin, project_manager, audit_manager, contributor.

Job: show accepted contribution records, payment status, reputation signals, and
audit trail.

Primary actions:

- Inspect contribution record.
- Inspect payment status.
- Inspect webhook update trail.
- Inspect reputation/audit signals.

Visible gates:

- Accepted review created contribution record.
- Payment status is separate from review decision.
- Payment status values include `pending`, `payment_submitted`, and `paid`.
- Webhook issues stay visible as payment/audit state.

Implementation notes:

- This is where finance-like operational visibility belongs. Do not introduce a
  separate finance role for v0.1.
