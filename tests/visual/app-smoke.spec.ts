import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("admin dashboard supports light and dark themes without overflow or accessibility violations", async ({
  page,
}) => {
  test.setTimeout(240_000);
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page.locator("#root")).toBeVisible();
  await expect(page.getByText("Admin command center")).toBeVisible();
  await expect(
    page.getByText("Admin work ordered by lifecycle risk"),
  ).toBeVisible();
  await expectNoHorizontalOverflow(page);
  await expectNoA11yViolations(page);

  await page.getByRole("button", { name: "Switch to dark theme" }).click();
  await expect(page.locator(".studio-shell")).toHaveAttribute(
    "data-theme",
    "dark",
  );
  await expectNoHorizontalOverflow(page);
  await expectNoA11yViolations(page);
});

test("people access screen renders without overflow or accessibility violations", async ({
  page,
}) => {
  test.setTimeout(240_000);
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page.locator("#root")).toBeVisible();
  await page.getByRole("button", { name: "Switch to dark theme" }).click();

  await page.getByRole("button", { name: "People & Access" }).click();
  await expect(
    page.getByRole("heading", { exact: true, name: "People & Access" }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "Access roster follows token roles, profile state, and scoped capability gaps",
    ),
  ).toBeVisible();
  await expectNoHorizontalOverflow(page);
  await expectNoA11yViolations(page);
});

test("product map screen renders without overflow or accessibility violations", async ({
  page,
}) => {
  test.setTimeout(240_000);
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page.locator("#root")).toBeVisible();
  await page.getByRole("button", { name: "Switch to dark theme" }).click();
  await page.getByRole("button", { name: "Product Map" }).click();
  await expect(
    page.getByRole("heading", { exact: true, name: "Product Map" }),
  ).toBeVisible();
  await expect(
    page.getByText("Run one project from guide setup to paid contribution"),
  ).toBeVisible();
  await expectNoHorizontalOverflow(page);
  await expectNoA11yViolations(page);
});

test("API workbench screen renders without overflow or accessibility violations", async ({
  page,
}) => {
  test.setTimeout(240_000);
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page.locator("#root")).toBeVisible();
  await page.getByRole("button", { name: "Switch to dark theme" }).click();
  await page.getByRole("button", { name: "API Workbench" }).click();
  await expect(
    page.getByRole("heading", { exact: true, name: "API Workbench" }),
  ).toBeVisible();
  await expect(
    page.getByText("Input, submit, and inspect Workstream backend data"),
  ).toBeVisible();
  await expect(
    page.getByText("Select the real operation you want to run"),
  ).toBeVisible();
  await expectNoHorizontalOverflow(page);
  await expectNoA11yViolations(page);
});

test("setup screen renders without overflow or accessibility violations", async ({
  page,
}) => {
  test.setTimeout(240_000);
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page.locator("#root")).toBeVisible();
  await page.getByRole("button", { name: "Switch to dark theme" }).click();
  await page.getByRole("button", { name: "Project Setup" }).click();
  await expect(
    page.getByRole("heading", { exact: true, name: "Project Setup" }),
  ).toBeVisible();
  await expect(page.getByText("Setup run is policy_draft_ready")).toBeVisible();
  await expectNoHorizontalOverflow(page);
  await expectNoA11yViolations(page);
});

test("task queue release console renders without overflow or accessibility violations", async ({
  page,
}) => {
  test.setTimeout(240_000);
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page.locator("#root")).toBeVisible();
  await page.getByRole("button", { name: "Switch to dark theme" }).click();
  await page.getByRole("button", { name: "Task Queue" }).click();
  await expect(
    page.getByRole("heading", { exact: true, name: "Task Queue" }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "Release tasks only after guide, policy, checker, and payout context are locked",
    ),
  ).toBeVisible();
  await expectNoHorizontalOverflow(page);
  await expectNoA11yViolations(page);
});

test("contributor dashboard renders without overflow or accessibility violations", async ({
  page,
}) => {
  test.setTimeout(240_000);
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page.locator("#root")).toBeVisible();
  await page.getByRole("button", { name: "Switch to dark theme" }).click();
  await page.getByRole("button", { name: "Contributor Dashboard" }).click();
  await expect(
    page.getByRole("heading", {
      exact: true,
      name: "Contributor Dashboard",
    }),
  ).toBeVisible();
  await expect(
    page.getByText("One dashboard for submitter work and reviewer privileges"),
  ).toBeVisible();
  await expectNoHorizontalOverflow(page);
  await expectNoA11yViolations(page);
});

test("submitter workspace renders without overflow or accessibility violations", async ({
  page,
}) => {
  test.setTimeout(240_000);
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page.locator("#root")).toBeVisible();
  await page.getByRole("button", { name: "Switch to dark theme" }).click();
  await page.getByRole("button", { name: "Submitter Workspace" }).click();
  await expect(
    page.getByRole("heading", { exact: true, name: "Submitter Workspace" }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "Build a submission packet against the locked task contract",
    ),
  ).toBeVisible();
  await expectNoHorizontalOverflow(page);
  await expectNoA11yViolations(page);
});

test("checks monitor renders without overflow or accessibility violations", async ({
  page,
}) => {
  test.setTimeout(240_000);
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page.locator("#root")).toBeVisible();
  await page.getByRole("button", { name: "Switch to dark theme" }).click();
  await page.getByRole("button", { name: "Checks Monitor" }).click();
  await expect(
    page.getByRole("heading", { exact: true, name: "Checks Monitor" }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "Separate pre-submit feedback, durable checker runs, and review routing",
    ),
  ).toBeVisible();
  await expectNoHorizontalOverflow(page);
  await expectNoA11yViolations(page);
});

test("review ops screen renders without overflow or accessibility violations", async ({
  page,
}) => {
  test.setTimeout(240_000);
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page.locator("#root")).toBeVisible();
  await page.getByRole("button", { name: "Switch to dark theme" }).click();
  await page.getByRole("button", { name: "Review Ops" }).click();
  await expect(
    page.getByRole("heading", { exact: true, name: "Review Ops" }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "Keep reviewer routing moving without losing evidence or authority",
    ),
  ).toBeVisible();
  await expectNoHorizontalOverflow(page);
  await expectNoA11yViolations(page);
});

test("records ops screen renders without overflow or accessibility violations", async ({
  page,
}) => {
  test.setTimeout(240_000);
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page.locator("#root")).toBeVisible();
  await page.getByRole("button", { name: "Switch to dark theme" }).click();
  await page.getByRole("button", { name: "Records Ops" }).click();
  await expect(
    page.getByRole("heading", { exact: true, name: "Records Ops" }),
  ).toBeVisible();
  await expect(
    page.getByText("Accepted reviews create contribution records immediately"),
  ).toBeVisible();
  await expectNoHorizontalOverflow(page);
  await expectNoA11yViolations(page);
});

test("revision loop screen renders without overflow or accessibility violations", async ({
  page,
}) => {
  test.setTimeout(240_000);
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page.locator("#root")).toBeVisible();
  await page.getByRole("button", { name: "Switch to dark theme" }).click();
  await page.getByRole("button", { name: "Revision Loop" }).click();
  await expect(
    page.getByRole("heading", { exact: true, name: "Revision Loop" }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "Turn reviewer findings into a new submission version without rewriting history",
    ),
  ).toBeVisible();
  await expectNoHorizontalOverflow(page);
  await expectNoA11yViolations(page);
});

test("review screen renders without overflow or accessibility violations", async ({
  page,
}) => {
  test.setTimeout(240_000);
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page.locator("#root")).toBeVisible();
  await page.getByRole("button", { name: "Switch to dark theme" }).click();
  await page.getByRole("button", { name: "Review Workspace" }).click();
  await expect(
    page.getByRole("heading", { name: "Review Workspace" }),
  ).toBeVisible();
  await expect(
    page.getByText("Decision requires cited evidence"),
  ).toBeVisible();
  await expectNoHorizontalOverflow(page);
  await expectNoA11yViolations(page);
});

async function expectNoHorizontalOverflow(page: Page) {
  const hasHorizontalOverflow = await page.evaluate(() => {
    return (
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth
    );
  });
  expect(hasHorizontalOverflow).toBe(false);
}

async function expectNoA11yViolations(page: Page) {
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  expect(accessibilityScanResults.violations).toEqual([]);
}
