import { test, expect } from "@playwright/test";

const SAMPLE_JD = `Senior Frontend Engineer - Stripe

About the role:
We're looking for a Senior Frontend Engineer to join our Payments team. You'll build and maintain the dashboard experiences that millions of businesses use to manage their payments.

Requirements:
- 5+ years of experience with React and TypeScript
- Experience with large-scale web applications
- Strong understanding of web performance optimization
- Experience with design systems and component libraries
- Familiarity with payment systems or fintech is a plus

Responsibilities:
- Build and maintain payment dashboard features
- Collaborate with designers and PMs to ship user-facing products
- Improve frontend infrastructure and developer experience
- Mentor junior engineers

Location: San Francisco or Remote (US)
Compensation: $180K - $250K + equity`;

test.describe("Interview Research Agent", () => {
  test("landing page renders correctly", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: /interview research agent/i })).toBeVisible();
    await expect(page.getByPlaceholder(/paste a job description/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /research this company/i })).toBeVisible();

    // Example chips should be visible
    await expect(page.getByRole("button", { name: /senior frontend engineer/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /product manager/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /data scientist/i })).toBeVisible();
  });

  test("submit button is disabled when textarea is empty", async ({ page }) => {
    await page.goto("/");

    const submitButton = page.getByRole("button", { name: /research this company/i });
    await expect(submitButton).toBeDisabled();
  });

  test("example chip populates the textarea", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: /senior frontend engineer/i }).click();

    const textarea = page.getByPlaceholder(/paste a job description/i);
    await expect(textarea).not.toBeEmpty();
    await expect(textarea).toContainText("Stripe");

    // Submit button should now be enabled
    await expect(page.getByRole("button", { name: /research this company/i })).toBeEnabled();
  });

  test("full research flow completes and renders all sections", async ({ page }) => {
    await page.goto("/");

    // Paste job description
    const textarea = page.getByPlaceholder(/paste a job description/i);
    await textarea.fill(SAMPLE_JD);

    // Click research
    await page.getByRole("button", { name: /research this company/i }).click();

    // Progress tracker should appear
    await expect(page.getByText(/research progress/i)).toBeVisible({ timeout: 10_000 });

    // Wait for the report sections to appear (these come in as SSE events)
    // Job Analysis section (from parsed JD — should be first)
    await expect(page.getByText("Job Analysis")).toBeVisible({ timeout: 30_000 });

    // Company Overview
    await expect(page.getByText("Company Overview")).toBeVisible({ timeout: 30_000 });

    // Recent News
    await expect(page.getByText("Recent News")).toBeVisible({ timeout: 30_000 });

    // Funding & Financials
    await expect(page.getByText("Funding & Financials")).toBeVisible({ timeout: 30_000 });

    // Key People
    await expect(page.getByText("Key People")).toBeVisible({ timeout: 45_000 });

    // Product & Tech Stack
    await expect(page.getByText("Product & Tech Stack")).toBeVisible({ timeout: 45_000 });

    // Culture & Sentiment
    await expect(page.getByText("Culture & Sentiment")).toBeVisible({ timeout: 45_000 });

    // Interview Preparation (last section — depends on all prior data)
    await expect(page.getByText("Interview Preparation")).toBeVisible({ timeout: 60_000 });

    // Action buttons should appear after completion
    await expect(page.getByRole("button", { name: /copy as markdown/i })).toBeVisible({ timeout: 60_000 });
    await expect(page.getByRole("button", { name: /new research/i })).toBeVisible();
  });

  test("new research button resets the form", async ({ page }) => {
    await page.goto("/");

    // Run a quick research
    const textarea = page.getByPlaceholder(/paste a job description/i);
    await textarea.fill(SAMPLE_JD);
    await page.getByRole("button", { name: /research this company/i }).click();

    // Wait for completion
    await expect(page.getByRole("button", { name: /new research/i })).toBeVisible({ timeout: 90_000 });

    // Click new research
    await page.getByRole("button", { name: /new research/i }).click();

    // Form should be back
    await expect(page.getByPlaceholder(/paste a job description/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /research this company/i })).toBeVisible();
  });

  test("no API keys are exposed in network requests", async ({ page }) => {
    const sensitivePatterns = [/sk-proj-/, /tvly-/];
    const violations: string[] = [];

    page.on("request", (request) => {
      const url = request.url();
      const postData = request.postData() ?? "";
      for (const pattern of sensitivePatterns) {
        if (pattern.test(url) || pattern.test(postData)) {
          violations.push(`API key found in request to ${url}`);
        }
      }
    });

    await page.goto("/");
    const textarea = page.getByPlaceholder(/paste a job description/i);
    await textarea.fill(SAMPLE_JD);
    await page.getByRole("button", { name: /research this company/i }).click();

    // Wait for completion
    await expect(page.getByRole("button", { name: /new research/i })).toBeVisible({ timeout: 90_000 });

    expect(violations).toHaveLength(0);
  });
});
