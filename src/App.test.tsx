import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import App from "./App";

test("renders the coded design studio", () => {
  render(<App />);
  expect(screen.getAllByText("Admin Dashboard")[0]).toBeVisible();
  expect(screen.getAllByText("People & Access")[0]).toBeVisible();
  expect(screen.getAllByText("Product Map")[0]).toBeVisible();
  expect(screen.getByText("Contributor Dashboard")).toBeVisible();
  expect(screen.getByText("Submitter Workspace")).toBeVisible();
  expect(screen.getByText("Checks Monitor")).toBeVisible();
  expect(screen.getByText("Review Ops")).toBeVisible();
  expect(screen.getByText("Review Workspace")).toBeVisible();
  expect(screen.getByText("Revision Loop")).toBeVisible();
  expect(screen.getByText("Records Ops")).toBeVisible();
  expect(screen.getByText("Admin command center")).toBeVisible();
  expect(
    screen.getByText("Admin work ordered by lifecycle risk"),
  ).toBeVisible();
}, 20_000);

test("renders the contributor dashboard", () => {
  render(<App />);
  fireEvent.click(
    screen.getByRole("button", { name: "Contributor Dashboard" }),
  );
  expect(
    screen.getByText(
      "One dashboard for submitter work and reviewer privileges",
    ),
  ).toBeVisible();
  expect(screen.getByText("Work that needs contributor action")).toBeVisible();
  expect(
    screen.getByText("Revision is the next submitter action"),
  ).toBeVisible();
  expect(
    screen.getByText("Grants, payments, and signals stay separate"),
  ).toBeVisible();
}, 20_000);

test("renders the people and capabilities admin screen", () => {
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: "People & Access" }));
  expect(
    screen.getByText(
      "Access roster follows token roles, profile state, and scoped capability gaps",
    ),
  ).toBeVisible();
  expect(
    screen.getByText("Contributor and admin scopes stay explicit"),
  ).toBeVisible();
  expect(
    screen.getByText(
      "Live identity paths and planned access tools stay separated",
    ),
  ).toBeVisible();
  expect(screen.getByText("WorkstreamRoleAssignment")).toBeVisible();
}, 20_000);

test("renders the product handoff map", () => {
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: "Product Map" }));
  expect(
    screen.getByText("Run one project from guide setup to paid contribution"),
  ).toBeVisible();
  expect(screen.getAllByText("submitter")[0]).toBeVisible();
  expect(screen.getByText("audit_manager")).toBeVisible();
  expect(
    screen.getByText("What the frontend team should build from this studio"),
  ).toBeVisible();
  expect(screen.queryByText(/Claude ZIP/i)).toBeNull();
}, 20_000);

test("renders the task release console", () => {
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: "Task Queue" }));
  expect(
    screen.getByText(
      "Release tasks only after guide, policy, checker, and payout context are locked",
    ),
  ).toBeVisible();
  expect(
    screen.getByText("Comparison table first, release decision second"),
  ).toBeVisible();
  expect(
    screen.getByText(
      "Submitter and reviewer are both contributor capabilities",
    ),
  ).toBeVisible();
}, 20_000);

test("renders the submitter workspace", () => {
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: "Submitter Workspace" }));
  expect(
    screen.getByText(
      "Build a submission packet against the locked task contract",
    ),
  ).toBeVisible();
  expect(
    screen.getByText("Revision findings are packet requirements now"),
  ).toBeVisible();
  expect(
    screen.getByText("Finalize creates SubmissionVersion v2"),
  ).toBeVisible();
}, 20_000);

test("renders the submission checks monitor", () => {
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: "Checks Monitor" }));
  expect(
    screen.getByText(
      "Separate pre-submit feedback, durable checker runs, and review routing",
    ),
  ).toBeVisible();
  expect(
    screen.getByText("Current submission versions and routing recommendations"),
  ).toBeVisible();
  expect(
    screen.getByText("Checker recommendations are not human review decisions"),
  ).toBeVisible();
}, 20_000);

test("renders the review operations lifecycle screen", () => {
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: "Review Ops" }));
  expect(
    screen.getByText(
      "Keep reviewer routing moving without losing evidence or authority",
    ),
  ).toBeVisible();
  expect(
    screen.getByText("Submissions waiting for claim, release, or decision"),
  ).toBeVisible();
  expect(
    screen.getByText(
      "Reject closes the task and bans that contributor assignment",
    ),
  ).toBeVisible();
}, 20_000);

test("renders the revision loop screen", () => {
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: "Revision Loop" }));
  expect(
    screen.getByText(
      "Turn reviewer findings into a new submission version without rewriting history",
    ),
  ).toBeVisible();
  expect(
    screen.getByText(
      "Every required finding needs a specific fix and evidence",
    ),
  ).toBeVisible();
  expect(
    screen.getByText("Versioning is live; replay closure is designed next"),
  ).toBeVisible();
}, 20_000);

test("renders the records operations screen", () => {
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: "Records Ops" }));
  expect(
    screen.getByText(
      "Accepted reviews create contribution records immediately",
    ),
  ).toBeVisible();
  expect(screen.getByText("Payment status is webhook-owned")).toBeVisible();
  expect(
    screen.getByText("Submitter work and reviewer work are separate signals"),
  ).toBeVisible();
  expect(screen.getAllByText("payment_submitted")[0]).toBeVisible();
}, 20_000);

test("switches between light and dark themes", () => {
  render(<App />);
  const shell = document.querySelector(".studio-shell");
  expect(shell?.getAttribute("data-theme")).toBe("light");

  fireEvent.click(screen.getByRole("button", { name: "Switch to dark theme" }));
  expect(shell?.getAttribute("data-theme")).toBe("dark");
  expect(
    screen.getByRole("button", { name: "Switch to light theme" }),
  ).toBeVisible();

  fireEvent.click(
    screen.getByRole("button", { name: "Switch to light theme" }),
  );
  expect(shell?.getAttribute("data-theme")).toBe("light");
}, 20_000);

test("renders the project setup pipeline", () => {
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: "Project Setup" }));
  expect(screen.getByText("Setup run is policy_draft_ready")).toBeVisible();
  expect(
    screen.getByText("Every activation dependency has an API surface"),
  ).toBeVisible();
  expect(
    screen.getByText("One project-scoped checker bundle reused by tasks"),
  ).toBeVisible();
}, 20_000);

test("renders the review workspace flow", () => {
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: "Review Workspace" }));
  expect(
    screen.getByText("Proof evaluation: trace-to-answer check"),
  ).toBeVisible();
  expect(screen.getByText("Reviews to finish")).toBeVisible();
  expect(screen.getByText("Decision requires cited evidence")).toBeVisible();
  expect(
    screen.getByText("Prior findings must be closed explicitly"),
  ).toBeVisible();
}, 20_000);
