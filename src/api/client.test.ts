import { expect, test } from "vitest";
import {
  createWorkstreamApiClient,
  resolveWorkstreamApiBaseUrl,
  toWorkstreamApiError,
} from "./client";
import { workstreamQueryKeys } from "./queries";

test("resolves the Workstream API base URL", () => {
  expect(resolveWorkstreamApiBaseUrl()).toBe("http://127.0.0.1:8000");
  expect(resolveWorkstreamApiBaseUrl("https://api.example.test/")).toBe(
    "https://api.example.test",
  );
});

test("adds JSON and bearer auth headers to generated API requests", async () => {
  let capturedRequest: Request | undefined;
  const client = createWorkstreamApiClient({
    baseUrl: "https://api.example.test/",
    getAccessToken: () => "flow-token",
    fetch: async (request) => {
      capturedRequest =
        request instanceof Request ? request : new Request(request);
      return new Response(JSON.stringify({ status: "ok" }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    },
  });

  const { data, error } = await client.GET("/api/v1/health");

  expect(error).toBeUndefined();
  expect(data?.status).toBe("ok");
  expect(capturedRequest?.url).toBe("https://api.example.test/api/v1/health");
  expect(capturedRequest?.headers.get("Accept")).toBe("application/json");
  expect(capturedRequest?.headers.get("Authorization")).toBe(
    "Bearer flow-token",
  );
});

test("does not double-prefix bearer tokens", async () => {
  let capturedRequest: Request | undefined;
  const client = createWorkstreamApiClient({
    baseUrl: "https://api.example.test",
    getAccessToken: () => "Bearer existing-token",
    fetch: async (request) => {
      capturedRequest =
        request instanceof Request ? request : new Request(request);
      return new Response(JSON.stringify({ status: "ok" }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    },
  });

  await client.GET("/api/v1/health");

  expect(capturedRequest?.headers.get("Authorization")).toBe(
    "Bearer existing-token",
  );
});

test("normalizes structured Workstream API errors", () => {
  const response = new Response("", {
    status: 422,
    statusText: "Unprocessable Entity",
  });

  expect(
    toWorkstreamApiError(
      {
        code: "pre_submission_checker_failed",
        details: { blocking_count: 2 },
      },
      response,
    ),
  ).toMatchObject({
    code: "pre_submission_checker_failed",
    details: { blocking_count: 2 },
    message: "pre_submission_checker_failed",
    status: 422,
  });
});

test("defines stable Workstream query keys", () => {
  expect(workstreamQueryKeys.currentActor()).toEqual([
    "workstream",
    "current-actor",
  ]);
  expect(workstreamQueryKeys.taskWorkContext("t-91c4")).toEqual([
    "workstream",
    "task",
    "t-91c4",
    "work-context",
  ]);
  expect(workstreamQueryKeys.submissionCheckerRuns("sub-1")).toEqual([
    "workstream",
    "submission",
    "sub-1",
    "checker-runs",
  ]);
});
