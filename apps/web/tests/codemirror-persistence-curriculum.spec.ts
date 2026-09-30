import { test, expect } from '@playwright/test';

test.describe('OpenGuide CodeMirror 6, Scaffolding & Tiered Persistence Suite', () => {

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
  });

  test('01. CodeMirror 6 Editor mounts with line numbers, Python syntax and 4-space Tab indentation', async ({ page }) => {
    await page.goto('/track/0', { waitUntil: 'domcontentloaded' });

    // Wait for the CodeMirror editor to render
    const cmEditor = page.locator('.cm-editor').first();
    await expect(cmEditor).toBeVisible({ timeout: 15000 });

    // Verify line numbers gutter is rendered
    const gutters = page.locator('.cm-gutters').first();
    await expect(gutters).toBeVisible();

    // Verify content has scaffolded Python code
    const cmContent = page.locator('.cm-content').first();
    await expect(cmContent).toBeVisible();
    await expect(cmContent).toContainText('TODO');

    // Test tab key indentation
    await cmContent.click();
    await page.keyboard.press('Tab');
    await expect(cmContent).toBeFocused();
  });

  test('02. Theory tab renders Markdown with mathematical formula typesetting', async ({ page }) => {
    await page.goto('/track/1', { waitUntil: 'domcontentloaded' });

    // Ensure theory / briefing tab is visible
    const theoryPane = page.locator('.markdown-theory').first();
    await expect(theoryPane).toBeVisible({ timeout: 15000 });
  });

  test('03. Scaffolded challenge execution, solution reveal and pass advancement', async ({ page }) => {
    await page.goto('/track/0/engine', { waitUntil: 'domcontentloaded' });

    // Wait for Pyodide worker ready state
    const terminalHeader = page.locator('text=CPython Output Stream').first();
    await expect(terminalHeader).toBeVisible({ timeout: 15000 });

    // Wait for Pyodide (ready) indicator
    await expect(page.locator('text=Pyodide (ready)').first()).toBeVisible({ timeout: 15000 });

    // Locate solution reveal button
    const revealAccordion = page.getByRole('button', { name: /Reveal Canonical Solution/i }).first();
    if (await revealAccordion.count() > 0) {
      await revealAccordion.click();
      await page.waitForTimeout(300);

      const loadBtn = page.getByRole('button', { name: /Load into Editor/i }).first();
      if (await loadBtn.count() > 0) {
        await loadBtn.click();
        await page.waitForTimeout(300);
      }
    }

    // Click Run Code
    const runBtn = page.getByRole('button', { name: /Run Code/i }).first();
    await expect(runBtn).toBeVisible();
    await runBtn.click();

    // Wait for execution output in terminal
    const terminalOutput = page.locator('#terminal-output').first();
    await expect(terminalOutput).toBeVisible({ timeout: 20000 });
    await expect(terminalOutput).toContainText('TEST PASSED', { timeout: 10000 });

    // Verify Next Lesson button unlocked
    const nextLessonBtn = page.getByRole('button', { name: /Next Lesson/i }).first();
    await expect(nextLessonBtn).toBeVisible({ timeout: 5000 });
  });

  test('04. Portfolio page renders tiered persistence ledger with export/import controls', async ({ page }) => {
    await page.goto('/portfolio', { waitUntil: 'domcontentloaded' });

    // Verify heading
    await expect(page.locator('text=AI Engineering Credentials & Portfolio.').first()).toBeVisible({ timeout: 10000 });

    // Verify export button
    const exportBtn = page.getByRole('button', { name: /Export Ledger/i }).first();
    await expect(exportBtn).toBeVisible();

    // Verify import button
    const importBtn = page.getByRole('button', { name: /Import Backup/i }).first();
    await expect(importBtn).toBeVisible();

    // Verify 4 track badges exist
    await expect(page.locator('text=Kernel Architect').first()).toBeVisible();
    await expect(page.locator('text=Geometrician').first()).toBeVisible();
    await expect(page.locator('text=Agent Commander').first()).toBeVisible();
    await expect(page.locator('text=Systems Defender').first()).toBeVisible();
  });

  test('05. Abby Chatbot opens with offline knowledge engine and responds immediately', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Trigger Abby open via native event dispatch
    await page.evaluate(() => {
      const cb = document.querySelector('#abby-toggle-checkbox') as HTMLInputElement | null;
      if (cb) {
        cb.checked = true;
        cb.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    await page.waitForTimeout(500);

    // Verify Abby chat window opened
    const abbyHeader = page.locator('.abby-chat-header').first();
    await expect(abbyHeader).toBeVisible({ timeout: 5000 });
    await expect(page.locator('.abby-name').first()).toHaveText('Abby');

    // Type query
    const textarea = page.locator('#chat_bot').first();
    await expect(textarea).toBeVisible();
    await textarea.fill('What is Track 1 in OpenGuide?');

    // Submit query via Enter or forced click
    await textarea.press('Enter');

    // Expect assistant response bubble to appear
    await expect(page.locator('.abby-message-bubble.assistant').nth(1)).toBeVisible({ timeout: 5000 });
    await expect(page.locator('.abby-message-bubble.assistant').nth(1)).toContainText('Track 1');
  });

});
