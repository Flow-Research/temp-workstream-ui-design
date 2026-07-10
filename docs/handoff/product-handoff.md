# Product Handoff

## Scope

Build an internal operations UI for Workstream. The first production version
must cover one complete project run:

1. Project guide setup.
2. Task screening and queue release.
3. Submitter task claim and submission packet creation.
4. Pre-submit checks and durable checker runs.
5. Reviewer queue claim with lease.
6. Human review decision: `accept`, `needs_revision`, or `reject`.
7. Revision loop and resubmission.
8. Contribution record creation on accepted review.
9. Payment status tracking through external webhook updates.
10. Reputation and audit visibility.

This is operations software. It should feel calm, dense, legible, auditable, and
fast to scan.

## Actors

| Actor           | Meaning                                                        | UI boundary                                                |
| --------------- | -------------------------------------------------------------- | ---------------------------------------------------------- |
| Contributor     | Human who may hold submitter, reviewer, or both capabilities   | Contributor dashboard can show both work lanes             |
| Submitter       | Claims a task, works it, submits a packet, handles revisions   | Never call this actor `worker` in UI                       |
| Reviewer        | Claims review work, reviews evidence, records decisions        | Must see checker output and prior findings                 |
| Admin           | Broad operations authority                                     | Owns setup, queue, access, overrides, and audit            |
| Project manager | Admin capability for setup, policy, guide, and task operations | Part of admin dashboard, not a separate finance-style role |
| Audit manager   | Admin capability for audit review                              | Part of admin/audit surfaces                               |

## Lifecycle Spine

The UI should make the lifecycle visible without turning it into decorative
steps:

```text
guide setup
  -> task screening
  -> ready / claimable
  -> submitter claim
  -> submission packet
  -> pre-submit check
  -> durable checker run
  -> review queue
  -> review decision
  -> revision or accepted/rejected terminal outcome
  -> contribution record
  -> payment status
  -> reputation/audit
```

Preserve backend decision values exactly:

- `accept`
- `needs_revision`
- `reject`

Do not store checker outcomes as review decisions. Checker results are
structured evidence and routing signals.

## Contribution And Payment Rule

For v0.1, accepted review creates the contribution record immediately. Payment
status then progresses separately:

```text
pending -> payment_submitted -> paid
```

Payment updates come from an external webhook. Payment issues should be shown as
payment status and audit information, not as a change to the review decision.

## Reputation Rule

Submitter reputation and reviewer reputation are separate product signals.

For now, reviewer lease events are audit-only:

- `ReviewerLeaseExpired`
- `ReviewerReleasedTask`

Do not apply negative reputation or contribution events from those lease events
in v0.1.

## Review Lifecycle Rule

Reviewer routing follows the locked review lifecycle:

- A reviewer needs an active project-scoped grant to claim review work.
- A review queue entry can be `pending`, `leased`, or `closed`.
- The queue is mutable routing plumbing.
- `SubmissionVersion` and `Review` are immutable records.
- `needs_revision` creates a new submission version.
- Revision resubmission prefers the previous reviewer during the preference
  window.
- Lease expiry resets FIFO position and burns stickiness.
- Manual release records audit but is not a timeout.
- `reject` closes the task in v0.1 and bans that contributor assignment for the
  task.

## Non-Goals

- No Workstream login, signup, password reset, password storage, or primary auth
  sessions.
- No marketing landing page.
- No generic hero/dashboard filler.
- No separate finance role. Payment belongs in dashboard/records where it
  operationally fits.
- No automatic reputation penalty for reviewer lease expiry or release in v0.1.
