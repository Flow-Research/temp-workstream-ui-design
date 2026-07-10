export type ApiDemoMode = "evidence" | "live";

export type ApiDemoIdState = {
  projectId: string;
  guideId: string;
  reportId: string;
  policyId: string;
  taskId: string;
  submissionId: string;
  checkerRunId: string;
};

export type ApiDrillStep = {
  id: string;
  step: string;
  phase: string;
  operation: string;
  method: "GET" | "POST" | "PATCH";
  path: string;
  actor: string;
  expected: string;
  summary: string;
};

export const apiDemoDefaultIds: ApiDemoIdState = {
  projectId: "paste-project-id",
  guideId: "paste-guide-id",
  reportId: "paste-report-id",
  policyId: "paste-policy-id",
  taskId: "paste-task-id",
  submissionId: "paste-submission-id",
  checkerRunId: "paste-checker-run-id",
};

export const apiDrillControls = [
  [
    "automatic setup pipeline",
    "queued -> running_sufficiency_agent -> running_policy_derivation_agent -> policy_draft_ready",
    "proves guide setup can be observed through HTTP",
  ],
  [
    "checker authority",
    "EffectiveProjectSubmissionArtifactPolicy -> project PreSubmitCheckerPolicy",
    "one project checker bundle is locked and reused by tasks",
  ],
  [
    "blocked intake",
    "pre_submission_checker_failed, no submission side effect",
    "checker feedback blocks packet creation before review exists",
  ],
  [
    "durable pre-review gate",
    "submission finalized -> checker run completed -> review_pending",
    "human review receives only checker-cleared submissions",
  ],
];

export const apiDrillReplayRows = [
  ["01", "ProjectGuide", "created", "guide v1 plus source snapshot"],
  ["02", "GuideSourceSnapshot", "locked", "source_snapshot_hash redacted"],
  ["03", "GuideSufficiencyReport", "passed", "agent status passed"],
  ["04", "SubmissionArtifactPolicy", "approved", "project manager approval"],
  [
    "05",
    "EffectiveProjectSubmissionArtifactPolicy",
    "compiled",
    "effective_policy_hash redacted",
  ],
  ["06", "PreSubmitCheckerPolicy", "locked", "compiled_bundle_hash redacted"],
  [
    "07",
    "Task",
    "released",
    "locked guide, policy, checker, review, revision, payment",
  ],
  [
    "08",
    "TaskAssignment",
    "in_progress",
    "submitter profile active and task started",
  ],
  [
    "09",
    "PreSubmitCheckResponse",
    "failed",
    "required artifact and required evidence missing",
  ],
  [
    "10",
    "Submission list",
    "empty",
    "blocked pre-submit created no submission",
  ],
  ["11", "PreSubmitCheckResponse", "passed", "eligible_to_submit true"],
  ["12", "Submission", "finalized", "submission version 1"],
  ["13", "CheckerRun", "completed", "routing_recommendation allow_review"],
  ["14", "Task", "review_pending", "ready for reviewer queue"],
];

export const apiDrillAuditRows = [
  ["task_created", "null", "draft"],
  ["task_status_changed", "draft", "screening"],
  ["task_status_changed", "screening", "ready"],
  ["task_status_changed", "ready", "claimed"],
  ["task_status_changed", "claimed", "in_progress"],
  ["pre_submission_check_failed", "in_progress", "in_progress"],
  ["submission_created", "in_progress", "submitted"],
  ["submission_finalized", "submitted", "submitted"],
  ["pre_review_gate_started", "submitted", "evaluation_pending"],
  ["pre_review_gate_passed", "evaluation_pending", "review_pending"],
];

export const apiDrillSteps: ApiDrillStep[] = [
  {
    id: "health",
    step: "00",
    phase: "connectivity",
    operation: "Check backend health",
    method: "GET",
    path: "/api/v1/health",
    actor: "none",
    expected: "200",
    summary:
      "Use this first to prove the backend is reachable from the browser.",
  },
  {
    id: "me",
    step: "00b",
    phase: "auth",
    operation: "Read current actor",
    method: "GET",
    path: "/api/v1/auth/me",
    actor: "Flow token actor",
    expected: "200",
    summary:
      "Confirms the bearer token is accepted and shows the role boundary.",
  },
  {
    id: "create-project",
    step: "01",
    phase: "setup",
    operation: "Create project",
    method: "POST",
    path: "/api/v1/projects",
    actor: "admin / project_manager",
    expected: "201",
    summary: "Creates the draft project shell.",
  },
  {
    id: "create-guide",
    step: "02",
    phase: "setup",
    operation: "Create guide with source snapshot and policies",
    method: "POST",
    path: "/api/v1/projects/{project_id}/guides",
    actor: "admin / project_manager",
    expected: "201",
    summary: "Starts the automatic setup pipeline from guide/source material.",
  },
  {
    id: "setup-run",
    step: "03",
    phase: "setup",
    operation: "Read latest setup run",
    method: "GET",
    path: "/api/v1/projects/{project_id}/guides/{guide_id}/setup-runs/latest",
    actor: "admin / project_manager",
    expected: "200",
    summary: "Poll until the setup run reaches policy_draft_ready.",
  },
  {
    id: "sufficiency-list",
    step: "04",
    phase: "setup",
    operation: "List sufficiency reports",
    method: "GET",
    path: "/api/v1/projects/{project_id}/guides/{guide_id}/sufficiency-reports",
    actor: "admin / project_manager",
    expected: "200",
    summary: "Shows the guide sufficiency agent output.",
  },
  {
    id: "sufficiency-get",
    step: "05",
    phase: "setup",
    operation: "Read sufficiency report",
    method: "GET",
    path: "/api/v1/projects/{project_id}/guides/{guide_id}/sufficiency-reports/{report_id}",
    actor: "admin / project_manager",
    expected: "200",
    summary:
      "Shows status, findings, source snapshot hash, and acknowledgement state.",
  },
  {
    id: "policy-list",
    step: "06",
    phase: "policy",
    operation: "List submission artifact policies",
    method: "GET",
    path: "/api/v1/projects/{project_id}/guides/{guide_id}/submission-artifact-policies",
    actor: "admin / project_manager",
    expected: "200",
    summary: "Finds the agent-derived or manually created policy record.",
  },
  {
    id: "policy-approve",
    step: "07",
    phase: "policy",
    operation: "Approve submission artifact policy",
    method: "POST",
    path: "/api/v1/projects/{project_id}/guides/{guide_id}/submission-artifact-policies/{policy_id}/approve",
    actor: "admin / project_manager",
    expected: "200",
    summary:
      "Approves the exact policy that will feed the effective policy and checker.",
  },
  {
    id: "effective-policy",
    step: "08",
    phase: "policy",
    operation: "Read effective submission artifact policy",
    method: "GET",
    path: "/api/v1/projects/{project_id}/guides/{guide_id}/effective-submission-artifact-policy",
    actor: "admin / project_manager",
    expected: "200",
    summary: "Shows the merged policy hash that tasks will lock.",
  },
  {
    id: "pre-submit-policy",
    step: "09",
    phase: "policy",
    operation: "Read project pre-submit checker policy",
    method: "GET",
    path: "/api/v1/projects/{project_id}/guides/{guide_id}/pre-submit-checker-policy",
    actor: "admin / project_manager",
    expected: "200",
    summary: "Shows checker names and compiled bundle hash.",
  },
  {
    id: "activate-guide",
    step: "10",
    phase: "setup",
    operation: "Activate guide",
    method: "POST",
    path: "/api/v1/projects/{project_id}/guides/{guide_id}/activate",
    actor: "admin / project_manager",
    expected: "200",
    summary:
      "Makes the guide and locked policy context available to new tasks.",
  },
  {
    id: "create-task",
    step: "11",
    phase: "task",
    operation: "Create task",
    method: "POST",
    path: "/api/v1/projects/{project_id}/tasks",
    actor: "admin / project_manager",
    expected: "201",
    summary: "Creates a draft task under the active project.",
  },
  {
    id: "screen-task",
    step: "12",
    phase: "task",
    operation: "Screen task and lock policy context",
    method: "POST",
    path: "/api/v1/tasks/{task_id}/screen",
    actor: "admin / project_manager",
    expected: "200",
    summary: "Moves the task through screening and stamps locked context.",
  },
  {
    id: "locked-context",
    step: "13",
    phase: "task",
    operation: "Read locked context",
    method: "GET",
    path: "/api/v1/tasks/{task_id}/locked-context",
    actor: "admin / project_manager",
    expected: "200",
    summary:
      "Shows guide source snapshot, policy hashes, checker hash, and review/revision/payment versions.",
  },
  {
    id: "release-task",
    step: "14",
    phase: "task",
    operation: "Release task",
    method: "POST",
    path: "/api/v1/tasks/{task_id}/release",
    actor: "admin / project_manager",
    expected: "200",
    summary: "Makes the locked task claimable by an eligible submitter.",
  },
  {
    id: "activate-profile",
    step: "15",
    phase: "submitter",
    operation: "Activate submitter profile",
    method: "POST",
    path: "/api/v1/workers/me/profile",
    actor: "contributor / submitter",
    expected: "200",
    summary:
      "Backend route still says workers; product UI should say submitter.",
  },
  {
    id: "claim-task",
    step: "16",
    phase: "submitter",
    operation: "Claim task",
    method: "POST",
    path: "/api/v1/tasks/{task_id}/claim",
    actor: "contributor / submitter",
    expected: "200",
    summary: "Creates or uses the active task assignment.",
  },
  {
    id: "start-task",
    step: "17",
    phase: "submitter",
    operation: "Start task",
    method: "POST",
    path: "/api/v1/tasks/{task_id}/start",
    actor: "contributor / submitter",
    expected: "200",
    summary: "Moves the task into in_progress.",
  },
  {
    id: "work-context",
    step: "18",
    phase: "submitter",
    operation: "Read submitter work context",
    method: "GET",
    path: "/api/v1/tasks/{task_id}/work-context",
    actor: "contributor / submitter",
    expected: "200",
    summary: "Shows worker-safe guide, project, task, and lifecycle context.",
  },
  {
    id: "submission-requirements",
    step: "19",
    phase: "submitter",
    operation: "Read submission requirements",
    method: "GET",
    path: "/api/v1/tasks/{task_id}/submission-requirements",
    actor: "contributor / submitter",
    expected: "200",
    summary:
      "Shows exact required artifacts, evidence, hashes, storage, and attestation terms.",
  },
  {
    id: "precheck-blocked",
    step: "20",
    phase: "pre-submit",
    operation: "Run intentionally blocked pre-submit check",
    method: "POST",
    path: "/api/v1/tasks/{task_id}/submission-precheck",
    actor: "contributor / submitter",
    expected: "200",
    summary: "Returns authoritative false, failed, eligible_to_submit false.",
  },
  {
    id: "create-blocked-submission",
    step: "21",
    phase: "pre-submit",
    operation: "Attempt blocked submission create",
    method: "POST",
    path: "/api/v1/tasks/{task_id}/submissions",
    actor: "contributor / submitter",
    expected: "422",
    summary: "Returns pre_submission_checker_failed and creates no submission.",
  },
  {
    id: "submissions-after-block",
    step: "22",
    phase: "pre-submit",
    operation: "Confirm no submission exists after blocked create",
    method: "GET",
    path: "/api/v1/tasks/{task_id}/submissions",
    actor: "contributor / submitter",
    expected: "200",
    summary: "Should remain empty after the failed create attempt.",
  },
  {
    id: "audit-after-block",
    step: "23",
    phase: "audit",
    operation: "Read audit trail after blocked create",
    method: "GET",
    path: "/api/v1/tasks/{task_id}/audit-events",
    actor: "admin / project_manager",
    expected: "200",
    summary: "Shows pre_submission_check_failed without submission_created.",
  },
  {
    id: "precheck-pass",
    step: "24",
    phase: "pre-submit",
    operation: "Run successful pre-submit check",
    method: "POST",
    path: "/api/v1/tasks/{task_id}/submission-precheck",
    actor: "contributor / submitter",
    expected: "200",
    summary: "Returns authoritative false, passed, eligible_to_submit true.",
  },
  {
    id: "create-submission",
    step: "25",
    phase: "submission",
    operation: "Create submission",
    method: "POST",
    path: "/api/v1/tasks/{task_id}/submissions",
    actor: "contributor / submitter",
    expected: "201",
    summary: "Creates submission version 1 after passing pre-submit.",
  },
  {
    id: "get-submission",
    step: "26",
    phase: "submission",
    operation: "Read submission",
    method: "GET",
    path: "/api/v1/submissions/{submission_id}",
    actor: "contributor / submitter",
    expected: "200",
    summary: "Shows the submitted packet and locked context copied onto it.",
  },
  {
    id: "finalize-submission",
    step: "27",
    phase: "submission",
    operation: "Finalize submission",
    method: "POST",
    path: "/api/v1/submissions/{submission_id}/finalize",
    actor: "admin / project_manager",
    expected: "200",
    summary: "Starts the durable pre-review gate.",
  },
  {
    id: "checker-runs",
    step: "28",
    phase: "checker",
    operation: "List checker runs for submission",
    method: "GET",
    path: "/api/v1/submissions/{submission_id}/checker-runs",
    actor: "admin / project_manager",
    expected: "200",
    summary: "Shows completed durable checker runs and routing recommendation.",
  },
  {
    id: "checker-run-detail",
    step: "29",
    phase: "checker",
    operation: "Read checker run details",
    method: "GET",
    path: "/api/v1/checker-runs/{checker_run_id}",
    actor: "admin / project_manager",
    expected: "200",
    summary: "Shows checker result details, counts, provenance, and status.",
  },
  {
    id: "final-audit",
    step: "30",
    phase: "audit",
    operation: "Read final audit trail",
    method: "GET",
    path: "/api/v1/tasks/{task_id}/audit-events",
    actor: "admin / project_manager",
    expected: "200",
    summary: "Confirms pre_review_gate_started and pre_review_gate_passed.",
  },
  {
    id: "final-task",
    step: "31",
    phase: "task",
    operation: "Read final task state",
    method: "GET",
    path: "/api/v1/tasks/{task_id}",
    actor: "admin / project_manager",
    expected: "200",
    summary: "Expected final state is review_pending.",
  },
];

const blockedSubmissionPacket = {
  summary: "Workbench packet intentionally missing static guard artifact.",
  package_uri: "local://workbench/submissions/blocked-packet.zip",
  package_hash: "sha256:blocked-workbench-packet",
  artifact_hash_manifest: [
    {
      artifact: "submission archive",
      hash: "sha256:archive-present",
      size_bytes: 2048,
      notes:
        "Workbench archive present; required static guard output intentionally omitted.",
    },
  ],
  worker_attestation:
    "I confirm this packet excludes secrets and local-only material, but it is intentionally incomplete for the blocked workbench check.",
  evidence_items: [
    {
      type: "note",
      label: "task configuration",
      uri: "local://workbench/evidence/task-configuration.txt",
      hash: "sha256:task-config-workbench",
      size_bytes: 512,
      metadata: { workbench: true },
    },
  ],
};

const passingSubmissionPacket = {
  summary:
    "Workbench packet with required artifacts, evidence, hashes, and attestation.",
  package_uri: "local://workbench/submissions/passing-packet.zip",
  package_hash: "sha256:passing-workbench-packet",
  artifact_hash_manifest: [
    {
      artifact: "submission archive",
      hash: "sha256:archive-present",
      size_bytes: 2048,
      notes: "Main submission archive.",
    },
    {
      artifact: "static guard output",
      hash: "sha256:static-guard-present",
      size_bytes: 1024,
      notes: "Required checker evidence artifact.",
    },
    {
      artifact: "review packet",
      hash: "sha256:review-packet-present",
      size_bytes: 1536,
      notes: "Reviewer-facing packet.",
    },
  ],
  worker_attestation:
    "I confirm this packet excludes secrets, includes required evidence, pins dependencies, and remains under human accountability.",
  evidence_items: [
    {
      type: "note",
      label: "task configuration",
      uri: "local://workbench/evidence/task-configuration.txt",
      hash: "sha256:task-config-workbench",
      size_bytes: 512,
      metadata: { workbench: true },
    },
    {
      type: "log",
      label: "platform static guard output",
      uri: "local://workbench/evidence/static-guard.log",
      hash: "sha256:static-guard-present",
      size_bytes: 1024,
      metadata: { checker: "static_guard" },
    },
    {
      type: "test_result",
      label: "verifier execution log A",
      uri: "local://workbench/evidence/verifier-a.log",
      hash: "sha256:verifier-a",
      size_bytes: 1024,
      metadata: { verifier: "A" },
    },
  ],
};

export function getApiDrillRequestBody(stepId: string) {
  switch (stepId) {
    case "create-project": {
      const suffix = Date.now().toString(36);
      return {
        name: "Workbench Project",
        slug: `workbench-project-${suffix}`,
        description:
          "Project created from the Workstream API workbench. Replace this with the real project description for the run.",
      };
    }
    case "create-guide":
      return {
        version: "v1",
        content_markdown:
          "# Workbench Guide\n\nSubmitter packets must include a manifest, required artifacts, evidence logs, SHA-256 hashes, and human accountability attestation.",
        change_summary: "Initial workbench guide.",
        source_snapshot: {
          items: [
            {
              source_kind: "project_guide",
              durable_ref: "public-fixture://workbench/source-item-1",
              ingestion_adapter: "manual",
              content_hash: "sha256:workbench-guide-source",
              media_type: "text/markdown",
              content_excerpt:
                "Privacy-safe guide source. Replace with the actual project material for the run.",
            },
            {
              source_kind: "checker_evidence",
              durable_ref: "public-fixture://workbench/source-item-2",
              ingestion_adapter: "manual",
              content_hash: "sha256:workbench-checker-evidence",
              media_type: "text/plain",
              content_excerpt:
                "Static guard and verifier evidence are required for accepted packets.",
            },
          ],
        },
        review_policy: {
          requires_second_review: false,
          allowed_decisions: ["accept", "needs_revision", "reject"],
          minimum_finding_fields: ["description", "severity", "evidence_ref"],
          sla_hours: 24,
        },
        revision_policy: {
          max_revision_rounds: 2,
          revision_deadline_hours: 48,
          auto_reject_after_limit: true,
          allowed_resubmission_states: ["needs_revision"],
          reviewer_reassignment_rule: "prefer_previous_reviewer",
        },
        payment_policy: {
          base_amount: "25.00",
          currency: "USD",
          payout_type: "fixed",
          revision_payment_rule: "no_extra_payment_until_accept",
          rejection_payment_rule: "no_payment",
          accepted_payment_rule: "create_contribution_record_pending_payment",
        },
      };
    case "policy-approve":
      return {
        approval_note:
          "Approved from the API workbench. Replace with the exact policy approval note for the run.",
      };
    case "create-task":
      return {
        title: "Workbench Task",
        description:
          "Prepare a privacy-safe submission packet with required artifacts, evidence, hashes, and attestation.",
        task_type: "submission_packet",
        difficulty: "medium",
        skill_tags: ["workbench", "submission", "checker"],
        estimated_time_minutes: 45,
        source_type: "manual",
        source_ref: "public-fixture://workbench/task-1",
        source_payload_hash: "sha256:workbench-task-source",
        acceptance_criteria:
          "Packet includes archive, static guard output, review packet, evidence logs, SHA-256 hashes, and attestation.",
        rejection_criteria:
          "Missing required artifact, missing required evidence, unsafe storage reference, or weak attestation.",
      };
    case "screen-task":
    case "release-task":
    case "claim-task":
    case "start-task":
      return {
        reason: "API workbench lifecycle step.",
      };
    case "activate-profile":
      return {
        skill_tags: ["workbench", "submission-packet", "checker-evidence"],
      };
    case "precheck-blocked":
      return {
        submission: blockedSubmissionPacket,
      };
    case "create-blocked-submission":
      return blockedSubmissionPacket;
    case "precheck-pass":
      return {
        submission: passingSubmissionPacket,
      };
    case "create-submission":
      return passingSubmissionPacket;
    case "finalize-submission":
      return null;
    default:
      return null;
  }
}

export function formatApiDrillRequestBody(stepId: string) {
  const body = getApiDrillRequestBody(stepId);
  return body === null ? "" : JSON.stringify(body, null, 2);
}

export function resolveApiDemoPath(path: string, ids: ApiDemoIdState) {
  return path
    .replaceAll("{project_id}", encodeURIComponent(ids.projectId))
    .replaceAll("{guide_id}", encodeURIComponent(ids.guideId))
    .replaceAll("{report_id}", encodeURIComponent(ids.reportId))
    .replaceAll("{policy_id}", encodeURIComponent(ids.policyId))
    .replaceAll("{task_id}", encodeURIComponent(ids.taskId))
    .replaceAll("{submission_id}", encodeURIComponent(ids.submissionId))
    .replaceAll("{checker_run_id}", encodeURIComponent(ids.checkerRunId));
}
