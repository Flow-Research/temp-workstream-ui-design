import createClient, { type Middleware } from "openapi-fetch";
import type { components, paths } from "./workstream.schema";

const DEFAULT_API_BASE_URL = "http://127.0.0.1:8000";

export type WorkstreamSchemas = components["schemas"];
export type WorkstreamApiClient = ReturnType<typeof createWorkstreamApiClient>;
export type WorkstreamAccessTokenProvider = () => string | null | undefined;

export interface WorkstreamApiClientOptions {
  baseUrl?: string;
  fetch?: typeof globalThis.fetch;
  getAccessToken?: WorkstreamAccessTokenProvider;
}

export interface WorkstreamApiError {
  status: number;
  statusText: string;
  message: string;
  code?: string;
  detail?: unknown;
  details?: unknown;
  raw: unknown;
}

export function resolveWorkstreamApiBaseUrl(baseUrl?: string) {
  const resolved = baseUrl?.trim() || DEFAULT_API_BASE_URL;
  return resolved.endsWith("/") ? resolved.slice(0, -1) : resolved;
}

export function createWorkstreamApiClient(
  options: WorkstreamApiClientOptions = {},
) {
  const client = createClient<paths>({
    baseUrl: resolveWorkstreamApiBaseUrl(
      options.baseUrl ?? import.meta.env.VITE_WORKSTREAM_API_URL,
    ),
    fetch: options.fetch,
  });

  client.use(createJsonHeadersMiddleware());

  if (options.getAccessToken) {
    client.use(createAuthMiddleware(options.getAccessToken));
  }

  return client;
}

export function toWorkstreamApiError(
  error: unknown,
  response: Response,
): WorkstreamApiError {
  const errorRecord = asRecord(error);
  const code = stringValue(errorRecord?.code);
  const detail = errorRecord?.detail;
  const details = errorRecord?.details;
  const message =
    stringValue(detail) ??
    stringValue(errorRecord?.message) ??
    code ??
    response.statusText ??
    "Workstream request failed";

  return {
    status: response.status,
    statusText: response.statusText,
    message,
    code,
    detail,
    details,
    raw: error,
  };
}

export const workstreamApi = createWorkstreamApiClient();

function createJsonHeadersMiddleware(): Middleware {
  return {
    onRequest({ request }) {
      const headers = new Headers(request.headers);
      if (!headers.has("Accept")) {
        headers.set("Accept", "application/json");
      }
      return new Request(request, { headers });
    },
  };
}

function createAuthMiddleware(
  getAccessToken: WorkstreamAccessTokenProvider,
): Middleware {
  return {
    onRequest({ request }) {
      const token = getAccessToken();
      if (!token) {
        return undefined;
      }

      const headers = new Headers(request.headers);
      headers.set(
        "Authorization",
        token.startsWith("Bearer ") ? token : `Bearer ${token}`,
      );
      return new Request(request, { headers });
    },
  };
}

function asRecord(value: unknown) {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : undefined;
}

function stringValue(value: unknown) {
  return typeof value === "string" && value.trim() ? value : undefined;
}
