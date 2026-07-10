import { createHmac } from "node:crypto";

const issuer =
  process.env.WORKSTREAM_FLOW_AUTH_ISSUER ??
  process.env.WORKSTREAM_E2E_FLOW_ISSUER ??
  "https://auth.flow.local/e2e";
const audience =
  process.env.WORKSTREAM_FLOW_AUTH_AUDIENCE ??
  process.env.WORKSTREAM_E2E_FLOW_AUDIENCE ??
  "workstream-api";
const secret =
  process.env.WORKSTREAM_FLOW_AUTH_LOCAL_HMAC_SECRET ??
  process.env.WORKSTREAM_E2E_FLOW_SECRET ??
  "local-flow-workbench-secret";

function base64url(value) {
  return Buffer.from(value).toString("base64url");
}

function base64urlJson(value) {
  return base64url(JSON.stringify(value));
}

function issueToken(subject, roles) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64urlJson({ alg: "HS256", typ: "JWT" });
  const payload = base64urlJson({
    aud: audience,
    email: `${subject}@flow.local`,
    exp: now + 8 * 60 * 60,
    iat: now,
    iss: issuer,
    name: subject
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" "),
    nbf: now - 5,
    roles,
    sub: subject,
  });
  const signed = `${header}.${payload}`;
  const signature = createHmac("sha256", secret)
    .update(signed)
    .digest("base64url");
  return `${signed}.${signature}`;
}

const tokens = {
  audience,
  backend_env: {
    WORKSTREAM_AUTH_PROVIDER: "flow",
    WORKSTREAM_FLOW_AUTH_AUDIENCE: audience,
    WORKSTREAM_FLOW_AUTH_ISSUER: issuer,
    WORKSTREAM_FLOW_AUTH_LOCAL_HMAC_SECRET: secret,
  },
  issuer,
  operator_token: issueToken("workbench-project-manager", ["project_manager"]),
  submitter_token: issueToken("workbench-submitter", ["worker"]),
};

console.log(JSON.stringify(tokens, null, 2));
