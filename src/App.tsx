import {
  AlertTriangle,
  Ban,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  GitBranch,
  History,
  KeyRound,
  LayoutDashboard,
  ListChecks,
  LockKeyhole,
  Moon,
  ReceiptText,
  Search,
  Send,
  ShieldCheck,
  Sun,
  UserCheck,
  UserCog,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import "./App.css";

type Tone = "neutral" | "info" | "success" | "warning" | "danger";
type ScreenKey =
  | "admin"
  | "people"
  | "map"
  | "setup"
  | "queue"
  | "contributor"
  | "submitter"
  | "checks"
  | "reviewOps"
  | "review"
  | "revision"
  | "ledger";
type ThemeMode = "light" | "dark";

type TaskStatus =
  | "screening"
  | "ready"
  | "claimed"
  | "in_progress"
  | "submitted"
  | "evaluation_pending"
  | "review_pending"
  | "needs_revision"
  | "accepted"
  | "rejected";

const lifecycle: Array<{ label: string; detail: string; tone: Tone }> = [
  {
    label: "project_guide",
    detail: "Human-facing rules, source snapshot, guide version.",
    tone: "neutral",
  },
  {
    label: "policy_approval",
    detail: "Submission, checker, review, revision, payment policies.",
    tone: "info",
  },
  {
    label: "task_screening",
    detail: "Locks guide snapshot, policy hashes, and reviewability.",
    tone: "warning",
  },
  {
    label: "ready_queue",
    detail: "Submitter-visible tasks with frozen task contract.",
    tone: "success",
  },
  {
    label: "submission_packet",
    detail: "Artifacts, evidence, hashes, notes, attestation.",
    tone: "info",
  },
  {
    label: "checker_gate",
    detail: "Pre-submit blocks creation; post-submit gates review.",
    tone: "warning",
  },
  {
    label: "human_review",
    detail: "accept, needs_revision, or reject with evidence.",
    tone: "neutral",
  },
  {
    label: "contribution_payment_reputation",
    detail: "Accepted work creates contribution, payment, reputation.",
    tone: "success",
  },
];

const productRunStages: Array<{
  step: string;
  screen: string;
  actor: string;
  work: string;
  blocked: string;
  tone: Tone;
}> = [
  {
    step: "01",
    screen: "Project Setup",
    actor: "admin / project_manager",
    work: "Capture guide source, clear sufficiency, approve submission policy, and activate the project.",
    blocked:
      "No task can reach READY until guide, checker, review, revision, and payment policy context is locked.",
    tone: "warning",
  },
  {
    step: "02",
    screen: "Task Queue",
    actor: "admin / project_manager",
    work: "Screen task contracts, compare readiness evidence, and release only reviewable work.",
    blocked:
      "Missing acceptance criteria, source context, checker bundle, or payment policy keeps the task in SCREENING.",
    tone: "info",
  },
  {
    step: "03",
    screen: "Submitter Workspace",
    actor: "contributor / submitter",
    work: "Claim work, read the locked task context, package artifacts, attach evidence, and run pre-submit checks.",
    blocked:
      "Blocking pre-submit failures return structured repair details and create no submission packet.",
    tone: "warning",
  },
  {
    step: "04",
    screen: "Checks Monitor",
    actor: "operator",
    work: "Watch durable checker runs route submissions to REVIEW_PENDING, NEEDS_REVISION, or setup repair.",
    blocked:
      "Human review stays closed when critical or high checker failures remain unresolved.",
    tone: "danger",
  },
  {
    step: "05",
    screen: "Review Ops / Review Workspace",
    actor: "reviewer",
    work: "Claim eligible review entries, inspect evidence, record findings, and choose accept, needs_revision, or reject.",
    blocked:
      "No self-review, no claim without reviewer grant, and no accept while blocking evidence is unresolved.",
    tone: "success",
  },
  {
    step: "06",
    screen: "Revision Loop",
    actor: "contributor / submitter",
    work: "Replay every prior finding with fix notes and evidence, then create the next submission version.",
    blocked:
      "The prior review remains immutable; the revised packet must pass checkers before returning to review.",
    tone: "warning",
  },
  {
    step: "07",
    screen: "Records Ops",
    actor: "admin / audit_manager",
    work: "Accepted review creates the contribution record, triggers payment, and records submitter reputation.",
    blocked:
      "Payment state is webhook-owned and separate from task acceptance, review, and assignment state.",
    tone: "success",
  },
];

const productScreenRows = [
  [
    "Admin Dashboard",
    "admin",
    "Triage setup, task release, review pressure, and records exposure.",
    "highest lifecycle risk first",
  ],
  [
    "People & Access",
    "admin",
    "Operate contributor capabilities without confusing profiles for permission grants.",
    "token role and scoped grant boundary",
  ],
  [
    "Project Setup",
    "admin / project_manager",
    "Move a guide from source material to active policies.",
    "activation blocked until policy context is complete",
  ],
  [
    "Task Queue",
    "admin / project_manager",
    "Release only tasks that have locked guide, checker, review, revision, and payment context.",
    "SCREENING to READY",
  ],
  [
    "Contributor Dashboard",
    "contributor",
    "Show submitter work, reviewer privileges, revisions, payment state, and reputation signals together.",
    "next contributor action",
  ],
  [
    "Submitter Workspace",
    "submitter",
    "Build a packet against the locked task context and pre-submit checker result.",
    "pre_submission_checker_failed",
  ],
  [
    "Checks Monitor",
    "operator",
    "Separate pre-submit feedback from durable checker routing.",
    "EVALUATION_PENDING to REVIEW_PENDING or NEEDS_REVISION",
  ],
  [
    "Review Workspace",
    "reviewer",
    "Review evidence, checker output, prior findings, and record a decision.",
    "accept blocked until evidence and findings are resolved",
  ],
  [
    "Revision Loop",
    "submitter / reviewer",
    "Replay findings into a new immutable submission version.",
    "revision policy and checker gate",
  ],
  [
    "Records Ops",
    "admin / audit_manager",
    "Trace accepted contribution, payment webhook progress, reputation, and audit events.",
    "payment status separate from task status",
  ],
];

const productHandoffRows = [
  [
    "auth boundary",
    "No Workstream login or password UI.",
    "Use Flow token verification and surface permission denied states.",
  ],
  [
    "role wording",
    "Use contributor, submitter, reviewer, admin, project_manager, audit_manager in product UI.",
    "Preserve backend enum strings only at API boundaries.",
  ],
  [
    "review decisions",
    "Only accept, needs_revision, and reject are decision values.",
    "Checker failures are never displayed as review decisions.",
  ],
  [
    "revision history",
    "Submitted packets, submission versions, reviews, and findings are immutable.",
    "New attempts create new versions instead of editing prior work.",
  ],
  [
    "payment",
    "Accepted work creates contribution and pending payment.",
    "External webhook moves pending to payment_submitted or paid.",
  ],
  [
    "visual system",
    "Dense panes, queues, tables, evidence panels, and status rails.",
    "No marketing hero, decorative cards, glow, or AI-looking filler.",
  ],
];

const stateCounts: Array<{ status: TaskStatus; count: number; tone: Tone }> = [
  { status: "screening", count: 3, tone: "warning" },
  { status: "ready", count: 7, tone: "success" },
  { status: "claimed", count: 4, tone: "info" },
  { status: "in_progress", count: 9, tone: "info" },
  { status: "submitted", count: 2, tone: "info" },
  { status: "evaluation_pending", count: 5, tone: "warning" },
  { status: "review_pending", count: 12, tone: "info" },
  { status: "needs_revision", count: 4, tone: "warning" },
  { status: "accepted", count: 28, tone: "success" },
  { status: "rejected", count: 1, tone: "danger" },
];

const queueMetrics: Array<{
  label: string;
  value: string;
  detail: string;
  tone: Tone;
}> = [
  {
    label: "screening",
    value: "3",
    detail: "tasks waiting for release-gate evidence",
    tone: "warning",
  },
  {
    label: "ready",
    value: "7",
    detail: "visible to submitters after locked context",
    tone: "success",
  },
  {
    label: "claimed",
    value: "4",
    detail: "submitters holding active assignments",
    tone: "info",
  },
  {
    label: "blocked",
    value: "2",
    detail: "missing reviewability or policy lock",
    tone: "danger",
  },
];

const releaseRows = [
  [
    "t-7f02",
    "Rubric Ops / screening",
    "reviewability missing",
    "guide v2; policy hash pending",
    "submitter unassigned; reviewer unassigned",
    "$18.00 / 35m",
  ],
  [
    "t-8d40",
    "Code Review QA / screening",
    "payment policy ready",
    "guide v3 / sha256:task-884",
    "submitter unassigned; reviewer R. Chen",
    "$30.00 / 1h",
  ],
  [
    "t-31aa",
    "STEM Proof Evaluation / ready",
    "released",
    "guide v3 / sha256:task-31a",
    "submitter available; reviewer A. Okafor",
    "$25.00 / 12m",
  ],
  [
    "t-91c4",
    "STEM Proof Evaluation / review pending",
    "checker warning only",
    "guide v3 / sha256:task-91c",
    "submitter M. Reyes; reviewer A. Okafor",
    "$25.00 / 2h",
  ],
  [
    "t-5b0e",
    "Code Review QA / needs revision",
    "revision context required",
    "guide v3 / sha256:task-5b0",
    "submitter D. Mwangi; reviewer R. Chen",
    "$30.00 / 1d",
  ],
];

const releaseGates: Array<{
  gate: string;
  state: string;
  detail: string;
  tone: Tone;
}> = [
  {
    gate: "screen_task",
    state: "POST /tasks/{task_id}/screen",
    detail:
      "Draft task enters SCREENING only after required task fields exist.",
    tone: "info",
  },
  {
    gate: "locked_context",
    state: "must pass",
    detail:
      "Guide snapshot, effective artifact policy hash, checker bundle, review, revision, and payment policies must be locked.",
    tone: "warning",
  },
  {
    gate: "release_ready",
    state: "POST /tasks/{task_id}/release",
    detail: "Only admin or project_manager releases screened tasks to READY.",
    tone: "success",
  },
  {
    gate: "claim_start",
    state: "submitter path",
    detail:
      "Submitters claim READY tasks, start work, then submit immutable packets.",
    tone: "info",
  },
];

const queuePolicyRows = [
  [
    "guide_source_snapshot",
    "required",
    "locked_guide_source_snapshot_id/hash",
    "blocks READY when absent",
  ],
  [
    "effective_artifact_policy",
    "required",
    "locked_effective_project_submission_artifact_policy_hash",
    "drives required submission packet",
  ],
  [
    "pre_submit_checker",
    "required",
    "locked_pre_submit_checker_bundle_hash",
    "submitter precheck contract",
  ],
  [
    "review_policy",
    "required",
    "locked_review_policy_version",
    "routes checker-passed packets",
  ],
  [
    "revision_policy",
    "required",
    "locked_revision_policy_version",
    "controls needs_revision replay",
  ],
  [
    "payment_policy",
    "required",
    "locked_payment_policy_version",
    "keeps payout separate from task status",
  ],
];

const queueBlockedRows = [
  [
    "release_without_hashes",
    "blocked",
    "Cannot enter READY without locked guide source and policy hashes.",
  ],
  [
    "claim_before_ready",
    "blocked",
    "Submitter cannot claim a task that is still in DRAFT or SCREENING.",
  ],
  [
    "submit_without_precheck",
    "blocked",
    "Pre-submit checker failures return structured details and create no submission.",
  ],
  [
    "review_without_checker",
    "blocked",
    "REVIEW_PENDING requires a checker run for the exact submission version.",
  ],
  [
    "payment_as_task_state",
    "blocked",
    "Payment status remains separate from task lifecycle.",
  ],
];

const queueContractRows = [
  [
    "create draft task",
    "POST /api/v1/projects/{project_id}/tasks",
    "implemented",
  ],
  ["screen task", "POST /api/v1/tasks/{task_id}/screen", "implemented"],
  ["release task", "POST /api/v1/tasks/{task_id}/release", "implemented"],
  ["claim task", "POST /api/v1/tasks/{task_id}/claim", "implemented"],
  ["start task", "POST /api/v1/tasks/{task_id}/start", "implemented"],
  [
    "locked context",
    "GET /api/v1/tasks/{task_id}/locked-context",
    "implemented",
  ],
  ["queue list", "admin list/filter endpoint", "planned for live dashboard"],
];

const checkMetrics: Array<{
  label: string;
  value: string;
  detail: string;
  tone: Tone;
}> = [
  {
    label: "pre-submit",
    value: "2 failed",
    detail: "non-authoritative feedback blocked packet creation",
    tone: "warning",
  },
  {
    label: "running",
    value: "5",
    detail: "evaluation_pending checker runs in progress",
    tone: "info",
  },
  {
    label: "reviewable",
    value: "9",
    detail: "allow_review with warnings visible to reviewer",
    tone: "success",
  },
  {
    label: "blocking",
    value: "3",
    detail: "needs_revision or setup repair before review",
    tone: "danger",
  },
];

const checkRunRows = [
  [
    "cr-118",
    "s-7731 / v2",
    "t-91c4",
    "completed",
    "allow_review",
    "0",
    "3 passed / 1 warning",
    "current",
  ],
  [
    "cr-141",
    "s-7f84 / v1",
    "t-5b0e",
    "completed",
    "needs_revision",
    "2",
    "4 passed / 2 failed",
    "current",
  ],
  [
    "cr-142",
    "s-98aa / v1",
    "t-6a20",
    "running",
    "not_evaluated",
    "0",
    "queued policy checks",
    "current",
  ],
  [
    "cr-137",
    "s-65d2 / v1",
    "t-7d11",
    "failed",
    "checker_retry",
    "0",
    "runner timeout",
    "retry required",
  ],
  [
    "cr-129",
    "s-3b41 / v1",
    "t-2c03",
    "completed",
    "task_setup_blocked",
    "1",
    "policy provenance mismatch",
    "ops repair",
  ],
];

const preSubmitRows = [
  [
    "draft t-91c4",
    "passed",
    "eligible_to_submit true",
    "create immutable packet",
  ],
  [
    "draft t-5b0e",
    "failed",
    "would_block_if_submitted true",
    "add required manifest hash",
  ],
  [
    "draft t-6a20",
    "failed",
    "forbidden storage reference",
    "remove signed URL and retry",
  ],
  ["draft t-31aa", "passed", "warning only", "submitter can proceed"],
];

const contributorMetrics: Array<{
  label: string;
  value: string;
  detail: string;
  tone: Tone;
}> = [
  {
    label: "assigned submitter work",
    value: "6",
    detail: "3 in progress, 2 needs revision, 1 ready to submit",
    tone: "info",
  },
  {
    label: "review privileges",
    value: "2 projects",
    detail: "active reviewer grants; no automatic reputation authority",
    tone: "success",
  },
  {
    label: "payment status",
    value: "$425 pending",
    detail: "accepted contributions waiting on external webhook",
    tone: "warning",
  },
  {
    label: "blocked work",
    value: "1 task",
    detail: "revision deadline needs project manager decision",
    tone: "danger",
  },
];

const contributorWorkItems: Array<{
  id: string;
  role: "submitter" | "reviewer";
  title: string;
  project: string;
  status: string;
  tone: Tone;
  due: string;
  amount: string;
  action: string;
  detail: string;
}> = [
  {
    id: "t-91c4",
    role: "submitter",
    title: "Evaluate supplied proof",
    project: "STEM Proof Evaluation",
    status: "needs_revision",
    tone: "danger",
    due: "2h 10m",
    amount: "$25",
    action: "Open revision builder",
    detail: "2 blocking findings require fix notes and evidence.",
  },
  {
    id: "t-5b0e",
    role: "submitter",
    title: "Classify answer trace",
    project: "Math QA Batch 18",
    status: "ready_to_submit",
    tone: "warning",
    due: "today 18:00",
    amount: "$18",
    action: "Finish packet",
    detail: "Artifact hash exists; submitter attestation is missing.",
  },
  {
    id: "rq-220",
    role: "reviewer",
    title: "Review submission sv-91c4-2",
    project: "STEM Proof Evaluation",
    status: "leased",
    tone: "info",
    due: "lease 36m",
    amount: "review duty",
    action: "Continue review",
    detail: "Preferred reviewer lease; acceptance blocked until replay closes.",
  },
  {
    id: "t-7b20",
    role: "submitter",
    title: "Prepare evidence bundle",
    project: "Trace Reliability",
    status: "checker_running",
    tone: "success",
    due: "tomorrow",
    amount: "$32",
    action: "View checks",
    detail: "Durable checker run is evaluating finalized submission v3.",
  },
];

const contributorGrantRows = [
  [
    "STEM Proof Evaluation",
    "both",
    "active",
    "admin manual grant",
    "rep-snap-7b20",
  ],
  [
    "Math QA Batch 18",
    "submitter",
    "active",
    "admin manual grant",
    "rep-snap-1e44",
  ],
  [
    "Trace Reliability",
    "reviewer",
    "revoked",
    "review policy changed",
    "rep-snap-98aa",
  ],
];

const contributorPaymentRows = [
  ["cr-445", "t-18ac", "$75", "pending", "webhook not received"],
  ["cr-441", "t-77d1", "$125", "payment_submitted", "processor batch B-19"],
  ["cr-430", "t-4a90", "$225", "paid", "webhook 2026-07-08 10:42"],
];

const contributorReputationRows = [
  [
    "submitter quality",
    "accepted contribution",
    "+12",
    "artifact hashes and guide version preserved",
  ],
  [
    "submitter reliability",
    "late revision",
    "tracked",
    "no automatic ban; admin can inspect pattern",
  ],
  [
    "reviewer lease expired",
    "audit only",
    "0",
    "recorded for operations; no negative reputation in v0.1",
  ],
];

const contributorRevisionItems = [
  {
    id: "rf-108",
    severity: "blocking",
    detail: "Map trace.json row 42 to final answer and cite run.log.",
    state: "needs evidence",
    tone: "danger" as Tone,
  },
  {
    id: "rf-112",
    severity: "blocking",
    detail: "Explain why the checker warning is metadata-only.",
    state: "fix note drafted",
    tone: "warning" as Tone,
  },
  {
    id: "rf-119",
    severity: "advisory",
    detail: "Use project naming convention in artifact labels.",
    state: "done",
    tone: "success" as Tone,
  },
];

const submitterArtifactRows: Array<{
  label: string;
  required: string;
  attached: string;
  status: string;
  tone: Tone;
}> = [
  {
    label: "answer.md",
    required: "final answer with evidence citations",
    attached: "sha256:ans-f19b",
    status: "attached",
    tone: "success",
  },
  {
    label: "trace.json",
    required: "row-level trace used by the answer",
    attached: "sha256:test-9c2e",
    status: "attached",
    tone: "success",
  },
  {
    label: "run.log",
    required: "checker run excerpt for cited trace",
    attached: "missing",
    status: "required",
    tone: "danger",
  },
  {
    label: "manifest.json",
    required: "artifact labels, hashes, and source references",
    attached: "sha256:pkg-41c8e2",
    status: "warning",
    tone: "warning",
  },
];

const submitterPreflightRows: Array<{
  name: string;
  status: string;
  detail: string;
  tone: Tone;
}> = [
  {
    name: "required_artifacts",
    status: "failed",
    detail: "run.log is required by rf-108 before resubmission.",
    tone: "danger",
  },
  {
    name: "artifact_hashes",
    status: "passed",
    detail: "answer.md, trace.json, and manifest hashes match.",
    tone: "success",
  },
  {
    name: "revision_replay",
    status: "warning",
    detail: "rf-112 has a fix note but no reviewer-closure evidence yet.",
    tone: "warning",
  },
  {
    name: "submitter_attestation",
    status: "not_ready",
    detail: "Submitter must confirm all citations point to attached evidence.",
    tone: "info",
  },
];

const submitterTimelineRows = [
  ["v1", "submitted", "sv-91c4-1", "prior review rv-200"],
  ["rv-200", "needs_revision", "2 blocking findings", "reviewer A. Okafor"],
  ["draft v2", "editing", "3 replay items", "run.log still missing"],
  ["next", "preflight", "create sv-91c4-2", "blocked until required evidence"],
];

const checkRoutingRows = [
  [
    "allow_review",
    "REVIEW_PENDING",
    "No blocking failure under locked post-submit policy.",
    "not a review decision",
  ],
  [
    "needs_revision",
    "NEEDS_REVISION",
    "Submitter-fixable blocking checker result exists.",
    "not human needs_revision",
  ],
  [
    "checker_retry",
    "EVALUATION_PENDING",
    "Runner failure or transient execution issue needs retry.",
    "internal action",
  ],
  [
    "task_setup_blocked",
    "setup_repair",
    "Setup, provenance, or policy context defect blocks routing.",
    "admin/project_manager repair",
  ],
  [
    "not_evaluated",
    "EVALUATION_PENDING",
    "Checker run is queued or running; no routing outcome yet.",
    "wait",
  ],
];

const checkPolicyRows = [
  [
    "locked_post_submit_checker_policy_hash",
    "required",
    "proves the run used the task-stamped checker policy",
  ],
  [
    "artifact_manifest_hash",
    "required",
    "checker result must bind to submitted artifact hashes",
  ],
  [
    "blocking_count",
    "review gate",
    "critical or high blocking failures keep review closed",
  ],
  [
    "submitter_visible",
    "submitter repair",
    "controls what can be shown to the submitter",
  ],
  [
    "audit_event_id",
    "operator trace",
    "manual trigger reason must stay visible to operations",
  ],
];

const checkContractRows = [
  [
    "pre-submit check",
    "POST /api/v1/tasks/{task_id}/submission-precheck",
    "implemented",
    "non-authoritative feedback",
  ],
  [
    "create submission",
    "POST /api/v1/tasks/{task_id}/submissions",
    "implemented",
    "blocks with pre_submission_checker_failed",
  ],
  [
    "finalize submission",
    "POST /api/v1/submissions/{submission_id}/finalize",
    "implemented",
    "moves packet into pre-review gate",
  ],
  [
    "run checkers",
    "POST /api/v1/submissions/{submission_id}/checker-runs",
    "implemented",
    "requires trigger_reason",
  ],
  [
    "list checker runs",
    "GET /api/v1/submissions/{submission_id}/checker-runs",
    "implemented",
    "role-sensitive response",
  ],
  [
    "checker queue list",
    "admin list/filter checker runs",
    "planned",
    "needed for live monitor",
  ],
];

const reviewOpsMetrics: Array<{
  label: string;
  value: string;
  detail: string;
  tone: Tone;
}> = [
  {
    label: "reviewer coverage",
    value: "18 active",
    detail: "contributors with explicit reviewer or both capability",
    tone: "success",
  },
  {
    label: "waiting reviews",
    value: "11",
    detail: "checker-passed submissions awaiting eligible claim",
    tone: "info",
  },
  {
    label: "active leases",
    value: "4",
    detail: "claimed reviews with timers running",
    tone: "warning",
  },
  {
    label: "lease risk",
    value: "2",
    detail: "expiry or release will requeue and clear stickiness",
    tone: "danger",
  },
];

const reviewQueueRows = [
  [
    "rqe-91c4",
    "sv-7731 / v2",
    "STEM Proof / t-91c4",
    "leased",
    "preferred A. Okafor",
    "leased to A. Okafor / 18m left",
    "record decision",
  ],
  [
    "rqe-5b0e",
    "sv-7f84 / v2",
    "Code Review QA / t-5b0e",
    "pending",
    "R. Chen / 42m left",
    "none",
    "preferred reviewer only",
  ],
  [
    "rqe-31aa",
    "sv-98aa / v1",
    "STEM Proof / t-31aa",
    "pending",
    "open FIFO",
    "none",
    "any active reviewer grant",
  ],
  [
    "rqe-65d2",
    "sv-65d2 / v1",
    "Rubric Ops / t-7d11",
    "leased",
    "none",
    "expired 9m ago",
    "requeue + audit",
  ],
  [
    "rqe-2c03",
    "sv-3b41 / v1",
    "Code Review QA / t-2c03",
    "closed",
    "none",
    "closed review_recorded",
    "chain permanent",
  ],
];

const reviewGrantRows = [
  [
    "act_aokafor",
    "STEM Proof",
    "reviewer",
    "active",
    "rep-snap-442",
    "manual admin grant",
  ],
  [
    "act_mreyes",
    "STEM Proof",
    "both",
    "active",
    "rep-snap-409",
    "cannot self-review",
  ],
  [
    "act_rchen",
    "Code Review QA",
    "reviewer",
    "active",
    "rep-snap-501",
    "preferred reviewer window",
  ],
  [
    "act_dmwangi",
    "Code Review QA",
    "submitter",
    "active",
    "rep-snap-377",
    "cannot claim review work",
  ],
  [
    "act_kpatel",
    "Rubric Ops",
    "reviewer",
    "revoked",
    "rep-snap-318",
    "claim must fail",
  ],
];

const reviewLeaseRows = [
  [
    "preference active",
    "non-preferred claim fails",
    "409 reviewer_preference_active",
    "entry remains pending",
  ],
  [
    "preference expired",
    "any active reviewer or both grant can claim",
    "entered_queue_at unchanged",
    "open FIFO",
  ],
  [
    "lease expired",
    "leased to pending; lease fields clear",
    "ReviewerLeaseExpired",
    "entered_queue_at resets; preference cleared",
  ],
  [
    "manual release",
    "reviewer returns claimed entry before timeout",
    "ReviewerReleasedTask",
    "same requeue effect without timeout event",
  ],
];

const reviewChainRows = [
  [
    "v1",
    "sv-91c4-1",
    "rv-200",
    "needs_revision",
    "prior null",
    "findings required",
  ],
  ["v2", "sv-91c4-2", "rv-241", "accept", "rv-200", "terminal accepted chain"],
  [
    "v1",
    "sv-5b0e-1",
    "rv-215",
    "reject",
    "prior null",
    "terminal rejected chain",
  ],
  [
    "v2",
    "sv-7f84-2",
    "awaiting",
    "pending",
    "rv-219",
    "new review inbox entry",
  ],
];

const reviewRejectRows = [
  [
    "Review",
    "decision = reject",
    "immutable review recorded against the submission version",
  ],
  ["Review inbox entry", "closed", "closed_reason = review_recorded"],
  [
    "Task assignment",
    "status = banned",
    "banned_reason_review_id points to the rejecting review",
  ],
  ["Task", "closed", "v0.1 terminal reject; no reopen_to_pool policy yet"],
  [
    "Submission version",
    "no new version",
    "no further submission is created for this task",
  ],
];

const reviewContractRows = [
  [
    "Reviewer grant",
    "designed",
    "project-scoped submitter, reviewer, or both authority",
  ],
  [
    "Review inbox entry",
    "designed",
    "pending, leased, closed routing state with lease timers",
  ],
  [
    "claim review entry",
    "designed",
    "403 unauthorized_actor or 409 reviewer_preference_active",
  ],
  [
    "release review lease",
    "designed",
    "manual release returns entry to general queue and audits reason",
  ],
  [
    "record Review",
    "designed",
    "accept, needs_revision, reject only; immutable after creation",
  ],
  [
    "review chain read",
    "designed",
    "walk SubmissionVersion and Review prior links together",
  ],
  [
    "terminal reject policy",
    "locked spec",
    "bans contributor from task and closes task in v0.1",
  ],
];

const setupRunSteps: Array<{
  phase: string;
  status: string;
  endpoint: string;
  detail: string;
  tone: Tone;
}> = [
  {
    phase: "queued",
    status: "complete",
    endpoint: "GET setup-runs/latest",
    detail: "Project guide entered the automatic setup queue.",
    tone: "success",
  },
  {
    phase: "running_sufficiency_agent",
    status: "complete",
    endpoint: "GET sufficiency-reports",
    detail: "Guide source envelope produced a passed sufficiency report.",
    tone: "success",
  },
  {
    phase: "running_policy_derivation_agent",
    status: "complete",
    endpoint: "GET submission-artifact-policies",
    detail: "Agent-derived policy draft is ready for project-manager review.",
    tone: "info",
  },
  {
    phase: "policy_draft_ready",
    status: "current",
    endpoint: "POST policy approve",
    detail:
      "Approval creates the effective policy and compiled checker bundle.",
    tone: "warning",
  },
];

const sourceSnapshotItems = [
  ["source-item-1", "project_guide", "public-fixture://source-item-1"],
  ["source-item-2", "reviewer_program", "public-fixture://source-item-2"],
  ["source-item-3", "task_material", "public-fixture://source-item-3"],
  ["source-item-4", "review_packet", "public-fixture://source-item-4"],
  ["source-item-5", "checker_evidence", "public-fixture://source-item-5"],
  ["source-item-6", "checker_evidence", "public-fixture://source-item-6"],
];

const policies = [
  ["Guide source snapshot", "v1", "sha256:<redacted>", "captured"],
  [
    "Guide sufficiency report",
    "passed",
    "ProjectGuideSufficiencyAgent",
    "complete",
  ],
  [
    "Submission artifact policy",
    "agent draft",
    "sha256:<redacted>",
    "awaiting approval",
  ],
  ["Effective artifact policy", "v1", "sha256:<redacted>", "not yet active"],
  ["Pre-submit checker policy", "compiled", "sha256:<redacted>", "ready"],
  ["Post-submit checker policy", "v1", "sha256:<redacted>", "ready"],
  ["Review policy", "v1", "accept/needs_revision/reject", "ready"],
  ["Revision policy", "v1", "needs_revision resubmit", "ready"],
  ["Payment policy", "v1", "fixed USD", "ready"],
];

const setupPolicyGroups: Array<{
  label: string;
  detail: string;
  items: string[];
}> = [
  {
    label: "required_artifacts",
    detail: "Submitter packet must include every policy-derived artifact.",
    items: [
      "submission archive",
      "task metadata",
      "static guard output",
      "review packet",
      "container build evidence",
    ],
  },
  {
    label: "required_evidence",
    detail: "Evidence records must bind review claims to submitted hashes.",
    items: [
      "task configuration",
      "platform static guard output",
      "automated review packet",
      "verifier execution logs",
    ],
  },
  {
    label: "attestation_terms",
    detail: "Submitter must explicitly accept the intake contract.",
    items: [
      "credentials and secret exclusion",
      "complete manifest",
      "SHA-256 hashes",
      "human accountability for agent-assisted work",
    ],
  },
];

const compiledCheckers: Array<{
  name: string;
  purpose: string;
  tone: Tone;
}> = [
  {
    name: "check_submission_packet",
    purpose: "Validate packet shape and required top-level fields.",
    tone: "success",
  },
  {
    name: "check_forbidden_files",
    purpose: "Block prohibited files before intake.",
    tone: "success",
  },
  {
    name: "check_required_files",
    purpose: "Require project-specific files from the effective policy.",
    tone: "success",
  },
  {
    name: "check_evidence_present",
    purpose: "Require policy-derived evidence records.",
    tone: "success",
  },
  {
    name: "check_evidence_integrity",
    purpose: "Validate evidence structure and hash coverage.",
    tone: "success",
  },
  {
    name: "check_low_quality_generated_artifacts",
    purpose: "Warn or block obvious low-quality generated packets.",
    tone: "warning",
  },
];

const activationGates: Array<{
  gate: string;
  state: string;
  detail: string;
  tone: Tone;
}> = [
  {
    gate: "source_snapshot",
    state: "captured",
    detail: "Guide source bundle has immutable id and hash.",
    tone: "success",
  },
  {
    gate: "sufficiency",
    state: "passed",
    detail: "No blocking guide gaps remain.",
    tone: "success",
  },
  {
    gate: "policy_approval",
    state: "required",
    detail:
      "Project manager must approve the exact submission artifact policy.",
    tone: "warning",
  },
  {
    gate: "checker_bundle",
    state: "compiled",
    detail: "Pre-submit checker policy is project-scoped, not task-generated.",
    tone: "success",
  },
  {
    gate: "activate_guide",
    state: "next",
    detail: "Activation exposes active-guide context for task screening.",
    tone: "info",
  },
];

const reviewEvidence = [
  ["answer.md", "sha256:ans-f19b", "final response and cited result"],
  ["trace.json", "sha256:test-9c2e", "reproducible checker trace"],
  ["run.log", "sha256:log-a880", "submitter execution log"],
  ["prior-findings.csv", "sha256:rev-611d", "revision closure packet"],
];

const reviewFindings: Array<{
  id: string;
  severity: string;
  area: string;
  issue: string;
  requiredFix: string;
  evidence: string;
  tone: Tone;
}> = [
  {
    id: "rf-108",
    severity: "high",
    area: "evidence",
    issue:
      "Submitter says the trace proves the result, but the cited run log does not connect the computation to the final answer.",
    requiredFix:
      "Add a direct evidence note that maps trace.json row 42 to the final answer and cite the matching run.log line.",
    evidence: "trace.json / run.log",
    tone: "danger",
  },
  {
    id: "rf-112",
    severity: "medium",
    area: "submission_summary",
    issue: "Summary omits why the checker warning is non-blocking.",
    requiredFix:
      "Explain that the weak label is metadata-only and that artifact hashes still match the manifest.",
    evidence: "submission summary",
    tone: "warning",
  },
];

const decisionOptions: Array<{
  decision: string;
  availability: string;
  detail: string;
  tone: Tone;
}> = [
  {
    decision: "accept",
    availability: "blocked",
    detail: "Cannot accept until rf-108 is closed or rebutted with evidence.",
    tone: "danger",
  },
  {
    decision: "needs_revision",
    availability: "ready",
    detail: "Available with structured findings and cited required fixes.",
    tone: "info",
  },
  {
    decision: "reject",
    availability: "available",
    detail: "Allowed only with a guide-grounded rejection reason.",
    tone: "warning",
  },
];

const reviewerQueueItems: Array<{
  id: string;
  task: string;
  project: string;
  state: string;
  detail: string;
  tone: Tone;
}> = [
  {
    id: "rqe-91c4",
    task: "t-91c4",
    project: "STEM Proof Evaluation",
    state: "leased",
    detail: "18m left; preferred reviewer lease",
    tone: "info",
  },
  {
    id: "rqe-5b0e",
    task: "t-5b0e",
    project: "Math QA Batch 18",
    state: "preference_active",
    detail: "R. Chen has first claim window",
    tone: "warning",
  },
  {
    id: "rqe-31aa",
    task: "t-31aa",
    project: "Trace Reliability",
    state: "open_fifo",
    detail: "any active reviewer grant can claim",
    tone: "success",
  },
];

const reviewEvidenceComparisons: Array<{
  artifact: string;
  submitterClaim: string;
  evidencePointer: string;
  reviewerRead: string;
  state: string;
  tone: Tone;
}> = [
  {
    artifact: "answer.md",
    submitterClaim: "final conclusion follows trace row 42",
    evidencePointer: "answer.md:L18 -> trace.json:42",
    reviewerRead: "claim is present but depends on run.log tie-out",
    state: "needs tie-out",
    tone: "warning",
  },
  {
    artifact: "trace.json",
    submitterClaim: "trace row 42 matches the supplied proof",
    evidencePointer: "trace.json:42",
    reviewerRead: "row exists and hash matches manifest",
    state: "valid",
    tone: "success",
  },
  {
    artifact: "run.log",
    submitterClaim: "execution log confirms the computation path",
    evidencePointer: "run.log:L61",
    reviewerRead: "line is cited but not mapped to final answer",
    state: "open",
    tone: "danger",
  },
];

const reviewerClosureRows: Array<{
  id: string;
  severity: string;
  priorRequirement: string;
  submitterReplay: string;
  closureAction: string;
  tone: Tone;
}> = [
  {
    id: "rf-104",
    severity: "medium",
    priorRequirement: "Add missing derivation steps.",
    submitterReplay: "answer.md now includes derivation block.",
    closureAction: "close_fixed",
    tone: "success",
  },
  {
    id: "rf-108",
    severity: "high",
    priorRequirement: "Map trace row to final answer and run log.",
    submitterReplay: "trace row cited; run log mapping remains weak.",
    closureAction: "reopen_required",
    tone: "danger",
  },
  {
    id: "rf-109",
    severity: "low",
    priorRequirement: "Use retired label convention.",
    submitterReplay: "guide v3 made the requirement obsolete.",
    closureAction: "close_obsolete",
    tone: "neutral",
  },
];

const revisionMetrics: Array<{
  label: string;
  value: string;
  detail: string;
  tone: Tone;
}> = [
  {
    label: "needs revision",
    value: "4 tasks",
    detail: "submitters owe finding-by-finding replay",
    tone: "warning",
  },
  {
    label: "ready to resubmit",
    value: "2 packets",
    detail: "all blocking findings have replay evidence",
    tone: "success",
  },
  {
    label: "blocked findings",
    value: "6",
    detail: "medium or blocking findings without proof",
    tone: "danger",
  },
  {
    label: "preferred review",
    value: "3 windows",
    detail: "same reviewer gets first claim on resubmissions",
    tone: "info",
  },
];

const revisionFindingRows = [
  [
    "rf-108",
    "blocking",
    "evidence",
    "Map trace.json row 42 to final answer and cite run.log.",
    "fix note + trace evidence uploaded",
    "reviewer must close",
  ],
  [
    "rf-112",
    "blocking",
    "submission_summary",
    "Explain why the checker warning is metadata-only.",
    "summary rewritten with hash rationale",
    "ready for closure",
  ],
  [
    "rf-119",
    "advisory",
    "formatting",
    "Use project naming convention in artifact labels.",
    "labels updated in manifest",
    "does not block resubmit",
  ],
  [
    "rf-121",
    "blocking",
    "guide_compliance",
    "Remove unsupported claim not present in project guide.",
    "claim removed from answer.md",
    "ready for closure",
  ],
];

const revisionVersionRows = [
  [
    "t-91c4",
    "sv-91c4-1",
    "sv-91c4-2",
    "rv-200",
    "same locked guide v3",
    "review replay required",
  ],
  [
    "t-5b0e",
    "sv-5b0e-1",
    "draft v2",
    "rv-215",
    "policy rebase check pending",
    "submitter fixing",
  ],
  [
    "t-7b20",
    "sv-7b20-2",
    "sv-7b20-3",
    "rv-263",
    "same locked guide v2",
    "checker running",
  ],
  [
    "t-31aa",
    "sv-31aa-1",
    "blocked",
    "rv-188",
    "revision deadline expired",
    "admin review required",
  ],
];

const revisionReplayRows = [
  [
    "read findings",
    "Submitter reviews every blocking and advisory finding.",
    "Prior Review and Finding ids stay visible.",
    "No mutation of prior review.",
  ],
  [
    "add fix notes",
    "Each finding gets a specific fix note or not-applicable claim.",
    "Revision replay references finding ids.",
    "Reviewer can close or reopen each finding.",
  ],
  [
    "attach evidence",
    "Revised artifact hashes and evidence bind the fix to the new packet.",
    "Pre-submit checks validate packet shape.",
    "Missing blocking evidence prevents resubmit.",
  ],
  [
    "finalize v2",
    "New SubmissionVersion is created with prior_submission_version_id.",
    "Durable checker run gates review.",
    "Preferred reviewer window starts after reviewable.",
  ],
];

const revisionRoutingRows = [
  [
    "Review needs_revision",
    "Task enters needs_revision",
    "findings required",
    "submitter sees replay workspace",
  ],
  [
    "SubmissionVersion v2",
    "Created on revised finalize",
    "prior_submission_version_id = v1",
    "prior version stays immutable",
  ],
  [
    "Checker allow_review",
    "review inbox entry created",
    "preferred_reviewer_id = prior reviewer",
    "same reviewer first claim",
  ],
  [
    "Preference expires",
    "General review FIFO",
    "entered_queue_at unchanged",
    "any active reviewer grant can claim",
  ],
];

const revisionBlockedRows = [
  [
    "no structured findings",
    "blocked",
    "needs_revision must include at least one finding.",
  ],
  [
    "revision limit reached",
    "blocked",
    "Revision policy decides whether admin repair or terminal path applies.",
  ],
  [
    "deadline expired",
    "blocked",
    "Submitter cannot silently create another attempt after revision_deadline_hours.",
  ],
  [
    "task closed or rejected",
    "blocked",
    "Reject is terminal in v0.1 and no new SubmissionVersion is allowed.",
  ],
  [
    "wrong contributor",
    "blocked",
    "Only the assigned submitter can revise the task assignment.",
  ],
  [
    "checker blocking failure",
    "blocked before review",
    "Revised packet returns to submitter or setup repair; no human review decision is created.",
  ],
];

const revisionContractRows = [
  [
    "resubmit packet",
    "POST /api/v1/tasks/{task_id}/submissions",
    "live",
    "Allowed when task is in progress or needs_revision.",
  ],
  [
    "submission versioning",
    "Submission.version",
    "live",
    "Creates new rows and preserves v1.",
  ],
  [
    "finalize revised packet",
    "POST /api/v1/submissions/{submission_id}/finalize",
    "live",
    "Starts durable checker gate for v2.",
  ],
  [
    "revision replay object",
    "Finding replay / closure API",
    "designed",
    "Needed for per-finding fix notes and reviewer closure.",
  ],
  [
    "preferred reviewer queue",
    "review inbox entry",
    "designed",
    "Resubmission routes first to the prior reviewer window.",
  ],
  [
    "human review chain",
    "Review.prior_review_id",
    "designed",
    "Required for immutable review history after v2.",
  ],
];

const recordsMetrics: Array<{
  label: string;
  value: string;
  detail: string;
  tone: Tone;
}> = [
  {
    label: "accepted today",
    value: "5",
    detail: "accepted reviews that created contribution records",
    tone: "success",
  },
  {
    label: "pending",
    value: "$65",
    detail: "payment trigger sent; no external confirmation yet",
    tone: "warning",
  },
  {
    label: "payment_submitted",
    value: "$45",
    detail: "external payout provider accepted the payment",
    tone: "info",
  },
  {
    label: "paid",
    value: "$25",
    detail: "webhook returned paid with reference",
    tone: "success",
  },
];

const contributionRows = [
  [
    "c-2a18 / rv-241",
    "t-2a18",
    "L. Petrova",
    "$40.00",
    "pending",
    "submitter work",
  ],
  ["c-1f02 / rv-200", "t-1f02", "M. Reyes", "$25.00", "paid", "submitter work"],
  [
    "c-0d55 / rv-188",
    "t-0d55",
    "K. Sato",
    "$45.00",
    "payment_submitted",
    "submitter work",
  ],
  [
    "c-7b20 / rv-263",
    "t-7b20",
    "D. Mwangi",
    "$25.00",
    "pending",
    "submitter work",
  ],
];

const paymentWebhookRows = [
  [
    "contribution.created",
    "Workstream",
    "none -> pending",
    "trigger payment",
    "audit contribution_payment_triggered",
  ],
  [
    "payment.submitted",
    "external webhook",
    "pending -> payment_submitted",
    "provider payment id",
    "audit payment_webhook_applied",
  ],
  [
    "payment.paid",
    "external webhook",
    "payment_submitted -> paid",
    "paid reference",
    "audit payment_paid",
  ],
  [
    "payment.issue",
    "external webhook",
    "status unchanged",
    "issue payload",
    "audit only; operator follow-up",
  ],
];

const reputationRows = [
  [
    "submitter_reputation",
    "accepted contribution",
    "contribution record",
    "positive submitter work signal",
    "reviewer lease events excluded",
  ],
  [
    "reviewer_reputation",
    "review quality",
    "review record",
    "separate reviewer judgment signal",
    "not changed by payment status",
  ],
  [
    "ReviewerLeaseExpired",
    "audit event",
    "review lease",
    "no reputation impact in v1",
    "tracked for future policy only",
  ],
  [
    "ReviewerReleasedTask",
    "audit event",
    "manual release",
    "no reputation impact in v1",
    "voluntary release stays audit-only",
  ],
];

const recordsAuditRows = [
  [
    "review.accepted",
    "rv-241",
    "system",
    "created contribution c-2a18",
    "14:34:22",
  ],
  [
    "payment.triggered",
    "c-2a18",
    "system",
    "payment status pending",
    "14:34:24",
  ],
  [
    "payment.paid",
    "pay-91f0",
    "external webhook",
    "status paid with reference",
    "14:42:03",
  ],
  [
    "review.rejected",
    "rv-215",
    "reviewer",
    "audit only; no negative reputation event",
    "13:58:11",
  ],
  [
    "reviewer_lease.expired",
    "rqe-65d2",
    "system",
    "audit only; no reviewer reputation impact",
    "13:22:09",
  ],
];

const recordsContractRows = [
  [
    "create contribution",
    "designed",
    "Review accept creates ContributionRecord immediately.",
  ],
  [
    "create payment record",
    "designed",
    "Contribution creation triggers payment status pending.",
  ],
  [
    "payment webhook",
    "designed",
    "External provider moves pending to payment_submitted or paid.",
  ],
  [
    "reputation ledger",
    "designed",
    "Submitter and reviewer reputation tracks remain separate.",
  ],
  [
    "reject audit",
    "locked spec",
    "Reject creates audit only; no negative contribution or reputation event.",
  ],
];

const adminMetrics: Array<{
  label: string;
  value: string;
  detail: string;
  tone: Tone;
}> = [
  {
    label: "setup gate",
    value: "policy_draft_ready",
    detail: "approval blocks guide activation",
    tone: "warning",
  },
  {
    label: "release queue",
    value: "3 screening",
    detail: "task contracts need ready-gate review",
    tone: "warning",
  },
  {
    label: "review pressure",
    value: "12 review_pending",
    detail: "checker-passed packets need human decision",
    tone: "info",
  },
  {
    label: "records",
    value: "2 pending",
    detail: "accepted contributions awaiting webhook progress",
    tone: "success",
  },
];

const adminPriorityRows = [
  [
    "terminal-benchmark / guide v1",
    "policy_draft_ready",
    "Approve exact artifact policy before guide activation.",
    "setup ledger",
  ],
  [
    "t-7f02",
    "screening",
    "Ready gate cannot release until reviewability is complete.",
    "locked context",
  ],
  [
    "s-7731",
    "review_pending",
    "Checker warning is non-blocking; reviewer must cite evidence.",
    "checker run",
  ],
  [
    "c-2a18",
    "pending",
    "Payment status belongs in ledger records after acceptance.",
    "webhook event",
  ],
];

const adminLanes: Array<{
  lane: string;
  state: string;
  detail: string;
  owner: string;
  tone: Tone;
}> = [
  {
    lane: "project_setup",
    state: "blocked_on_approval",
    detail:
      "Source snapshot, sufficiency, effective policy, and checker bundle are visible.",
    owner: "project_manager",
    tone: "warning",
  },
  {
    lane: "task_release",
    state: "ready_gate",
    detail:
      "Tasks must lock guide snapshot, policy hashes, reviewability, and payout before READY.",
    owner: "admin/project_manager",
    tone: "info",
  },
  {
    lane: "submission_gate",
    state: "precheck_first",
    detail:
      "Blocking pre-submit failures return structured errors and create no submission.",
    owner: "submitter + operator",
    tone: "warning",
  },
  {
    lane: "review_operations",
    state: "decision_guarded",
    detail:
      "Human review decisions stay exactly accept, needs_revision, or reject.",
    owner: "reviewer/admin",
    tone: "success",
  },
  {
    lane: "records",
    state: "accepted_to_ledger",
    detail:
      "Contribution, payment status, reputation, and audit entries stay traceable.",
    owner: "admin",
    tone: "info",
  },
];

const adminProfileRows = [
  [
    "contributor-a",
    "submitter, reviewer",
    "submitter active",
    "no self-review",
  ],
  [
    "source-contact",
    "project_manager",
    "project_owner observed",
    "metadata only",
  ],
  [
    "role-lost-submitter",
    "project_manager",
    "submitter active but denied",
    "token role missing",
  ],
  ["audit-manager", "admin", "future scoped role", "assignment tool planned"],
];

const adminContractRows = [
  ["project setup", "live", "projects, guides, setup runs, policies"],
  ["task lifecycle", "live", "screen, release, claim, start, locked context"],
  ["submission gate", "live", "requirements, precheck, create, finalize"],
  [
    "checker operations",
    "live",
    "submission checker-runs and checker-run read",
  ],
  [
    "human review",
    "designed",
    "review queue and decision workflow ready for backend routes",
  ],
  ["role assignment", "designed", "current v0.1 reads trusted token roles"],
  [
    "payment updates",
    "designed",
    "external webhook updates pending, payment statuses stay pending/payment_submitted/paid",
  ],
];

const adminReadiness: Array<{
  gate: string;
  state: string;
  detail: string;
  tone: Tone;
}> = [
  {
    gate: "activate_guide",
    state: "next",
    detail: "Approve submission artifact policy, then activate guide.",
    tone: "warning",
  },
  {
    gate: "release_tasks",
    state: "after activation",
    detail:
      "Run screening and release only after locked policy context exists.",
    tone: "info",
  },
  {
    gate: "review_decisions",
    state: "designed",
    detail: "Review workspace and Review Ops are ready for decision routes.",
    tone: "danger",
  },
  {
    gate: "payment_updates",
    state: "webhook pending",
    detail:
      "Records Ops is ready; external payment webhook still needs implementation.",
    tone: "warning",
  },
];

const peopleMetrics: Array<{
  label: string;
  value: string;
  detail: string;
  tone: Tone;
}> = [
  {
    label: "identity source",
    value: "Flow token",
    detail: "Workstream verifies issuer and subject, then stores local rows.",
    tone: "info",
  },
  {
    label: "profile states",
    value: "3",
    detail: "observed, active, and disabled are registry states.",
    tone: "success",
  },
  {
    label: "contributor shape",
    value: "submit + review",
    detail: "One person can hold submitter and reviewer capability.",
    tone: "warning",
  },
  {
    label: "assignment API",
    value: "planned",
    detail: "Durable role grant and removal routes are not present yet.",
    tone: "danger",
  },
];

const peopleDirectoryRows = [
  [
    "act_mreyes",
    "submitter, reviewer",
    "submitter active; reviewer observed",
    "global",
    "submit own tasks; review others",
    "watch self-review",
  ],
  [
    "act_aokafor",
    "reviewer",
    "reviewer observed",
    "review_queue:default",
    "review_pending decisions",
    "no payment edits",
  ],
  [
    "act_sidris",
    "admin, project_manager",
    "admin observed; project_manager observed",
    "project:terminal-benchmark",
    "setup, policy approval, queue release",
    "override must audit",
  ],
  [
    "act_owner_contact",
    "project_manager",
    "project_owner observed",
    "project:terminal-benchmark",
    "source relationship metadata",
    "not policy authority",
  ],
  [
    "act_role_lost",
    "project_manager",
    "submitter active",
    "global",
    "submitter routes denied",
    "token role missing",
  ],
];

const peopleCapabilityRows = [
  [
    "contributor",
    "product grouping",
    "May hold submitter and reviewer capabilities.",
    "Not a backend route role.",
  ],
  [
    "submitter",
    "submitter activation path",
    "Claim tasks, start work, submit packets, handle revisions.",
    "Cannot review own submission.",
  ],
  [
    "reviewer",
    "reviewer role",
    "Review checker-passed packets and record findings.",
    "Decisions are only accept, needs_revision, reject.",
  ],
  [
    "admin",
    "admin role",
    "Project setup, overrides, access operations, audit visibility.",
    "Every override needs reason and evidence.",
  ],
  [
    "project_manager",
    "admin-scoped role",
    "Guides, task batches, setup policy approvals, project health.",
    "Cannot silently bypass checker failures.",
  ],
  [
    "audit_manager",
    "future scoped assignment",
    "Audit oversight and evidence trace review.",
    "Read-oriented until role assignment APIs land.",
  ],
];

const peopleProfileFlow: Array<{
  step: string;
  state: string;
  detail: string;
  tone: Tone;
}> = [
  {
    step: "GET /api/v1/auth/me",
    state: "observes",
    detail:
      "Registers ActorIdentity and observed profiles from verified Flow roles.",
    tone: "success",
  },
  {
    step: "Activate submitter profile",
    state: "activates",
    detail:
      "Creates or refreshes the current submitter profile with normalized skill_tags.",
    tone: "info",
  },
  {
    step: "service route checks",
    state: "token roles",
    detail:
      "Current v0.1 route authorization still reads trusted roles from ActorContext.",
    tone: "warning",
  },
  {
    step: "WorkstreamRoleAssignment",
    state: "planned",
    detail:
      "Target model is local actor_id, role, scope_type, scope_id, and status.",
    tone: "danger",
  },
];

const peopleSeparationRows = [
  [
    "self-review",
    "blocked",
    "submitter and reviewer capability can coexist, but a reviewer cannot review their own submission.",
  ],
  [
    "profile-only access",
    "blocked",
    "active or observed profile rows do not grant route permission without the current token role.",
  ],
  [
    "project_owner",
    "metadata only",
    "trusted relationship claims record source/contact context, not policy approval authority.",
  ],
  [
    "reviewer payment edit",
    "blocked",
    "review decisions and payment status updates stay separate operational duties.",
  ],
  [
    "project_manager override",
    "audited path",
    "setup and task management cannot masquerade as submitter claiming or checker bypass.",
  ],
];

const peopleContractRows = [
  [
    "current actor",
    "implemented",
    "GET /api/v1/auth/me",
    "ActorResponse from verified Flow token.",
  ],
  [
    "submitter profile activation",
    "implemented",
    "profile activation path",
    "ActorProfileActivationRequest with skill_tags.",
  ],
  [
    "actor directory",
    "planned",
    "admin list identities/profiles",
    "Needed for this roster to become live data.",
  ],
  [
    "role assignment",
    "planned",
    "grant scoped Workstream role",
    "Required for admin, project_manager, reviewer, audit_manager grants.",
  ],
  [
    "role removal",
    "planned",
    "disable or revoke assignment",
    "Required before access changes can be operated from UI.",
  ],
  [
    "role audit",
    "planned",
    "assignment event stream",
    "Required evidence trail for access changes.",
  ],
];

const screens: Array<{
  key: ScreenKey;
  label: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    key: "admin",
    label: "Admin Dashboard",
    description:
      "Operations command center across setup, queues, reviews, and records.",
    icon: LayoutDashboard,
  },
  {
    key: "people",
    label: "People & Access",
    description: "Actors, profiles, capabilities, and scoped role gaps.",
    icon: UsersRound,
  },
  {
    key: "map",
    label: "Product Map",
    description: "End-to-end product runbook and frontend handoff.",
    icon: GitBranch,
  },
  {
    key: "setup",
    label: "Project Setup",
    description: "Guide, sufficiency, and policy activation.",
    icon: FileText,
  },
  {
    key: "queue",
    label: "Task Queue",
    description: "Screening, release gates, assignment, and lifecycle risk.",
    icon: ListChecks,
  },
  {
    key: "contributor",
    label: "Contributor Dashboard",
    description:
      "Submitter work, reviewer grants, revisions, payments, and reputation.",
    icon: UserCheck,
  },
  {
    key: "submitter",
    label: "Submitter Workspace",
    description: "Task claim, packet builder, and pre-submit checker gate.",
    icon: Send,
  },
  {
    key: "checks",
    label: "Checks Monitor",
    description: "Pre-submit feedback, checker runs, and routing outcomes.",
    icon: ShieldCheck,
  },
  {
    key: "reviewOps",
    label: "Review Ops",
    description: "Reviewer grants, queue leases, and immutable review chains.",
    icon: KeyRound,
  },
  {
    key: "review",
    label: "Review Workspace",
    description: "Evidence, checker run, findings, decision.",
    icon: ClipboardCheck,
  },
  {
    key: "revision",
    label: "Revision Loop",
    description: "Findings, resubmission replay, and reviewer rerouting.",
    icon: History,
  },
  {
    key: "ledger",
    label: "Records Ops",
    description:
      "Contribution, webhook payment, reputation, and audit records.",
    icon: ReceiptText,
  },
];

function App() {
  const [activeScreen, setActiveScreen] = useState<ScreenKey>("admin");
  const [theme, setTheme] = useState<ThemeMode>("light");
  const activeMeta = useMemo(
    () => screens.find((screen) => screen.key === activeScreen) ?? screens[0],
    [activeScreen],
  );
  const isDarkTheme = theme === "dark";

  return (
    <main className="studio-shell" data-theme={theme}>
      <aside className="studio-sidebar" aria-label="Design screens">
        <div className="brand-lockup">
          <span className="brand-mark" aria-hidden="true">
            W
          </span>
          <div>
            <p>Workstream</p>
            <span>coded design studio</span>
          </div>
        </div>

        <nav className="screen-nav">
          {screens.map((screen) => {
            const Icon = screen.icon;
            const isActive = activeScreen === screen.key;
            return (
              <button
                aria-current={isActive ? "page" : undefined}
                className="screen-nav-item"
                key={screen.key}
                onClick={() => setActiveScreen(screen.key)}
                type="button"
              >
                <Icon aria-hidden="true" size={16} />
                <span>{screen.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-note">
          <p className="eyebrow">Design rule</p>
          <p>
            These coded screens are the product handoff source for the frontend
            build. Figma can be generated later from the settled UI.
          </p>
        </div>
      </aside>

      <section className="studio-main" aria-labelledby="screen-title">
        <header className="studio-topbar">
          <div>
            <p className="eyebrow">Workstream v0.1</p>
            <h1 id="screen-title">{activeMeta.label}</h1>
            <p>{activeMeta.description}</p>
          </div>
          <div className="topbar-actions">
            <div className="topbar-status" aria-label="Design status">
              <StatusBadge tone="success">product_handoff</StatusBadge>
              <StatusBadge tone="info">responsive_ui</StatusBadge>
            </div>
            <button
              aria-label={`Switch to ${isDarkTheme ? "light" : "dark"} theme`}
              aria-pressed={isDarkTheme}
              className="theme-toggle"
              onClick={() => setTheme(isDarkTheme ? "light" : "dark")}
              type="button"
            >
              {isDarkTheme ? (
                <Sun aria-hidden="true" size={15} />
              ) : (
                <Moon aria-hidden="true" size={15} />
              )}
              <span>{isDarkTheme ? "Light" : "Dark"}</span>
            </button>
          </div>
        </header>

        {activeScreen === "admin" && (
          <AdminDashboardScreen onOpenScreen={setActiveScreen} />
        )}
        {activeScreen === "people" && <PeopleAccessScreen />}
        {activeScreen === "map" && <ProductMapScreen />}
        {activeScreen === "setup" && <ProjectSetupScreen />}
        {activeScreen === "queue" && <TaskQueueScreen />}
        {activeScreen === "contributor" && <ContributorDashboardScreen />}
        {activeScreen === "submitter" && <SubmitterWorkspaceScreen />}
        {activeScreen === "checks" && <ChecksMonitorScreen />}
        {activeScreen === "reviewOps" && <ReviewOperationsScreen />}
        {activeScreen === "review" && <ReviewWorkspaceScreen />}
        {activeScreen === "revision" && <RevisionLoopScreen />}
        {activeScreen === "ledger" && <RecordsOpsScreen />}
      </section>
    </main>
  );
}

function AdminDashboardScreen({
  onOpenScreen,
}: {
  onOpenScreen: (screen: ScreenKey) => void;
}) {
  return (
    <div className="screen-stack admin-screen">
      <section className="screen-band admin-hero">
        <div className="band-heading">
          <p className="eyebrow">Admin command center</p>
          <h2>
            Run project setup, queue release, review, records, and audit from
            one operational surface
          </h2>
          <p>
            This dashboard is the Workstream admin home: it shows the exact
            lifecycle gate, the owner, the next action, and the operational risk
            that must be cleared before work moves forward.
          </p>
        </div>
        <div className="admin-metric-grid" aria-label="Admin operating state">
          {adminMetrics.map((metric) => (
            <div className="admin-metric" key={metric.label}>
              <p className="eyebrow">{metric.label}</p>
              <strong>{metric.value}</strong>
              <span>{metric.detail}</span>
              <StatusBadge tone={metric.tone}>{metric.tone}</StatusBadge>
            </div>
          ))}
        </div>
      </section>

      <section className="admin-command-layout">
        <div className="screen-band">
          <div className="section-title-row">
            <div>
              <p className="eyebrow">Priority queue</p>
              <h2>Admin work ordered by lifecycle risk</h2>
            </div>
            <StatusBadge tone="warning">4 open gates</StatusBadge>
          </div>
          <DataTable
            columns={["record", "state", "next action", "proof"]}
            rows={adminPriorityRows}
          />
        </div>

        <aside className="decision-panel admin-command-panel">
          <p className="eyebrow">Next decisions</p>
          <h2>Do not release work before these gates are traceable</h2>
          <div className="admin-gate-list">
            {adminReadiness.map((gate) => (
              <div className="admin-gate" key={gate.gate}>
                <div>
                  <code>{gate.gate}</code>
                  <span>{gate.detail}</span>
                </div>
                <StatusBadge tone={gate.tone}>{gate.state}</StatusBadge>
              </div>
            ))}
          </div>
          <div className="decision-actions">
            <button
              className="command-button"
              onClick={() => onOpenScreen("setup")}
              type="button"
            >
              <FileText aria-hidden="true" size={15} />
              Setup
            </button>
            <button
              className="command-button"
              onClick={() => onOpenScreen("people")}
              type="button"
            >
              <UserCog aria-hidden="true" size={15} />
              People
            </button>
            <button
              className="command-button"
              onClick={() => onOpenScreen("queue")}
              type="button"
            >
              <ListChecks aria-hidden="true" size={15} />
              Queue
            </button>
            <button
              className="command-button primary"
              onClick={() => onOpenScreen("reviewOps")}
              type="button"
            >
              <ClipboardCheck aria-hidden="true" size={15} />
              Review Queue
            </button>
          </div>
        </aside>
      </section>

      <section className="two-column admin-ops-grid">
        <div className="screen-band">
          <div className="band-heading compact">
            <p className="eyebrow">Work lanes</p>
            <h2>Each admin lane exposes owner, state, and risk</h2>
          </div>
          <div className="admin-lane-list">
            {adminLanes.map((lane) => (
              <article className="admin-lane-row" key={lane.lane}>
                <div>
                  <code>{lane.lane}</code>
                  <p>{lane.detail}</p>
                </div>
                <div className="admin-lane-meta">
                  <StatusBadge tone={lane.tone}>{lane.state}</StatusBadge>
                  <span>{lane.owner}</span>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="screen-band">
          <div className="band-heading compact">
            <p className="eyebrow">Contributor and admin access</p>
            <h2>
              Profiles are visible, but route access still follows token roles
            </h2>
          </div>
          <DataTable
            columns={["actor", "token roles", "profile state", "admin risk"]}
            rows={adminProfileRows}
          />
        </div>
      </section>

      <section className="two-column admin-ops-grid">
        <div className="screen-band">
          <div className="band-heading compact">
            <p className="eyebrow">Build readiness</p>
            <h2>Live surfaces and planned surfaces stay visibly separated</h2>
          </div>
          <DataTable
            columns={["surface", "readiness", "handoff note"]}
            rows={adminContractRows}
          />
        </div>

        <div className="screen-band">
          <div className="section-title-row">
            <div>
              <p className="eyebrow">Records and audit</p>
              <h2>Accepted work must stay traceable after review</h2>
            </div>
            <StatusBadge tone="info">ledger surface</StatusBadge>
          </div>
          <DataTable
            columns={[
              "contribution",
              "task",
              "submitter",
              "amount",
              "status",
              "policy",
            ]}
            rows={contributionRows
              .slice(0, 3)
              .map(([contribution, task, submitter, amount, status]) => [
                contribution,
                task,
                submitter,
                amount,
                status,
                "locked payment policy",
              ])}
          />
        </div>
      </section>
    </div>
  );
}

function PeopleAccessScreen() {
  return (
    <div className="screen-stack people-screen">
      <section className="screen-band people-hero">
        <div className="band-heading">
          <p className="eyebrow">People and capabilities</p>
          <h2>
            Access roster follows token roles, profile state, and scoped
            capability gaps
          </h2>
          <p>
            This admin surface separates identity, profile eligibility, and
            route permission. A contributor can be a submitter, reviewer, or
            both; admin scopes such as project_manager and audit_manager remain
            explicit capabilities instead of separate product dashboards.
          </p>
        </div>
        <div className="people-metric-grid" aria-label="People access state">
          {peopleMetrics.map((metric) => (
            <div className="people-metric" key={metric.label}>
              <p className="eyebrow">{metric.label}</p>
              <strong>{metric.value}</strong>
              <span>{metric.detail}</span>
              <StatusBadge tone={metric.tone}>{metric.tone}</StatusBadge>
            </div>
          ))}
        </div>
      </section>

      <section className="people-command-layout">
        <div className="screen-band people-roster">
          <div className="section-title-row">
            <div>
              <p className="eyebrow">Actor registry</p>
              <h2>
                Profiles describe eligibility; token roles still authorize
              </h2>
            </div>
            <StatusBadge tone="warning">assignment tool planned</StatusBadge>
          </div>
          <DataTable
            columns={[
              "actor",
              "token roles",
              "profile state",
              "scope",
              "allowed now",
              "blocked risk",
            ]}
            rows={peopleDirectoryRows}
          />
        </div>

        <aside className="decision-panel people-decision-panel">
          <p className="eyebrow">Access decision model</p>
          <h2>Do not treat profile rows as permission grants</h2>
          <p>
            The current backend records observed and active profiles, but route
            permission still requires a trusted role in the current Flow token.
          </p>
          <div className="people-flow-list">
            {peopleProfileFlow.map((item) => (
              <article className="people-flow-row" key={item.step}>
                <div>
                  <code>{item.step}</code>
                  <span>{item.detail}</span>
                </div>
                <StatusBadge tone={item.tone}>{item.state}</StatusBadge>
              </article>
            ))}
          </div>
          <div className="decision-actions">
            <button className="command-button" disabled type="button">
              <KeyRound aria-hidden="true" size={15} />
              Grant Role
            </button>
            <button className="command-button" disabled type="button">
              <Ban aria-hidden="true" size={15} />
              Remove Role
            </button>
          </div>
        </aside>
      </section>

      <section className="two-column people-ops-grid">
        <div className="screen-band">
          <div className="band-heading compact">
            <p className="eyebrow">Capability matrix</p>
            <h2>Contributor and admin scopes stay explicit</h2>
          </div>
          <DataTable
            columns={["capability", "source", "grants", "boundary"]}
            rows={peopleCapabilityRows}
          />
        </div>

        <div className="screen-band">
          <div className="band-heading compact">
            <p className="eyebrow">Separation rules</p>
            <h2>Multi-role users still hit workflow guardrails</h2>
          </div>
          <DataTable
            columns={["case", "outcome", "rule"]}
            rows={peopleSeparationRows}
          />
        </div>
      </section>

      <section className="two-column people-ops-grid">
        <div className="screen-band">
          <div className="band-heading compact">
            <p className="eyebrow">Build readiness</p>
            <h2>Live identity paths and planned access tools stay separated</h2>
          </div>
          <DataTable
            columns={["surface", "contract", "route", "frontend use"]}
            rows={peopleContractRows}
          />
        </div>

        <div className="screen-band">
          <div className="band-heading compact">
            <p className="eyebrow">Target assignment shape</p>
            <h2>Role grants should become Workstream-owned records</h2>
          </div>
          <dl className="field-grid people-assignment-shape">
            <Field label="actor_id" value="act_sidris" mono />
            <Field label="role" value="project_manager" mono />
            <Field label="scope_type" value="project" mono />
            <Field label="scope_id" value="terminal-benchmark" mono />
            <Field label="status" value="active" mono />
            <Field
              label="audit"
              value="assignment reason, approving actor, timestamp, evidence"
            />
          </dl>
        </div>
      </section>
    </div>
  );
}

function ProductMapScreen() {
  return (
    <div className="screen-stack product-map-screen">
      <section className="screen-band">
        <div className="band-heading">
          <p className="eyebrow">End-to-end runbook</p>
          <h2>Run one project from guide setup to paid contribution</h2>
          <p>
            This studio is the product handoff source for the frontend build. It
            shows the actors, screen jobs, blocked states, and handoffs that
            make Workstream usable from project setup through review, revision,
            contribution records, payment status, reputation, and audit.
          </p>
        </div>
        <div className="principle-grid">
          <Metric
            label="pilot run"
            value="7 stages"
            detail="setup -> queue -> submit -> check -> review -> revise -> records"
          />
          <Metric
            label="decision values"
            value="3"
            detail="accept · needs_revision · reject"
          />
          <Metric
            label="contributors"
            value="2 caps"
            detail="submitter and reviewer capabilities can coexist"
          />
          <Metric
            label="payment"
            value="webhook"
            detail="pending -> payment_submitted -> paid"
          />
        </div>
      </section>

      <section className="screen-band">
        <div className="band-heading compact">
          <p className="eyebrow">Pilot journey</p>
          <h2>Every handoff has an actor, a screen, and a blocked state</h2>
        </div>
        <div className="handoff-run-grid">
          {productRunStages.map((stage) => (
            <article className="handoff-stage" key={stage.step}>
              <div>
                <span className="step-index">{stage.step}</span>
                <StatusBadge tone={stage.tone}>{stage.screen}</StatusBadge>
              </div>
              <strong>{stage.actor}</strong>
              <p>{stage.work}</p>
              <small>{stage.blocked}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="screen-band">
        <div className="band-heading compact">
          <p className="eyebrow">Lifecycle spine</p>
          <h2>State labels stay operational, not decorative</h2>
        </div>
        <div className="lifecycle-grid">
          {lifecycle.map((item, index) => (
            <article className="lifecycle-step" key={item.label}>
              <span className="step-index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <StatusBadge tone={item.tone}>{item.label}</StatusBadge>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="two-column">
        <div className="screen-band">
          <div className="band-heading compact">
            <p className="eyebrow">Screen inventory</p>
            <h2>What the frontend team should build from this studio</h2>
          </div>
          <DataTable
            columns={["screen", "primary actor", "job", "visible gate"]}
            rows={productScreenRows}
          />
        </div>

        <div className="screen-band">
          <div className="band-heading compact">
            <p className="eyebrow">Role model</p>
            <h2>Contributors and admins are capability sets</h2>
          </div>
          <div className="role-list">
            <RoleRow
              role="contributor"
              purpose="Human contributor; may hold submitter and reviewer capabilities."
            />
            <RoleRow
              role="submitter"
              purpose="Claims tasks, works the task, submits packets, and closes revisions."
            />
            <RoleRow
              role="reviewer"
              purpose="Reviews checker-passed submissions; never reviews own submission."
            />
            <RoleRow
              role="admin"
              purpose="Umbrella operations authority for setup, overrides, access, and audit."
            />
            <RoleRow
              role="project_manager"
              purpose="Admin scope for guide setup, task batches, policies, and project health."
            />
            <RoleRow
              role="audit_manager"
              purpose="Admin scope for audit oversight when scoped role assignments arrive."
            />
          </div>
        </div>
      </section>

      <section className="screen-band">
        <div className="band-heading compact">
          <p className="eyebrow">Handoff guardrails</p>
          <h2>Build from product states, not decorative mockups</h2>
        </div>
        <DataTable
          columns={["guardrail", "frontend rule", "implementation note"]}
          rows={productHandoffRows}
        />
      </section>
    </div>
  );
}

function ProjectSetupScreen() {
  return (
    <div className="screen-stack setup-screen">
      <section className="screen-band setup-hero">
        <div className="band-heading">
          <p className="eyebrow">Project setup</p>
          <h2>Setup run is policy_draft_ready</h2>
          <p>
            The current backend setup path is an async policy pipeline:
            immutable source snapshot, sufficiency report, derived submission
            artifact policy, effective policy, compiled checker bundle, and
            guide activation.
          </p>
        </div>
        <div className="setup-status-strip" aria-label="Project setup status">
          <SetupStatusTile
            label="project"
            value="terminal-benchmark"
            tone="neutral"
          />
          <SetupStatusTile label="guide" value="v1" tone="info" />
          <SetupStatusTile
            label="setup_run"
            value="policy_draft_ready"
            tone="warning"
          />
          <SetupStatusTile
            label="final_state"
            value="ready_to_activate"
            tone="success"
          />
        </div>
      </section>

      <section className="setup-layout setup-deep-layout">
        <div className="screen-band setup-primary">
          <div className="band-heading compact">
            <p className="eyebrow">Source snapshot</p>
            <h2>Guide material captured before any policy work</h2>
          </div>
          <dl className="field-grid">
            <Field label="project_id" value="prj-terminal-benchmark" mono />
            <Field label="guide_version" value="v1" mono />
            <Field label="source_snapshot_id" value="<redacted-id>" mono />
            <Field
              label="source_snapshot_hash"
              value="sha256:<redacted>"
              mono
            />
            <Field label="captured_by" value="project_manager" mono />
          </dl>

          <div className="review-section">
            <div className="section-title-row">
              <div>
                <p className="eyebrow">Source material</p>
                <h3>Sanitized durable references</h3>
              </div>
              <StatusBadge tone="success">6 visible</StatusBadge>
            </div>
            <DataTable
              columns={["item", "source kind", "durable ref"]}
              rows={sourceSnapshotItems}
            />
          </div>
        </div>

        <div className="screen-band setup-pipeline">
          <div className="band-heading compact">
            <p className="eyebrow">Automatic setup run</p>
            <h2>Celery-backed project setup, visible through APIs</h2>
          </div>
          <div className="setup-timeline">
            {setupRunSteps.map((step, index) => (
              <article className="setup-step" key={step.phase}>
                <span className="step-index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <code>{step.phase}</code>
                  <p>{step.detail}</p>
                  <span className="mono">{step.endpoint}</span>
                </div>
                <StatusBadge tone={step.tone}>{step.status}</StatusBadge>
              </article>
            ))}
          </div>

          <div className="sufficiency-panel setup-sufficiency">
            <div>
              <StatusBadge tone="success">passed</StatusBadge>
              <p>
                ProjectGuideSufficiencyAgent accepted the guide source envelope
                and returned no blocking setup gaps.
              </p>
            </div>
            <button className="command-button" type="button">
              <CheckCircle2 aria-hidden="true" size={15} />
              View Report
            </button>
          </div>
        </div>

        <aside className="decision-panel setup-activation">
          <p className="eyebrow">Activation gate</p>
          <h2>Approve policy before guide activation</h2>
          <p>
            The guide should not activate until the exact submission artifact
            policy has been reviewed and approved by an authorized operator.
          </p>
          <div className="activation-gate-list">
            {activationGates.map((gate) => (
              <div className="activation-gate" key={gate.gate}>
                <div>
                  <code>{gate.gate}</code>
                  <span>{gate.detail}</span>
                </div>
                <StatusBadge tone={gate.tone}>{gate.state}</StatusBadge>
              </div>
            ))}
          </div>
          <div className="decision-actions setup-actions">
            <button className="command-button" type="button">
              <FileText aria-hidden="true" size={15} />
              Edit Draft
            </button>
            <button className="command-button primary" type="button">
              <CheckCircle2 aria-hidden="true" size={15} />
              Approve Policy
            </button>
          </div>
        </aside>
      </section>

      <section className="two-column setup-policy-grid">
        <div className="screen-band">
          <div className="band-heading compact">
            <p className="eyebrow">Policy outputs</p>
            <h2>Every activation dependency has an API surface</h2>
          </div>
          <DataTable
            columns={["policy", "version", "hash", "state"]}
            rows={policies}
          />
        </div>

        <div className="screen-band">
          <div className="band-heading compact">
            <p className="eyebrow">Derived intake contract</p>
            <h2>What the submitter workspace must enforce</h2>
          </div>
          <div className="policy-group-list">
            {setupPolicyGroups.map((group) => (
              <article className="policy-group" key={group.label}>
                <div className="policy-group-head">
                  <code>{group.label}</code>
                  <span>{group.detail}</span>
                </div>
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="screen-band">
        <div className="section-title-row">
          <div>
            <p className="eyebrow">Compiled project checker policy</p>
            <h2>One project-scoped checker bundle reused by tasks</h2>
          </div>
          <StatusBadge tone="success">compiled_bundle_hash</StatusBadge>
        </div>
        <div className="checker-policy-grid">
          {compiledCheckers.map((checker) => (
            <article className="checker-policy-card" key={checker.name}>
              <ShieldCheck aria-hidden="true" size={16} />
              <div>
                <code>{checker.name}</code>
                <p>{checker.purpose}</p>
              </div>
              <StatusBadge tone={checker.tone}>enabled</StatusBadge>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function TaskQueueScreen() {
  return (
    <div className="screen-stack queue-screen">
      <section className="screen-band queue-hero">
        <div className="band-heading">
          <p className="eyebrow">Task queue and release</p>
          <h2>
            Release tasks only after guide, policy, checker, and payout context
            are locked
          </h2>
          <p>
            This is the admin/project-manager console for moving tasks from
            DRAFT to SCREENING to READY. READY is the first state visible to
            submitters, so every row exposes the release gate, locked context,
            assignment state, reviewer routing, and payment policy.
          </p>
        </div>
        <div className="queue-metric-grid" aria-label="Task release state">
          {queueMetrics.map((metric) => (
            <div className="queue-metric" key={metric.label}>
              <p className="eyebrow">{metric.label}</p>
              <strong>{metric.value}</strong>
              <span>{metric.detail}</span>
              <StatusBadge tone={metric.tone}>{metric.tone}</StatusBadge>
            </div>
          ))}
        </div>
      </section>

      <section className="queue-command-layout">
        <div className="screen-band queue-roster">
          <div className="queue-toolbar" aria-label="Task queue controls">
            <label className="search-field">
              <Search aria-hidden="true" size={16} />
              <span className="visually-hidden">Search tasks</span>
              <input
                placeholder="task id, project, status, skill tag, submitter"
                type="search"
              />
            </label>
            <div className="status-tabs" aria-label="Lifecycle filters">
              {stateCounts.slice(0, 7).map((state) => (
                <button key={state.status} type="button">
                  <StatusBadge tone={state.tone}>{state.status}</StatusBadge>
                  <span>{state.count}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="section-title-row">
            <div>
              <p className="eyebrow">Release queue</p>
              <h2>Comparison table first, release decision second</h2>
            </div>
            <StatusBadge tone="warning">2 blocked gates</StatusBadge>
          </div>
          <DataTable
            columns={[
              "task",
              "project / state",
              "release gate",
              "locked context",
              "contributors",
              "terms",
            ]}
            rows={releaseRows}
          />
        </div>

        <aside className="decision-panel queue-decision-panel">
          <p className="eyebrow">Release decision</p>
          <h2>READY requires traceable setup evidence</h2>
          <p>
            Release is not a cosmetic status change. It makes the task visible
            to submitters and freezes the task contract they will work against.
          </p>
          <div className="queue-gate-list">
            {releaseGates.map((gate) => (
              <article className="queue-gate" key={gate.gate}>
                <div>
                  <code>{gate.gate}</code>
                  <span>{gate.detail}</span>
                </div>
                <StatusBadge tone={gate.tone}>{gate.state}</StatusBadge>
              </article>
            ))}
          </div>
          <div className="decision-actions">
            <button className="command-button" type="button">
              <ShieldCheck aria-hidden="true" size={15} />
              Screen
            </button>
            <button className="command-button primary" type="button">
              <CheckCircle2 aria-hidden="true" size={15} />
              Release Ready
            </button>
          </div>
        </aside>
      </section>

      <section className="two-column queue-ops-grid">
        <div className="screen-band">
          <div className="band-heading compact">
            <p className="eyebrow">Locked context</p>
            <h2>Every READY task carries immutable policy evidence</h2>
          </div>
          <DataTable
            columns={["lock", "required", "backend field", "release impact"]}
            rows={queuePolicyRows}
          />
        </div>

        <div className="screen-band">
          <div className="band-heading compact">
            <p className="eyebrow">Blocked transitions</p>
            <h2>Queue actions must not skip lifecycle rules</h2>
          </div>
          <DataTable
            columns={["case", "outcome", "rule"]}
            rows={queueBlockedRows}
          />
        </div>
      </section>

      <section className="two-column queue-ops-grid">
        <div className="screen-band">
          <div className="band-heading compact">
            <p className="eyebrow">Build readiness</p>
            <h2>Task actions are live; the queue dashboard can grow on top</h2>
          </div>
          <DataTable
            columns={["surface", "route", "readiness"]}
            rows={queueContractRows}
          />
        </div>

        <div className="screen-band">
          <div className="band-heading compact">
            <p className="eyebrow">Contributor handoff</p>
            <h2>Submitter and reviewer are both contributor capabilities</h2>
          </div>
          <div className="decision-list">
            <DecisionRow
              decision="submitter"
              detail="Claims READY tasks, starts work, runs pre-submit checks, and creates immutable submission packets."
              tone="info"
            />
            <DecisionRow
              decision="reviewer"
              detail="Reviews checker-passed submissions and records accept, needs_revision, or reject decisions."
              tone="success"
            />
            <DecisionRow
              decision="submitter boundary"
              detail="Product copy should present this role as submitter wherever contributors claim, work, and submit tasks."
              tone="warning"
            />
            <DecisionRow
              decision="admin"
              detail="Screens and releases tasks, but does not impersonate submitter claiming or submission work."
              tone="danger"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function ContributorDashboardScreen() {
  return (
    <div className="screen-stack contributor-screen">
      <section className="screen-band contributor-hero">
        <div className="band-heading">
          <p className="eyebrow">Contributor home</p>
          <h2>One dashboard for submitter work and reviewer privileges</h2>
          <p>
            A contributor can hold submitter, reviewer, or both project grants.
            The dashboard keeps assigned work, review leases, payment state, and
            reputation signals separate so the contributor knows exactly what to
            do next.
          </p>
        </div>
        <div className="contributor-profile-panel">
          <div className="contributor-identity">
            <span className="brand-mark" aria-hidden="true">
              MR
            </span>
            <div>
              <p>M. Reyes</p>
              <span>contributor_id ctr-2049</span>
            </div>
            <StatusBadge tone="success">active</StatusBadge>
          </div>
          <div
            className="contributor-scope-grid"
            aria-label="Contributor role grants"
          >
            <ReviewStatusTile
              label="submitter grant"
              value="2 active"
              tone="info"
            />
            <ReviewStatusTile
              label="reviewer grant"
              value="1 active"
              tone="success"
            />
            <ReviewStatusTile
              label="payment records"
              value="3"
              tone="warning"
            />
            <ReviewStatusTile label="open findings" value="3" tone="danger" />
          </div>
        </div>
      </section>

      <section
        className="contributor-metric-grid"
        aria-label="Contributor summary"
      >
        {contributorMetrics.map((metric) => (
          <div className="screen-band contributor-metric" key={metric.label}>
            <p className="eyebrow">{metric.label}</p>
            <strong>{metric.value}</strong>
            <span>{metric.detail}</span>
            <StatusBadge tone={metric.tone}>{metric.tone}</StatusBadge>
          </div>
        ))}
      </section>

      <div className="contributor-layout">
        <section className="screen-band contributor-work-list">
          <div className="section-title-row">
            <div>
              <p className="eyebrow">Today</p>
              <h2>Work that needs contributor action</h2>
            </div>
            <StatusBadge tone="warning">4 items</StatusBadge>
          </div>

          <div
            className="status-tabs"
            role="group"
            aria-label="Contributor work filters"
          >
            <button type="button">all</button>
            <button type="button">submitter</button>
            <button type="button">reviewer</button>
            <button type="button">needs_revision</button>
          </div>

          <div className="contributor-task-list">
            {contributorWorkItems.map((item) => (
              <article className="contributor-task-card" key={item.id}>
                <div className="contributor-task-main">
                  <div>
                    <p className="eyebrow">{item.role}</p>
                    <h3>{item.title}</h3>
                    <span>{item.project}</span>
                  </div>
                  <StatusBadge tone={item.tone}>{item.status}</StatusBadge>
                </div>
                <p>{item.detail}</p>
                <div className="contributor-task-meta">
                  <span className="mono">{item.id}</span>
                  <span>{item.due}</span>
                  <span>{item.amount}</span>
                </div>
                <button className="command-button" type="button">
                  <Send aria-hidden="true" size={15} />
                  {item.action}
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="screen-band contributor-action-panel">
          <div className="section-title-row">
            <div>
              <p className="eyebrow">Selected task t-91c4</p>
              <h2>Revision is the next submitter action</h2>
            </div>
            <StatusBadge tone="danger">needs_revision</StatusBadge>
          </div>

          <div className="contributor-deadline-band">
            <AlertTriangle aria-hidden="true" size={16} />
            <div>
              <strong>2h 10m before revision deadline</strong>
              <span>
                Submitter can resubmit only while the assignment remains open
                and the revision policy still permits another attempt.
              </span>
            </div>
          </div>

          <div className="review-section">
            <p className="eyebrow">Findings to answer</p>
            <div className="contributor-finding-list">
              {contributorRevisionItems.map((finding) => (
                <article className="contributor-finding-row" key={finding.id}>
                  <div>
                    <code>{finding.id}</code>
                    <StatusBadge tone={finding.tone}>
                      {finding.state}
                    </StatusBadge>
                  </div>
                  <p>{finding.detail}</p>
                  <span className="mono">{finding.severity}</span>
                </article>
              ))}
            </div>
          </div>

          <div className="review-section contributor-builder-preview">
            <div className="section-title-row">
              <div>
                <p className="eyebrow">Packet draft</p>
                <h3>SubmissionVersion v2 draft</h3>
              </div>
              <StatusBadge tone="warning">attestation missing</StatusBadge>
            </div>
            <dl className="field-grid">
              <Field label="required_output" value="answer.md" mono />
              <Field label="artifact_hash" value="sha256:ans-f19b" mono />
              <Field label="evidence" value="trace.json, run.log" />
              <Field label="prior_version" value="sv-91c4-1" mono />
            </dl>
          </div>

          <div className="decision-actions">
            <button className="command-button" type="button">
              <ShieldCheck aria-hidden="true" size={15} />
              Run Precheck
            </button>
            <button className="command-button primary" type="button">
              <Send aria-hidden="true" size={15} />
              Open Revision Builder
            </button>
          </div>
        </section>

        <aside className="decision-panel contributor-side-panel">
          <p className="eyebrow">Contributor account</p>
          <h2>Grants, payments, and signals stay separate</h2>
          <p>
            Submitter quality affects contribution reputation. Reviewer lease
            expiry and release events are audit-only in v0.1.
          </p>

          <div className="review-section">
            <p className="eyebrow">Current grants</p>
            <div className="account-row-list">
              {contributorGrantRows.map(
                ([project, grant, status, source, snapshot]) => (
                  <article className="account-row" key={`${project}-${grant}`}>
                    <div>
                      <strong>{project}</strong>
                      <span>{source}</span>
                    </div>
                    <div className="account-row-meta">
                      <StatusBadge
                        tone={status === "active" ? "success" : "danger"}
                      >
                        {grant}
                      </StatusBadge>
                      <code>{snapshot}</code>
                    </div>
                  </article>
                ),
              )}
            </div>
          </div>

          <div className="review-section">
            <p className="eyebrow">Payments</p>
            <div className="account-row-list">
              {contributorPaymentRows.map(
                ([record, task, amount, status, source]) => (
                  <article className="account-row" key={record}>
                    <div>
                      <strong>
                        {amount} · {task}
                      </strong>
                      <span>{source}</span>
                    </div>
                    <div className="account-row-meta">
                      <StatusBadge
                        tone={
                          status === "paid"
                            ? "success"
                            : status === "pending"
                              ? "warning"
                              : "info"
                        }
                      >
                        {status}
                      </StatusBadge>
                      <code>{record}</code>
                    </div>
                  </article>
                ),
              )}
            </div>
          </div>

          <div className="review-section">
            <p className="eyebrow">Reputation and audit</p>
            <div className="account-row-list">
              {contributorReputationRows.map(
                ([signal, event, effect, reason]) => (
                  <article className="account-row" key={`${signal}-${event}`}>
                    <div>
                      <strong>{signal}</strong>
                      <span>{reason}</span>
                    </div>
                    <div className="account-row-meta">
                      <StatusBadge
                        tone={effect === "+12" ? "success" : "neutral"}
                      >
                        {effect}
                      </StatusBadge>
                      <code>{event}</code>
                    </div>
                  </article>
                ),
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function SubmitterWorkspaceScreen() {
  return (
    <div className="screen-stack submitter-screen">
      <section className="screen-band submitter-hero">
        <div className="band-heading">
          <p className="eyebrow">Submitter workspace</p>
          <h2>Build a submission packet against the locked task contract</h2>
          <p>
            The submitter works from the frozen guide, task, artifact policy,
            and revision context. Pre-submit checks can block packet creation;
            they are not review decisions.
          </p>
        </div>
        <div className="review-status-strip" aria-label="Submitter task state">
          <ReviewStatusTile label="task" value="t-91c4" tone="neutral" />
          <ReviewStatusTile
            label="state"
            value="needs_revision"
            tone="danger"
          />
          <ReviewStatusTile label="attempt" value="v2 draft" tone="warning" />
          <ReviewStatusTile label="payment" value="$25 locked" tone="info" />
        </div>
      </section>

      <div className="submitter-layout">
        <section className="screen-band submitter-brief">
          <div className="section-title-row">
            <div>
              <p className="eyebrow">Task brief</p>
              <h2>Proof evaluation</h2>
            </div>
            <StatusBadge tone="danger">revision required</StatusBadge>
          </div>
          <dl className="field-grid">
            <Field label="title" value="Evaluate supplied proof" />
            <Field label="project" value="STEM Proof Evaluation" />
            <Field
              label="locked_guide"
              value="guide v3 / sha256:gde-91c4"
              mono
            />
            <Field label="required_output" value="answer.md" mono />
            <Field label="required_evidence" value="trace.json, run.log" />
            <Field label="assignment" value="active submitter grant" />
            <Field label="deadline" value="2026-07-09 23:00" mono />
          </dl>

          <div className="review-section">
            <p className="eyebrow">Acceptance criteria</p>
            <ul className="acceptance-list">
              <li>
                Answer cites the exact trace row supporting the conclusion.
              </li>
              <li>Submission manifest preserves artifact names and hashes.</li>
              <li>All blocking review findings have fix notes and evidence.</li>
            </ul>
          </div>

          <div className="review-section">
            <p className="eyebrow">Version history</p>
            <DataTable
              columns={["step", "state", "record", "meaning"]}
              rows={submitterTimelineRows}
            />
          </div>
        </section>

        <section className="screen-band submitter-builder">
          <div className="section-title-row">
            <div>
              <p className="eyebrow">Packet builder</p>
              <h2>Artifacts, evidence, and replay are prepared together</h2>
            </div>
            <StatusBadge tone="warning">1 required file missing</StatusBadge>
          </div>

          <div
            className="artifact-list"
            aria-label="Required submission artifacts"
          >
            {submitterArtifactRows.map((artifact) => (
              <article className="artifact-row" key={artifact.label}>
                <div className="artifact-row-icon" aria-hidden="true">
                  <FileText size={15} />
                </div>
                <div>
                  <strong>{artifact.label}</strong>
                  <span>{artifact.required}</span>
                  <code>{artifact.attached}</code>
                </div>
                <StatusBadge tone={artifact.tone}>
                  {artifact.status}
                </StatusBadge>
              </article>
            ))}
          </div>

          <div className="review-section">
            <div className="section-title-row">
              <div>
                <p className="eyebrow">Revision replay</p>
                <h3>Revision findings are packet requirements now</h3>
              </div>
              <StatusBadge tone="danger">2 blocking</StatusBadge>
            </div>
            <div className="replay-grid">
              {contributorRevisionItems.map((finding) => (
                <article className="replay-card" key={finding.id}>
                  <div className="replay-card-head">
                    <code>{finding.id}</code>
                    <StatusBadge tone={finding.tone}>
                      {finding.state}
                    </StatusBadge>
                  </div>
                  <dl className="mini-field-grid">
                    <Field label="severity" value={finding.severity} mono />
                    <Field label="fix_note" value={finding.detail} />
                  </dl>
                </article>
              ))}
            </div>
          </div>

          <div className="review-section">
            <div className="section-title-row">
              <div>
                <p className="eyebrow">Evidence shelf</p>
                <h3>Files are visible before finalize</h3>
              </div>
              <StatusBadge tone="info">3 attached</StatusBadge>
            </div>
            <div className="evidence-grid" aria-label="Evidence shelf">
              <EvidenceCard
                detail="Final answer draft with citations to trace rows."
                hash="sha256:ans-f19b"
                label="answer.md"
              />
              <EvidenceCard
                detail="Trace row evidence used by rf-108 fix."
                hash="sha256:test-9c2e"
                label="trace.json"
              />
              <EvidenceCard
                detail="Manifest with artifact labels and output hashes."
                hash="sha256:pkg-41c8e2"
                label="manifest.json"
              />
            </div>
          </div>
        </section>

        <aside className="decision-panel submitter-submit-panel">
          <p className="eyebrow">Submit controls</p>
          <h2>Finalize creates SubmissionVersion v2</h2>
          <p>
            The finalize action stays blocked until required evidence and
            attestation pass pre-submit checks.
          </p>

          <div className="checker-stack">
            {submitterPreflightRows.map((row) => (
              <article className="checker-result compact" key={row.name}>
                <div className="checker-result-icon" aria-hidden="true">
                  {row.tone === "danger" ? (
                    <AlertTriangle size={16} />
                  ) : (
                    <ShieldCheck size={16} />
                  )}
                </div>
                <div className="checker-result-copy">
                  <code>{row.name}</code>
                  <p>{row.detail}</p>
                </div>
                <StatusBadge tone={row.tone}>{row.status}</StatusBadge>
              </article>
            ))}
          </div>

          <div className="side-effect-panel">
            <p className="eyebrow">After finalize</p>
            <div className="side-effect-list">
              <SideEffect
                icon={LockKeyhole}
                label="v2 packet becomes immutable"
              />
              <SideEffect
                icon={ShieldCheck}
                label="durable checker run starts"
              />
              <SideEffect
                icon={KeyRound}
                label="review queue preference applies"
              />
            </div>
          </div>

          <div className="decision-actions">
            <button className="command-button" type="button">
              <ShieldCheck aria-hidden="true" size={15} />
              Run Precheck
            </button>
            <button className="command-button primary" disabled type="button">
              <Send aria-hidden="true" size={15} />
              Finalize Packet
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function ChecksMonitorScreen() {
  return (
    <div className="screen-stack checks-screen">
      <section className="screen-band checks-hero">
        <div className="band-heading">
          <p className="eyebrow">Submission checks monitor</p>
          <h2>
            Separate pre-submit feedback, durable checker runs, and review
            routing
          </h2>
          <p>
            This operations surface shows where each submission packet is in the
            checker gate. Pre-submit feedback can stop packet creation; durable
            checker runs route finalized submissions to review, revision, retry,
            or internal setup repair.
          </p>
        </div>
        <div className="checks-metric-grid" aria-label="Checker run state">
          {checkMetrics.map((metric) => (
            <div className="checks-metric" key={metric.label}>
              <p className="eyebrow">{metric.label}</p>
              <strong>{metric.value}</strong>
              <span>{metric.detail}</span>
              <StatusBadge tone={metric.tone}>{metric.tone}</StatusBadge>
            </div>
          ))}
        </div>
      </section>

      <section className="checks-command-layout">
        <div className="screen-band checks-roster">
          <div className="queue-toolbar" aria-label="Checker run controls">
            <label className="search-field">
              <Search aria-hidden="true" size={16} />
              <span className="visually-hidden">Search checker runs</span>
              <input
                placeholder="checker run, submission, task, routing"
                type="search"
              />
            </label>
            <div className="status-tabs" aria-label="Checker filters">
              {[
                ["queued", "2", "neutral"],
                ["running", "5", "info"],
                ["completed", "14", "success"],
                ["failed", "1", "danger"],
                ["blocking", "3", "warning"],
              ].map(([label, count, tone]) => (
                <button key={label} type="button">
                  <StatusBadge tone={tone as Tone}>{label}</StatusBadge>
                  <span>{count}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="section-title-row">
            <div>
              <p className="eyebrow">Checker runs</p>
              <h2>Current submission versions and routing recommendations</h2>
            </div>
            <StatusBadge tone="warning">routing is not review</StatusBadge>
          </div>
          <DataTable
            columns={[
              "run",
              "submission",
              "task",
              "status",
              "routing",
              "blocking",
              "results",
              "current",
            ]}
            rows={checkRunRows}
          />
        </div>

        <aside className="decision-panel checks-decision-panel">
          <p className="eyebrow">Routing boundary</p>
          <h2>Checker recommendations are not human review decisions</h2>
          <p>
            The backend routing values guide lifecycle movement, but reviewer
            decisions remain only accept, needs_revision, or reject.
          </p>
          <div className="checks-flow-list">
            {checkRoutingRows.map(([route, state, detail, boundary]) => (
              <article className="checks-flow-row" key={route}>
                <div>
                  <code>{route}</code>
                  <span>{detail}</span>
                  <strong>{boundary}</strong>
                </div>
                <StatusBadge tone={routeTone(route)}>{state}</StatusBadge>
              </article>
            ))}
          </div>
          <div className="decision-actions">
            <button className="command-button" type="button">
              <ShieldCheck aria-hidden="true" size={15} />
              Retry Run
            </button>
            <button className="command-button primary" type="button">
              <ClipboardCheck aria-hidden="true" size={15} />
              Open Review
            </button>
          </div>
        </aside>
      </section>

      <section className="two-column checks-ops-grid">
        <div className="screen-band">
          <div className="band-heading compact">
            <p className="eyebrow">Pre-submit feedback</p>
            <h2>Non-authoritative checks can block packet creation</h2>
          </div>
          <DataTable
            columns={["packet", "status", "result", "submitter action"]}
            rows={preSubmitRows}
          />
        </div>

        <div className="screen-band">
          <div className="band-heading compact">
            <p className="eyebrow">Run evidence</p>
            <h2>Checker output must bind to the locked submission context</h2>
          </div>
          <DataTable
            columns={["field", "purpose", "operator meaning"]}
            rows={checkPolicyRows}
          />
        </div>
      </section>

      <section className="two-column checks-ops-grid">
        <div className="screen-band">
          <div className="band-heading compact">
            <p className="eyebrow">Checker API contracts</p>
            <h2>Implemented routes and the pending monitor list endpoint</h2>
          </div>
          <DataTable
            columns={["surface", "route", "contract", "frontend use"]}
            rows={checkContractRows}
          />
        </div>

        <div className="screen-band">
          <div className="band-heading compact">
            <p className="eyebrow">State guardrails</p>
            <h2>What the monitor must make impossible to miss</h2>
          </div>
          <div className="decision-list">
            <DecisionRow
              decision="precheck"
              detail="Failed pre-submit checks return structured feedback and create no submission."
              tone="warning"
            />
            <DecisionRow
              decision="finalize"
              detail="Submission packet becomes immutable before durable checker runs begin."
              tone="info"
            />
            <DecisionRow
              decision="review gate"
              detail="REVIEW_PENDING requires a checker run for the exact submission version."
              tone="success"
            />
            <DecisionRow
              decision="setup repair"
              detail="Policy or provenance defects stay in internal operations, not reviewer queues."
              tone="danger"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function ReviewOperationsScreen() {
  return (
    <div className="screen-stack review-ops-screen">
      <section className="screen-band review-ops-hero">
        <div className="band-heading">
          <p className="eyebrow">Review lifecycle operations</p>
          <h2>
            Keep reviewer routing moving without losing evidence or authority
          </h2>
          <p>
            This is the review operations desk: who can claim review work, which
            submissions are waiting, which leases are at risk, and when a
            reviewer decision becomes a permanent record.
          </p>
        </div>
        <div className="review-ops-metric-grid" aria-label="Review queue state">
          {reviewOpsMetrics.map((metric) => (
            <div className="review-ops-metric" key={metric.label}>
              <p className="eyebrow">{metric.label}</p>
              <strong>{metric.value}</strong>
              <span>{metric.detail}</span>
              <StatusBadge tone={metric.tone}>{metric.tone}</StatusBadge>
            </div>
          ))}
        </div>
      </section>

      <section className="review-ops-command-layout">
        <div className="screen-band review-ops-roster">
          <div className="queue-toolbar" aria-label="Review queue controls">
            <label className="search-field">
              <Search aria-hidden="true" size={16} />
              <span className="visually-hidden">Search review queue</span>
              <input
                placeholder="entry, submission version, reviewer, task"
                type="search"
              />
            </label>
            <div className="status-tabs" aria-label="Review queue filters">
              {[
                ["pending", "11", "info"],
                ["leased", "4", "warning"],
                ["closed", "37", "success"],
                ["preference", "3", "neutral"],
                ["expired", "2", "danger"],
              ].map(([label, count, tone]) => (
                <button key={label} type="button">
                  <StatusBadge tone={tone as Tone}>{label}</StatusBadge>
                  <span>{count}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="section-title-row">
            <div>
              <p className="eyebrow">Review inbox</p>
              <h2>Submissions waiting for claim, release, or decision</h2>
            </div>
            <StatusBadge tone="warning">review record separate</StatusBadge>
          </div>
          <DataTable
            columns={[
              "entry",
              "submission version",
              "project / task",
              "queue state",
              "preference",
              "lease",
              "eligible action",
            ]}
            rows={reviewQueueRows}
          />
        </div>

        <aside className="decision-panel review-ops-decision-panel">
          <p className="eyebrow">Claim boundary</p>
          <h2>Role authority is granted, not computed</h2>
          <p>
            A reviewer claim requires an active project-scoped reviewer or both
            grant. Reputation can inform grants, but it never creates claim
            authority in v1.
          </p>
          <div className="review-ops-flow-list">
            <DecisionRow
              decision="403 unauthorized_actor"
              detail="No active project-scoped reviewer or both grant."
              tone="danger"
            />
            <DecisionRow
              decision="409 reviewer_preference_active"
              detail="Preferred reviewer window is still open for another reviewer."
              tone="warning"
            />
            <DecisionRow
              decision="claim succeeds"
              detail="Entry becomes leased and lease_expires_at is stamped."
              tone="success"
            />
          </div>
          <div className="decision-actions">
            <button className="command-button" type="button">
              <KeyRound aria-hidden="true" size={15} />
              Grant Check
            </button>
            <button className="command-button primary" type="button">
              <ClipboardCheck aria-hidden="true" size={15} />
              Open Leased Review
            </button>
          </div>
        </aside>
      </section>

      <section className="two-column review-ops-grid">
        <div className="screen-band">
          <div className="band-heading compact">
            <p className="eyebrow">Reviewer grants</p>
            <h2>Submitter and reviewer remain contributor capabilities</h2>
          </div>
          <DataTable
            columns={[
              "contributor",
              "project",
              "role",
              "status",
              "reputation snapshot",
              "authority result",
            ]}
            rows={reviewGrantRows}
          />
        </div>

        <div className="screen-band">
          <div className="band-heading compact">
            <p className="eyebrow">Lease and preference rules</p>
            <h2>Every automated route has a manual override</h2>
          </div>
          <DataTable
            columns={["case", "effect", "audit / error", "queue result"]}
            rows={reviewLeaseRows}
          />
        </div>
      </section>

      <section className="two-column review-ops-grid">
        <div className="screen-band">
          <div className="band-heading compact">
            <p className="eyebrow">Immutable chain</p>
            <h2>SubmissionVersion and Review records are never overwritten</h2>
          </div>
          <DataTable
            columns={[
              "version",
              "submission",
              "review",
              "decision",
              "prior review",
              "record rule",
            ]}
            rows={reviewChainRows}
          />
        </div>

        <div className="screen-band">
          <div className="band-heading compact">
            <p className="eyebrow">Reject v0.1</p>
            <h2>Reject closes the task and bans that contributor assignment</h2>
          </div>
          <DataTable
            columns={["object", "state", "effect"]}
            rows={reviewRejectRows}
          />
        </div>
      </section>

      <section className="two-column review-ops-grid">
        <div className="screen-band">
          <div className="band-heading compact">
            <p className="eyebrow">Build readiness</p>
            <h2>Decision and queue APIs can land behind this screen</h2>
          </div>
          <DataTable
            columns={["surface", "status", "frontend meaning"]}
            rows={reviewContractRows}
          />
        </div>

        <div className="screen-band">
          <div className="band-heading compact">
            <p className="eyebrow">State guardrails</p>
            <h2>What the Review Ops screen must keep visible</h2>
          </div>
          <div className="decision-list">
            <DecisionRow
              decision="queue disposable"
              detail="Review inbox entries can move, expire, and close; reviews and submission versions cannot mutate."
              tone="info"
            />
            <DecisionRow
              decision="needs_revision"
              detail="Findings are required and the next version prefers the same reviewer for a limited window."
              tone="warning"
            />
            <DecisionRow
              decision="accept"
              detail="Terminal for the review chain and hands off to contribution/payment/reputation records."
              tone="success"
            />
            <DecisionRow
              decision="reject"
              detail="Terminal in v0.1; TaskAssignment is banned and task is closed."
              tone="danger"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function ReviewWorkspaceScreen() {
  return (
    <div className="screen-stack review-screen review-product-screen">
      <section className="review-case-summary">
        <div>
          <p className="eyebrow">Active review</p>
          <h2>Proof evaluation: trace-to-answer check</h2>
          <p>
            Decide whether M. Reyes has repaired the evidence gap in submission
            v2. Acceptance is blocked until the prior high finding is closed.
          </p>
        </div>
        <div className="review-case-status" aria-label="Review case status">
          <div>
            <span>Lease</span>
            <strong>18 min</strong>
          </div>
          <div>
            <span>Findings</span>
            <strong>1 open</strong>
          </div>
          <div>
            <span>Outcome</span>
            <StatusBadge tone="danger">blocked</StatusBadge>
          </div>
        </div>
      </section>

      <div className="review-desk-layout">
        <aside className="review-inbox">
          <div className="review-pane-heading">
            <p className="eyebrow">Inbox</p>
            <h2>Reviews to finish</h2>
          </div>
          <div className="review-inbox-list" aria-label="Review queue entries">
            {reviewerQueueItems.map((item) => (
              <button
                aria-current={item.id === "rqe-91c4" ? "true" : undefined}
                className="review-inbox-item"
                key={item.id}
                type="button"
              >
                <span>{item.project}</span>
                <strong>{item.task}</strong>
                <small>{item.detail}</small>
                <StatusBadge tone={item.tone}>{item.state}</StatusBadge>
              </button>
            ))}
          </div>

          <div className="review-context-card">
            <p className="eyebrow">Case file</p>
            <dl>
              <div>
                <dt>Submitter</dt>
                <dd>M. Reyes</dd>
              </div>
              <div>
                <dt>Submission</dt>
                <dd className="mono">sv-91c4-2</dd>
              </div>
              <div>
                <dt>Payment exposure</dt>
                <dd>$25 pending on accept</dd>
              </div>
              <div>
                <dt>Policies</dt>
                <dd className="mono">guide v3 / review v3</dd>
              </div>
            </dl>
          </div>
        </aside>

        <section className="review-work-surface">
          <div className="review-work-toolbar">
            <div>
              <p className="eyebrow">Submission</p>
              <h2>answer.md</h2>
            </div>
            <div
              className="review-view-tabs"
              aria-label="Review workspace views"
            >
              <button aria-pressed="true" type="button">
                Submission
              </button>
              <button type="button">Evidence</button>
              <button type="button">Checks</button>
              <button type="button">Replay</button>
            </div>
          </div>

          <article
            className="submission-document"
            aria-label="Submission preview"
          >
            <header>
              <div>
                <FileText aria-hidden="true" size={18} />
                <strong>Submitted answer</strong>
              </div>
              <StatusBadge tone="warning">needs evidence tie-out</StatusBadge>
            </header>
            <div className="document-line">
              <span>16</span>
              <p>
                The supplied trace establishes the same intermediate state used
                in the final conclusion.
              </p>
            </div>
            <div className="document-line is-selected">
              <span>18</span>
              <p>
                Therefore the proof result is accepted by the task criteria
                because trace row 42 matches the final answer.
              </p>
            </div>
            <div className="document-line">
              <span>19</span>
              <p>
                See trace.json row 42 and run.log line 61 for the submitted
                evidence.
              </p>
            </div>
          </article>

          <section className="review-panel evidence-panel">
            <div className="review-pane-heading">
              <p className="eyebrow">Evidence</p>
              <h2>Check the claim against the files</h2>
            </div>
            <div className="review-evidence-strip" aria-label="Evidence files">
              {reviewEvidence.map(([label, hash, detail]) => (
                <EvidenceCard
                  detail={detail}
                  hash={hash}
                  key={hash}
                  label={label}
                />
              ))}
            </div>
            <div className="claim-review-list">
              {reviewEvidenceComparisons.map((item) => (
                <article className="claim-review-row" key={item.artifact}>
                  <div>
                    <strong>{item.submitterClaim}</strong>
                    <span>{item.evidencePointer}</span>
                  </div>
                  <p>{item.reviewerRead}</p>
                  <StatusBadge tone={item.tone}>{item.state}</StatusBadge>
                </article>
              ))}
            </div>
          </section>

          <section className="review-panel replay-panel">
            <div className="review-pane-heading">
              <p className="eyebrow">Revision replay</p>
              <h2>Prior findings must be closed explicitly</h2>
            </div>
            <div className="replay-resolution-list">
              {reviewerClosureRows.map((finding) => (
                <article className="replay-resolution-row" key={finding.id}>
                  <div>
                    <code>{finding.id}</code>
                    <StatusBadge tone={finding.tone}>
                      {finding.closureAction}
                    </StatusBadge>
                  </div>
                  <strong>{finding.priorRequirement}</strong>
                  <span>{finding.submitterReplay}</span>
                </article>
              ))}
            </div>
          </section>
        </section>

        <aside className="review-decision-drawer">
          <div className="review-pane-heading">
            <p className="eyebrow">Decision</p>
            <h2>Decision requires cited evidence</h2>
          </div>
          <div
            className="decision-choice-list"
            aria-label="Review decision options"
          >
            {decisionOptions.map((option) => (
              <button
                aria-pressed={option.decision === "needs_revision"}
                className="decision-choice"
                key={option.decision}
                type="button"
              >
                <StatusBadge tone={option.tone}>{option.decision}</StatusBadge>
                <span>{option.detail}</span>
              </button>
            ))}
          </div>

          <div className="review-blocker-box">
            <AlertTriangle aria-hidden="true" size={16} />
            <div>
              <strong>Accept is blocked</strong>
              <span>
                run.log is cited, but it does not map trace row 42 to the final
                answer.
              </span>
            </div>
          </div>

          <div className="finding-composer" aria-label="Finding composer">
            <label>
              <span>Severity</span>
              <select defaultValue="high">
                <option>high</option>
                <option>medium</option>
                <option>low</option>
              </select>
            </label>
            <label>
              <span>Area</span>
              <select defaultValue="evidence">
                <option>evidence</option>
                <option>submission_summary</option>
                <option>guide_compliance</option>
                <option>revision_replay</option>
              </select>
            </label>
            <label>
              <span>Issue</span>
              <textarea
                defaultValue="run.log is cited, but the line does not map trace row 42 to the final answer."
                rows={3}
              />
            </label>
            <label>
              <span>Required fix</span>
              <textarea
                defaultValue="Add a direct evidence note that ties trace.json:42 to run.log:L61 and the final answer statement."
                rows={3}
              />
            </label>
          </div>

          <div className="draft-finding-list" aria-label="Draft findings">
            {reviewFindings.map((finding) => (
              <article className="draft-finding" key={finding.id}>
                <div>
                  <code>{finding.id}</code>
                  <StatusBadge tone={finding.tone}>
                    {finding.severity}
                  </StatusBadge>
                </div>
                <strong>{finding.area}</strong>
                <p>{finding.issue}</p>
              </article>
            ))}
          </div>

          <div className="decision-actions review-drawer-actions">
            <button className="command-button" type="button">
              <Ban aria-hidden="true" size={15} />
              Reject
            </button>
            <button className="command-button primary" type="button">
              <ClipboardCheck aria-hidden="true" size={15} />
              Send Revision
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function RevisionLoopScreen() {
  return (
    <div className="screen-stack revision-screen">
      <section className="screen-band revision-hero">
        <div className="band-heading">
          <p className="eyebrow">Needs revision loop</p>
          <h2>
            Turn reviewer findings into a new submission version without
            rewriting history
          </h2>
          <p>
            This screen covers the full revision path: the submitter receives
            structured findings, adds fix notes and evidence per finding,
            finalizes a new submission version, runs the checker gate again, and
            returns to review with prior-review stickiness.
          </p>
        </div>
        <div className="revision-metric-grid" aria-label="Revision loop state">
          {revisionMetrics.map((metric) => (
            <div className="revision-metric" key={metric.label}>
              <p className="eyebrow">{metric.label}</p>
              <strong>{metric.value}</strong>
              <span>{metric.detail}</span>
              <StatusBadge tone={metric.tone}>{metric.tone}</StatusBadge>
            </div>
          ))}
        </div>
      </section>

      <section className="revision-command-layout">
        <div className="screen-band revision-roster">
          <div className="queue-toolbar" aria-label="Revision controls">
            <label className="search-field">
              <Search aria-hidden="true" size={16} />
              <span className="visually-hidden">Search revisions</span>
              <input
                placeholder="task, finding, submitter, version"
                type="search"
              />
            </label>
            <div className="status-tabs" aria-label="Revision filters">
              {[
                ["needs_revision", "4", "warning"],
                ["ready_replay", "2", "success"],
                ["blocked", "3", "danger"],
                ["reviewable", "2", "info"],
              ].map(([label, count, tone]) => (
                <button key={label} type="button">
                  <StatusBadge tone={tone as Tone}>{label}</StatusBadge>
                  <span>{count}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="section-title-row">
            <div>
              <p className="eyebrow">Finding replay</p>
              <h2>Every required finding needs a specific fix and evidence</h2>
            </div>
            <StatusBadge tone="warning">
              accept blocked until closed
            </StatusBadge>
          </div>
          <DataTable
            className="revision-findings-table"
            columns={[
              "finding",
              "severity",
              "area",
              "required fix",
              "submitter replay",
              "reviewer closure",
            ]}
            rows={revisionFindingRows}
          />
        </div>

        <aside className="decision-panel revision-decision-panel">
          <p className="eyebrow">Resubmit boundary</p>
          <h2>A revised packet is a new version, not an edit</h2>
          <p>
            The submitter can prepare another packet only while the task remains
            needs_revision and the revision policy still allows another attempt.
          </p>
          <div className="decision-list">
            <DecisionRow
              decision="finding replay"
              detail="Blocking findings need fix notes and evidence before resubmit."
              tone="warning"
            />
            <DecisionRow
              decision="new version"
              detail="Finalize creates the next submission version linked to the prior one."
              tone="info"
            />
            <DecisionRow
              decision="review reroute"
              detail="Checker-passed revisions enter the review inbox with prior reviewer preference."
              tone="success"
            />
          </div>
          <div className="decision-actions">
            <button className="command-button" type="button">
              <Send aria-hidden="true" size={15} />
              Open Builder
            </button>
            <button className="command-button primary" type="button">
              <ShieldCheck aria-hidden="true" size={15} />
              Run Precheck
            </button>
          </div>
        </aside>
      </section>

      <section className="two-column revision-grid">
        <div className="screen-band">
          <div className="band-heading compact">
            <p className="eyebrow">Version chain</p>
            <h2>Prior submission and review links stay visible</h2>
          </div>
          <DataTable
            columns={[
              "task",
              "prior version",
              "next version",
              "prior review",
              "context",
              "state",
            ]}
            rows={revisionVersionRows}
          />
        </div>

        <div className="screen-band">
          <div className="band-heading compact">
            <p className="eyebrow">Replay requirements</p>
            <h2>Submitter and reviewer each have explicit closure work</h2>
          </div>
          <DataTable
            columns={[
              "step",
              "submitter work",
              "system proof",
              "reviewer result",
            ]}
            rows={revisionReplayRows}
          />
        </div>
      </section>

      <section className="two-column revision-grid">
        <div className="screen-band">
          <div className="band-heading compact">
            <p className="eyebrow">Review routing after resubmit</p>
            <h2>The revised packet returns through checker and Review Ops</h2>
          </div>
          <DataTable
            columns={["event", "state", "record", "operator meaning"]}
            rows={revisionRoutingRows}
          />
        </div>

        <div className="screen-band">
          <div className="band-heading compact">
            <p className="eyebrow">Blocked states</p>
            <h2>Revision must fail loudly when the loop is not allowed</h2>
          </div>
          <DataTable
            columns={["condition", "state", "reason"]}
            rows={revisionBlockedRows}
          />
        </div>
      </section>

      <section className="two-column revision-grid">
        <div className="screen-band">
          <div className="band-heading compact">
            <p className="eyebrow">Build readiness</p>
            <h2>Versioning is live; replay closure is designed next</h2>
          </div>
          <DataTable
            columns={["surface", "route / model", "status", "frontend use"]}
            rows={revisionContractRows}
          />
        </div>

        <div className="screen-band">
          <div className="band-heading compact">
            <p className="eyebrow">State guardrails</p>
            <h2>What the revision loop must make impossible to miss</h2>
          </div>
          <div className="decision-list">
            <DecisionRow
              decision="not overwrite"
              detail="Prior submissions, reviews, and findings stay immutable after v2 is created."
              tone="info"
            />
            <DecisionRow
              decision="not review"
              detail="Checker-caused needs_revision is not a human review decision."
              tone="warning"
            />
            <DecisionRow
              decision="not accepted"
              detail="Reviewer cannot accept while blocking replay findings remain open."
              tone="danger"
            />
            <DecisionRow
              decision="not payment"
              detail="Revision has no payment effect until a later accept creates a contribution record."
              tone="success"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function ReviewStatusTile({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: Tone;
}) {
  return (
    <div className="review-status-tile">
      <span className="eyebrow">{label}</span>
      <StatusBadge tone={tone}>{value}</StatusBadge>
    </div>
  );
}

function SetupStatusTile({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: Tone;
}) {
  return (
    <div className="setup-status-tile">
      <span className="eyebrow">{label}</span>
      <StatusBadge tone={tone}>{value}</StatusBadge>
    </div>
  );
}

function EvidenceCard({
  label,
  hash,
  detail,
}: {
  label: string;
  hash: string;
  detail: string;
}) {
  return (
    <article className="evidence-card">
      <div>
        <LockKeyhole aria-hidden="true" size={14} />
        <strong>{label}</strong>
      </div>
      <code>{hash}</code>
      <span>{detail}</span>
    </article>
  );
}

function SideEffect({
  icon: Icon,
  label,
}: {
  icon: LucideIcon;
  label: string;
}) {
  return (
    <div className="side-effect">
      <Icon aria-hidden="true" size={15} />
      <span>{label}</span>
    </div>
  );
}

function RecordsOpsScreen() {
  return (
    <div className="screen-stack records-screen">
      <section className="screen-band records-hero">
        <div className="band-heading">
          <p className="eyebrow">Contribution and payment records</p>
          <h2>Accepted reviews create contribution records immediately</h2>
          <p>
            Records Ops starts after human review. An accepted task creates the
            contribution record, triggers payment, and records submitter
            reputation. Payment movement comes back through external webhooks,
            while reject and reviewer lease events stay audit-only in v1.
          </p>
        </div>
        <div className="records-metric-grid" aria-label="Records state">
          {recordsMetrics.map((metric) => (
            <div className="records-metric" key={metric.label}>
              <p className="eyebrow">{metric.label}</p>
              <strong>{metric.value}</strong>
              <span>{metric.detail}</span>
              <StatusBadge tone={metric.tone}>{metric.tone}</StatusBadge>
            </div>
          ))}
        </div>
      </section>

      <section className="records-command-layout">
        <div className="screen-band records-roster">
          <div className="queue-toolbar" aria-label="Records filters">
            <label className="search-field">
              <Search aria-hidden="true" size={16} />
              <span className="visually-hidden">
                Search contribution records
              </span>
              <input
                placeholder="contribution, task, submitter, payment"
                type="search"
              />
            </label>
            <div className="status-tabs" aria-label="Payment status filters">
              {[
                ["pending", "2", "warning"],
                ["payment_submitted", "1", "info"],
                ["paid", "1", "success"],
              ].map(([label, count, tone]) => (
                <button key={label} type="button">
                  <StatusBadge tone={tone as Tone}>{label}</StatusBadge>
                  <span>{count}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="section-title-row">
            <div>
              <p className="eyebrow">Contribution records</p>
              <h2>Review acceptance is the contribution trigger</h2>
            </div>
            <StatusBadge tone="success">accept creates record</StatusBadge>
          </div>
          <DataTable
            columns={[
              "contribution / review",
              "task",
              "submitter",
              "amount",
              "payment",
              "reputation track",
            ]}
            rows={contributionRows}
          />
        </div>

        <aside className="decision-panel records-decision-panel">
          <p className="eyebrow">Payment boundary</p>
          <h2>Payment status is webhook-owned</h2>
          <p>
            Workstream triggers payment when the contribution record is created.
            After that, only the external payment webhook advances status to
            payment_submitted or paid.
          </p>
          <div className="decision-list">
            <DecisionRow
              decision="pending"
              detail="Contribution exists and payment has been triggered."
              tone="warning"
            />
            <DecisionRow
              decision="payment_submitted"
              detail="External provider accepted the payment request."
              tone="info"
            />
            <DecisionRow
              decision="paid"
              detail="External webhook returned a paid reference."
              tone="success"
            />
          </div>
        </aside>
      </section>

      <section className="two-column records-grid">
        <div className="screen-band">
          <div className="band-heading compact">
            <p className="eyebrow">Payment webhook spine</p>
            <h2>Only external payment events move money state</h2>
          </div>
          <DataTable
            columns={[
              "event",
              "source",
              "transition",
              "reference",
              "audit result",
            ]}
            rows={paymentWebhookRows}
          />
        </div>

        <div className="screen-band">
          <div className="band-heading compact">
            <p className="eyebrow">Reputation boundaries</p>
            <h2>Submitter work and reviewer work are separate signals</h2>
          </div>
          <DataTable
            columns={[
              "track",
              "event source",
              "record",
              "effect",
              "excluded impact",
            ]}
            rows={reputationRows}
          />
        </div>
      </section>

      <section className="two-column records-grid">
        <div className="screen-band">
          <div className="band-heading compact">
            <p className="eyebrow">Audit stream</p>
            <h2>Rejected work and lease events are audit-only in v1</h2>
          </div>
          <DataTable
            columns={["event", "entity", "actor", "outcome", "time"]}
            rows={recordsAuditRows}
          />
        </div>

        <div className="screen-band">
          <div className="band-heading compact">
            <p className="eyebrow">Build readiness</p>
            <h2>Ledger and webhook APIs can land behind this screen</h2>
          </div>
          <DataTable
            columns={["surface", "status", "frontend meaning"]}
            rows={recordsContractRows}
          />
        </div>
      </section>
    </div>
  );
}

function Metric({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <article className="metric">
      <p className="eyebrow">{label}</p>
      <strong>{value}</strong>
      <span>{detail}</span>
    </article>
  );
}

function RoleRow({ role, purpose }: { role: string; purpose: string }) {
  return (
    <div className="role-row">
      <UserCheck aria-hidden="true" size={16} />
      <code>{role}</code>
      <span>{purpose}</span>
    </div>
  );
}

function DecisionRow({
  decision,
  detail,
  tone,
}: {
  decision: string;
  detail: string;
  tone: Tone;
}) {
  return (
    <div className="decision-row">
      <StatusBadge tone={tone}>{decision}</StatusBadge>
      <span>{detail}</span>
    </div>
  );
}

function Field({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="field-row">
      <dt>{label}</dt>
      <dd className={mono ? "mono" : undefined}>{value}</dd>
    </div>
  );
}

function DataTable({
  columns,
  rows,
  className,
}: {
  columns: string[];
  rows: string[][];
  className?: string;
}) {
  return (
    <div className="table-wrap" tabIndex={0}>
      <table className={["data-table", className].filter(Boolean).join(" ")}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.join(":")}>
              {row.map((cell, index) => (
                <td
                  className={
                    isMachineValue(cell) || index === 0 ? "mono" : undefined
                  }
                  data-label={columns[index]}
                  key={`${cell}-${index}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatusBadge({ tone, children }: { tone: Tone; children: ReactNode }) {
  return (
    <span className={`status-badge status-badge--${tone}`}>{children}</span>
  );
}

function isMachineValue(value: string) {
  return (
    value.includes("sha256:") ||
    value.includes("_") ||
    /^([a-z]{1,4}-)?\d/.test(value) ||
    /^v\d+$/.test(value)
  );
}

function routeTone(route: string): Tone {
  if (route === "allow_review") {
    return "success";
  }
  if (route === "needs_revision" || route === "checker_retry") {
    return "warning";
  }
  if (route === "task_setup_blocked") {
    return "danger";
  }
  return "info";
}

export default App;
