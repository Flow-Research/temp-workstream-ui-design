import { queryOptions } from "@tanstack/react-query";
import { toWorkstreamApiError, workstreamApi } from "./client";

export const workstreamQueryKeys = {
  all: ["workstream"] as const,
  health: () => [...workstreamQueryKeys.all, "health"] as const,
  currentActor: () => [...workstreamQueryKeys.all, "current-actor"] as const,
  project: (projectId: string) =>
    [...workstreamQueryKeys.all, "project", projectId] as const,
  task: (taskId: string) =>
    [...workstreamQueryKeys.all, "task", taskId] as const,
  taskWorkContext: (taskId: string) =>
    [...workstreamQueryKeys.task(taskId), "work-context"] as const,
  taskSubmissionRequirements: (taskId: string) =>
    [...workstreamQueryKeys.task(taskId), "submission-requirements"] as const,
  submissionCheckerRuns: (submissionId: string) =>
    [
      ...workstreamQueryKeys.all,
      "submission",
      submissionId,
      "checker-runs",
    ] as const,
};

export function healthQueryOptions() {
  return queryOptions({
    queryKey: workstreamQueryKeys.health(),
    queryFn: async () => {
      const { data, error, response } =
        await workstreamApi.GET("/api/v1/health");
      if (error) {
        throw toWorkstreamApiError(error, response);
      }
      return data;
    },
  });
}

export function currentActorQueryOptions() {
  return queryOptions({
    queryKey: workstreamQueryKeys.currentActor(),
    queryFn: async () => {
      const { data, error, response } =
        await workstreamApi.GET("/api/v1/auth/me");
      if (error) {
        throw toWorkstreamApiError(error, response);
      }
      return data;
    },
  });
}

export function projectQueryOptions(projectId: string) {
  return queryOptions({
    queryKey: workstreamQueryKeys.project(projectId),
    queryFn: async () => {
      const { data, error, response } = await workstreamApi.GET(
        "/api/v1/projects/{project_id}",
        {
          params: {
            path: { project_id: projectId },
          },
        },
      );
      if (error) {
        throw toWorkstreamApiError(error, response);
      }
      return data;
    },
  });
}

export function taskQueryOptions(taskId: string) {
  return queryOptions({
    queryKey: workstreamQueryKeys.task(taskId),
    queryFn: async () => {
      const { data, error, response } = await workstreamApi.GET(
        "/api/v1/tasks/{task_id}",
        {
          params: {
            path: { task_id: taskId },
          },
        },
      );
      if (error) {
        throw toWorkstreamApiError(error, response);
      }
      return data;
    },
  });
}

export function taskWorkContextQueryOptions(taskId: string) {
  return queryOptions({
    queryKey: workstreamQueryKeys.taskWorkContext(taskId),
    queryFn: async () => {
      const { data, error, response } = await workstreamApi.GET(
        "/api/v1/tasks/{task_id}/work-context",
        {
          params: {
            path: { task_id: taskId },
          },
        },
      );
      if (error) {
        throw toWorkstreamApiError(error, response);
      }
      return data;
    },
  });
}

export function taskSubmissionRequirementsQueryOptions(taskId: string) {
  return queryOptions({
    queryKey: workstreamQueryKeys.taskSubmissionRequirements(taskId),
    queryFn: async () => {
      const { data, error, response } = await workstreamApi.GET(
        "/api/v1/tasks/{task_id}/submission-requirements",
        {
          params: {
            path: { task_id: taskId },
          },
        },
      );
      if (error) {
        throw toWorkstreamApiError(error, response);
      }
      return data;
    },
  });
}

export function submissionCheckerRunsQueryOptions(submissionId: string) {
  return queryOptions({
    queryKey: workstreamQueryKeys.submissionCheckerRuns(submissionId),
    queryFn: async () => {
      const { data, error, response } = await workstreamApi.GET(
        "/api/v1/submissions/{submission_id}/checker-runs",
        {
          params: {
            path: { submission_id: submissionId },
          },
        },
      );
      if (error) {
        throw toWorkstreamApiError(error, response);
      }
      return data;
    },
  });
}
