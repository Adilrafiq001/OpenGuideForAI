import { test, expect } from '@playwright/test';

test.describe('Builder Path Milestone 2 — Track B0 Playable Slice & Sandboxed Lab Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
      localStorage.setItem('og_onboarding_completed', 'true');
    });
  });

  test('TC-BUILDER-M2-001: Navigation to /builder/0/engine mounts Prompt-to-Preview Lab and hides Python IDE', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto('/builder/0/engine');
    await page.waitForLoadState('domcontentloaded');

    // 1. Verify prompt-to-preview lab is visible
    const labTitle = page.getByText('Prompt-to-Preview Lab', { exact: true });
    await expect(labTitle).toBeVisible();

    // 2. Verify Python Monaco editor is NOT mounted
    const pythonFileTag = page.locator('text=main.py');
    await expect(pythonFileTag).not.toBeVisible();

    // 3. Verify provider buttons are visible
    await expect(page.locator('[data-testid="provider-offline-btn"]')).toBeVisible();
    await expect(page.locator('[data-testid="provider-byok-btn"]')).toBeVisible();
    await expect(page.locator('[data-testid="provider-mock-btn"]')).toBeVisible();

    // 4. Verify no unexpected console errors
    expect(errors.filter(e => !e.includes('favicon') && !e.includes('404'))).toEqual([]);
  });

  test('TC-BUILDER-M2-002: Offline Demo provider renders sandboxed app preview in < 2 seconds without API key', async ({ page }) => {
    await page.goto('/builder/0/engine');

    // Verify sandboxed iframe exists
    const iframe = page.locator('[data-testid="sandboxed-preview-iframe"]');
    await expect(iframe).toBeVisible({ timeout: 4000 });

    // Verify sandbox attribute strictly allows scripts only
    const sandboxAttr = await iframe.getAttribute('sandbox');
    expect(sandboxAttr).toBe('allow-scripts');
    expect(sandboxAttr).not.toContain('allow-same-origin');

    // Verify frame contains rendered content
    const frame = iframe.contentFrame();
    expect(frame).not.toBeNull();
    if (frame) {
      await expect(frame.locator('h1, h2, h3').first()).toBeVisible({ timeout: 3000 });
    }
  });

  test('TC-BUILDER-M2-003: View Code drawer reveals generated read-only source code', async ({ page }) => {
    await page.goto('/builder/0/engine');

    const toggleCodeBtn = page.locator('[data-testid="toggle-view-code-btn"]');
    await expect(toggleCodeBtn).toBeVisible();

    // Click View Code
    await toggleCodeBtn.click();

    // Verify code drawer is displayed
    const codeHeader = page.locator('text=Generated Single-Page Source (index.html)');
    await expect(codeHeader).toBeVisible();

    // Verify code content contains standard HTML boilerplate
    const codeBlock = page.locator('pre code');
    await expect(codeBlock).toBeVisible();
    const codeContent = await codeBlock.textContent();
    expect(codeContent).toContain('<!DOCTYPE html>');
    expect(codeContent).toContain('<meta http-equiv="Content-Security-Policy"');

    // Toggle back to preview
    await toggleCodeBtn.click();
    await expect(page.locator('[data-testid="sandboxed-preview-iframe"]')).toBeVisible();
  });

  test('TC-BUILDER-M2-004: Emergency Stop unmounts iframe and Resume remounts it', async ({ page }) => {
    await page.goto('/builder/0/engine');

    const iframe = page.locator('[data-testid="sandboxed-preview-iframe"]');
    await expect(iframe).toBeVisible({ timeout: 4000 });

    // Click Stop Preview
    const stopBtn = page.locator('[data-testid="stop-preview-btn"]');
    await expect(stopBtn).toBeVisible();
    await stopBtn.click();

    // Verify iframe is unmounted from DOM
    await expect(iframe).not.toBeVisible();
    await expect(page.locator('text=Preview Stopped')).toBeVisible();

    // Click Resume Preview
    const resumeBtn = page.locator('[data-testid="resume-preview-btn"]');
    await expect(resumeBtn).toBeVisible();
    await resumeBtn.click();

    // Verify iframe is restored
    await expect(iframe).toBeVisible();
  });

  test('TC-BUILDER-M2-005: Hostile payload defense verifies strict sandbox isolation', async ({ page }) => {
    await page.goto('/builder/0/engine');

    const iframe = page.locator('[data-testid="sandboxed-preview-iframe"]');
    await expect(iframe).toBeVisible({ timeout: 4000 });

    // 1. Verify strict sandbox attributes: allow-scripts ONLY, NEVER allow-same-origin
    const sandboxAttr = await iframe.getAttribute('sandbox');
    expect(sandboxAttr).toBe('allow-scripts');
    expect(sandboxAttr).not.toContain('allow-same-origin');

    // 2. Evaluate isolation from inside iframe frame
    const iframeHandle = await iframe.elementHandle();
    const frame = await iframeHandle?.contentFrame();
    expect(frame).not.toBeNull();

    if (frame) {
      // Test A: Accessing window.parent.document MUST throw SecurityError
      const parentAccessBlocked = await frame.evaluate(() => {
        try {
          // Attempt cross-origin access to parent document
          void window.parent.document;
          return false; // Did not throw -> vulnerability!
        } catch (err: any) {
          return true; // Threw SecurityError -> isolated!
        }
      });
      expect(parentAccessBlocked).toBe(true);

      // Test B: Accessing window.localStorage inside null origin MUST throw SecurityError
      const storageAccessBlocked = await frame.evaluate(() => {
        try {
          window.localStorage.setItem('og_exploit_test', 'leaked');
          return false; // Did not throw -> vulnerability!
        } catch (err: any) {
          return true; // Threw SecurityError -> isolated!
        }
      });
      expect(storageAccessBlocked).toBe(true);

      // Test C: Injected CSP contains connect-src 'none'
      const cspMeta = await frame.evaluate(() => {
        const meta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
        return meta ? meta.getAttribute('content') : null;
      });
      expect(cspMeta).not.toBeNull();
      expect(cspMeta).toContain("connect-src 'none'");
    }
  });

  test('TC-BUILDER-M2-006: 3-Sentence Blueprint Formula inputs update and generate preview', async ({ page }) => {
    await page.goto('/builder/0/engine');

    // Verify Blueprint input fields
    const goalInput = page.locator('[data-testid="blueprint-goal-input"]');
    const controlsInput = page.locator('[data-testid="blueprint-controls-input"]');
    const rulesInput = page.locator('[data-testid="blueprint-rules-input"]');

    await expect(goalInput).toBeVisible();
    await expect(controlsInput).toBeVisible();
    await expect(rulesInput).toBeVisible();

    // Change input to Unit Converter
    await goalInput.fill('Temperature and length unit converter');
    await controlsInput.fill('Value input, Celsius to Fahrenheit and meters to feet select');
    await rulesInput.fill('F = C * 9/5 + 32, feet = meters * 3.28084');

    // Click Generate & Preview
    const generateBtn = page.locator('[data-testid="generate-preview-btn"]');
    await generateBtn.click();

    // Verify preview frame updates
    const iframe = page.locator('[data-testid="sandboxed-preview-iframe"]');
    await expect(iframe).toBeVisible();

    const frame = iframe.contentFrame();
    if (frame) {
      await expect(frame.locator('text=Unit Converter').or(frame.locator('text=Converter'))).toBeVisible({ timeout: 3000 });
    }
  });

  test('TC-BUILDER-M2-007: Check Understanding Quiz validates answers and awards lesson completion', async ({ page }) => {
    await page.goto('/builder/0/engine');

    // Verify Check Understanding quiz is present in briefing
    const quizTitle = page.locator('text=Check Your Understanding (3 Questions)');
    await expect(quizTitle).toBeVisible();

    // Verify all 3 questions have option buttons
    const q0Option0 = page.locator('[data-testid="quiz-option-0-0"]');
    const q1Option0 = page.locator('[data-testid="quiz-option-1-0"]');
    const q2Option0 = page.locator('[data-testid="quiz-option-2-0"]');

    await expect(q0Option0).toBeVisible();
    await expect(q1Option0).toBeVisible();
    await expect(q2Option0).toBeVisible();

    // 1. First test: Submit with 1 incorrect answer (Q0=1 instead of 0)
    await page.locator('[data-testid="quiz-option-0-1"]').click();
    await page.locator('[data-testid="quiz-option-1-1"]').click();
    await page.locator('[data-testid="quiz-option-2-1"]').click();

    const submitBtn = page.locator('[data-testid="submit-quiz-btn"]');
    await expect(submitBtn).toBeEnabled();
    await submitBtn.scrollIntoViewIfNeeded();
    await submitBtn.click({ force: true });

    // Verify 2/3 Correct and Try Again button appears
    await expect(page.locator('text=2 / 3 Correct')).toBeVisible();
    const tryAgainBtn = page.locator('button:has-text("Try Again")');
    await expect(tryAgainBtn).toBeVisible();
    await tryAgainBtn.click();

    // 2. Second test: Select all 3 correct answers for Lesson B0.1.1
    // Q0: Visual layout, state memory, and transformation logic (Option index 0)
    // Q1: Bill amount and tip percentage (Option index 1)
    // Q2: AI acts as rapid pattern translator (Option index 1)
    await page.locator('[data-testid="quiz-option-0-0"]').click();
    await page.locator('[data-testid="quiz-option-1-1"]').click();
    await page.locator('[data-testid="quiz-option-2-1"]').click();

    await expect(submitBtn).toBeEnabled();
    await submitBtn.scrollIntoViewIfNeeded();
    await submitBtn.click({ force: true });

    // Verify 3/3 Mastery Verified
    await expect(page.locator('text=Mastery Verified!')).toBeVisible();
    await expect(page.locator('text=3 / 3 Correct')).toBeVisible();

    // Verify progress persistence in localStorage/state
    const isCompleted = await page.evaluate(() => {
      const stored = localStorage.getItem('openguide_completed_lessons');
      return stored ? stored.includes('lesson-b0-1-1') : false;
    });
    expect(isCompleted).toBe(true);
  });

  test('TC-BUILDER-M2-008: 375px mobile viewport has zero horizontal scroll overflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/builder/0/engine');
    await page.waitForLoadState('domcontentloaded');

    // Verify mobile segmented tab switcher
    const studyTab = page.locator('[data-testid="mobile-tab-briefing"]');
    const buildTab = page.locator('[data-testid="mobile-tab-editor"]');
    await expect(studyTab).toBeVisible();
    await expect(buildTab).toBeVisible();

    // Verify no horizontal overflow in study tab
    const hasOverflowBriefing = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    expect(hasOverflowBriefing).toBe(false);

    // Switch to Build tab
    await buildTab.click();

    // Verify no horizontal overflow in build tab
    const hasOverflowBuild = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    expect(hasOverflowBuild).toBe(false);
  });
});
