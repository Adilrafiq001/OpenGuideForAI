import { test, expect } from '@playwright/test';

test.describe('Builder Path Milestone 3a & Hero Buttons Aesthetics Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      try {
        localStorage.setItem('og_onboarding_completed', 'true');
      } catch {}
    });
    // Collect console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text();
        if (!text.includes('favicon') && !text.includes('chrome-extension')) {
          console.error('[Browser Error]:', text);
        }
      }
    });
  });

  test('01. Hero buttons have identical 52px height, baseline vertical alignment, and no duplicate prompt', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    const builderBtn = page.locator('[data-testid="hero-start-as-builder-btn"]').first();
    const engineerBtn = page.locator('[data-testid="hero-deep-ai-engineer-btn"]').first();

    await expect(builderBtn).toBeVisible({ timeout: 10000 });
    await expect(engineerBtn).toBeVisible({ timeout: 10000 });
    // Wait for hero entrance animation (0.5s duration + 0.25s delay) to fully settle
    await page.waitForTimeout(800);

    const builderBox = await builderBtn.boundingBox();
    const engineerBox = await engineerBtn.boundingBox();

    expect(builderBox).not.toBeNull();
    expect(engineerBox).not.toBeNull();

    if (builderBox && engineerBox) {
      // Both buttons must be 52px height (±1px)
      expect(Math.round(builderBox.height)).toBe(52);
      expect(Math.round(engineerBox.height)).toBe(52);

      // In desktop view (>=768px), both buttons must share the exact same top Y baseline (within 2px)
      const yDelta = Math.abs(builderBox.y - engineerBox.y);
      expect(yDelta).toBeLessThanOrEqual(2);
    }

    // Verify text of Deep AI Engineer does NOT have duplicate >_ >_ prompt symbol
    const engineerText = await engineerBtn.innerText();
    expect(engineerText).not.toContain('>_ >_');
    expect(engineerText).toContain('Deep AI Engineer');

    // Verify subtitle alignment
    const subtitles = page.locator('.launch-track-hero-container ~ div, .deep-engineer-btn-wrapper ~ div, .deep-engineer-btn-wrapper .text-\\[11px\\]');
    await expect(subtitles.first()).toBeVisible();
  });

  test('02. Track B1 Spec Studio Lab: 5-rule rubric autograding and deterministic simulation', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/builder/1');

    // Wait for Track B1 course player
    await expect(page.locator('text=Track B1: Build It').first()).toBeVisible({ timeout: 10000 });

    // Verify Spec Studio Lab mounts
    const rubricScore = page.locator('[data-testid="spec-rubric-score"]');
    await expect(rubricScore).toBeVisible();
    await expect(rubricScore).toContainText('5/5 Criteria Passed');

    // Verify simulate button is enabled for 5/5 spec
    const simulateBtn = page.locator('[data-testid="simulate-agent-btn"]');
    await expect(simulateBtn).toBeEnabled();

    // Switch to Vibe prompt template (must fail rubric)
    const vibeBtn = page.locator('[data-testid="template-vibe-spec"]');
    await vibeBtn.click();
    await expect(rubricScore).not.toContainText('5/5 Criteria Passed');
    await expect(simulateBtn).toBeDisabled();

    // Switch back to Production Spec
    const prodBtn = page.locator('[data-testid="template-prod-spec"]');
    await prodBtn.click();
    await expect(rubricScore).toContainText('5/5 Criteria Passed');
    await expect(simulateBtn).toBeEnabled();

    // Run simulated agent
    await simulateBtn.click();
    const simLogs = page.locator('[data-testid="spec-simulation-logs"]');
    await expect(simLogs).toBeVisible({ timeout: 5000 });
    await expect(simLogs).toContainText('Deterministic Execution Log');
  });

  test('03. Track B2 Diff Reader Lab: Visual diff viewer, hazard detection, and review actions', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/builder/2');

    // Wait for Track B2 course player
    await expect(page.locator('text=Track B2: Understand It').first()).toBeVisible({ timeout: 10000 });

    // Verify Diff Reader Lab mounts
    const diffViewer = page.locator('[data-testid="diff-viewer-container"]');
    await expect(diffViewer).toBeVisible();

    // Scenario 1: Safe refactor -> Accept & Commit
    const acceptBtn = page.locator('[data-testid="diff-accept-btn"]');
    await acceptBtn.click();
    const feedback = page.locator('[data-testid="diff-decision-feedback"]');
    await expect(feedback).toBeVisible();
    await expect(feedback).toContainText('Clean Merge');

    // Scenario 2: Leaked Secret Hazard
    const secretScenarioBtn = page.locator('[data-testid="scenario-btn-hazard-secret"]');
    await secretScenarioBtn.click();

    // Hazard banner must appear
    const hazardBanner = page.locator('[data-testid="diff-hazard-banner"]');
    await expect(hazardBanner).toBeVisible();
    await expect(hazardBanner).toContainText('Critical Security Hazard');

    // Reject the hazard
    const rejectBtn = page.locator('[data-testid="diff-reject-btn"]');
    await rejectBtn.click();
    await expect(feedback).toContainText('Excellent Catch');

    // Scenario 3: Dropped RLS Hazard
    const rlsScenarioBtn = page.locator('[data-testid="scenario-btn-hazard-rls"]');
    await rlsScenarioBtn.click();
    await expect(hazardBanner).toContainText('Dropped Row-Level Security');
    await rejectBtn.click();
    await expect(feedback).toContainText('Excellent Catch');
  });

  test('04. Builder Track B1 and B2 lessons load intuition, blueprints, and mastery quizzes', async ({ page }) => {
    await page.goto('/builder/1');
    await expect(page.locator('text=The One-Page Spec Template').first()).toBeVisible({ timeout: 10000 });

    // Verify Check Understanding quiz component renders
    await expect(page.locator('[data-testid="check-understanding-quiz"]').first()).toBeVisible();

    // Navigate to Track B2
    await page.goto('/builder/2');
    await expect(page.locator('text=Files, Folders, and Directory Mental Models').first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[data-testid="check-understanding-quiz"]').first()).toBeVisible();
  });

  test('05. Multi-device responsive verification (Desktop 1440px, Tablet 768px, Mobile 375px)', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error' && !msg.text().includes('favicon')) {
        consoleErrors.push(msg.text());
      }
    });

    // 1. Desktop 1440px
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await expect(page.locator('[data-testid="hero-start-as-builder-btn"]').first()).toBeVisible();
    await expect(page.locator('[data-testid="hero-deep-ai-engineer-btn"]').first()).toBeVisible();

    // 2. Tablet 768px
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await expect(page.locator('[data-testid="hero-start-as-builder-btn"]').first()).toBeVisible();
    await expect(page.locator('[data-testid="hero-deep-ai-engineer-btn"]').first()).toBeVisible();

    // 3. Mobile 375px
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await expect(page.locator('[data-testid="hero-start-as-builder-btn"]').first()).toBeVisible();
    await expect(page.locator('[data-testid="hero-deep-ai-engineer-btn"]').first()).toBeVisible();

    // Check no horizontal scrollbar overflow on mobile
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 2);

    expect(consoleErrors).toHaveLength(0);
  });
});
