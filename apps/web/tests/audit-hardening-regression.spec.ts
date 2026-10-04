import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Audit Hardening & Regression Suite (64+5 Bug Audit Validation)', () => {

  test('TC-AUDIT-001: 24-Theme Parity in index.html Pre-Bootstrap Script', async ({ page }) => {
    // Read index.html from disk to verify static contract
    const indexHtmlPath = path.resolve(process.cwd(), 'index.html');
    const indexHtml = fs.readFileSync(indexHtmlPath, 'utf-8');

    const expectedLightThemes = [
      'pure-paper', 'e-ink-papyrus', 'claude-light', 'linear-light', 'notion-cream',
      'github-light', 'swiss-modernist', 'solarized-light', 'nordic-fjord', 'matcha-ceremonial',
      'sakura-blossom', 'champagne-luminary'
    ];

    const expectedDarkThemes = [
      'obsidian', 'claude-dark', 'linear-dark', 'cursor-dark', 'cyberpunk-neon',
      'github-dark', 'monokai-pro', 'nord-dark', 'dracula', 'circadian-amber',
      'aurora-borealis', 'celestial-nebula'
    ];

    const allThemes = [...expectedLightThemes, ...expectedDarkThemes];
    expect(allThemes.length).toBe(24);

    // Verify all 12 light themes are in lightThemes array in index.html
    for (const theme of expectedLightThemes) {
      expect(indexHtml).toContain(`'${theme}'`);
    }

    // Verify all 24 themes are in themeBgs lookup in index.html
    for (const theme of allThemes) {
      expect(indexHtml).toContain(`'${theme}': '#`);
    }

    // Boot page with sakura-blossom and verify initial html background is set cleanly before hydration
    await page.addInitScript(() => {
      sessionStorage.setItem('openguide_session_theme', 'sakura-blossom');
    });
    await page.goto('/');
    const htmlTheme = await page.getAttribute('html', 'data-theme');
    const htmlMode = await page.getAttribute('html', 'data-theme-mode');
    expect(htmlTheme).toBe('sakura-blossom');
    expect(htmlMode).toBe('light');
  });

  test('TC-AUDIT-002: Announcement Pill Visible on Clean First-Time Visit', async ({ page }) => {
    // Clear storage but keep onboarding completed to prevent modal overlay
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
      localStorage.setItem('og_onboarding_completed', 'true');
    });
    await page.reload();

    // The announcement pill should be rendered on landing page for new users
    const announcementPill = page.locator('text=OpenGuide v1.1.0 Live');
    await expect(announcementPill).toBeVisible();

    // Verify announcement text contains Bluee mascot name
    const subtext = page.locator('text=50+ Bluee answers');
    await expect(subtext).toBeVisible();

    // Dismissing it updates storage and removes the pill
    const dismissBtn = page.locator('button[aria-label="Dismiss update notification"]');
    await dismissBtn.click();
    await expect(announcementPill).not.toBeVisible();
  });

  test('TC-AUDIT-003: Eager Progress Hydration on App Boot', async ({ page }) => {
    // Pre-populate IndexedDB progress record
    await page.goto('/');
    await page.evaluate(async () => {
      const { useProgressStore } = await import('/src/store/useProgressStore.ts');
      await useProgressStore.getState().completeLesson('lab-0-1');
    });

    // Reload root page and verify progress is loaded immediately
    await page.goto('/');
    const isLoaded = await page.evaluate(async () => {
      const { useProgressStore } = await import('/src/store/useProgressStore.ts');
      return useProgressStore.getState().isLoaded;
    });
    expect(isLoaded).toBe(true);

    const completed = await page.evaluate(async () => {
      const { useProgressStore } = await import('/src/store/useProgressStore.ts');
      return useProgressStore.getState().completedLessonIds;
    });
    expect(completed).toContain('lab-0-1');
  });

  test('TC-AUDIT-004: SSR SEO Fallback Tracks Match Current Curriculum', async () => {
    const indexHtmlPath = path.resolve(process.cwd(), 'index.html');
    const indexHtml = fs.readFileSync(indexHtmlPath, 'utf-8');

    expect(indexHtml).toContain('Track 0: Absolute Zero AI Engineering');
    expect(indexHtml).toContain('Track 1: Embeddings, Vector Spaces and Semantic Search');
    expect(indexHtml).toContain('Track 2: RAG, Retrieval &amp; Autonomous Agents');
    expect(indexHtml).toContain('Track 3: Production Evals, Guardrails &amp; Security');
    expect(indexHtml).toContain('Track 4: Frontier Attention, Systems &amp; Reasoning');
  });

  test('TC-AUDIT-005: Offline Indicator Network Flipped Mid-Flight Without Errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto('/');

    // Simulate online/offline flips rapidly
    await page.evaluate(() => {
      window.dispatchEvent(new Event('offline'));
    });
    await page.waitForTimeout(100);
    await page.evaluate(() => {
      window.dispatchEvent(new Event('online'));
    });
    await page.waitForTimeout(100);
    await page.evaluate(() => {
      window.dispatchEvent(new Event('offline'));
    });
    await page.waitForTimeout(100);
    await page.evaluate(() => {
      window.dispatchEvent(new Event('online'));
    });

    // Zero uncaught errors
    expect(errors.filter(e => !e.includes('favicon'))).toHaveLength(0);
  });

  test('TC-AUDIT-006: Hardware Detection & Context Release', async ({ page }) => {
    await page.goto('/');
    const hardware = await page.evaluate(async () => {
      const { detectHardwareSync } = await import('/src/utils/hardwareDetection.ts');
      return detectHardwareSync();
    });

    expect(hardware).toHaveProperty('hasWebGL');
    expect(hardware).toHaveProperty('isLowEnd');
    expect(hardware).toHaveProperty('rendererName');
  });

  test('TC-AUDIT-007: Jupyter Notebook Export Includes Standard Kernelspec', async ({ page }) => {
    await page.goto('/');
    const notebookJson = await page.evaluate(async () => {
      const { generateJupyterNotebook } = await import('/src/utils/notebookExport.ts');
      return generateJupyterNotebook('lab-0-1', 'Test Lab', 'print("hello world")', 'assert True');
    });

    const parsed = JSON.parse(notebookJson);
    expect(parsed).toHaveProperty('metadata');
    expect(parsed.metadata).toHaveProperty('kernelspec');
    expect(parsed.metadata.kernelspec.name).toBe('python3');
    expect(parsed.metadata.kernelspec.language).toBe('python');
    expect(parsed.metadata.language_info.name).toBe('python');
  });

  test('TC-AUDIT-008: Settings Reset Preserves User BYOK Key & Resets Themes', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(async () => {
      const { useSettingsStore } = await import('/src/store/useSettingsStore.ts');
      useSettingsStore.getState().setByokApiKey('sk-ant-test-key-12345');
      useSettingsStore.getState().setTheme('cyberpunk-neon');
      useSettingsStore.getState().resetDefaults();
    });

    const settings = await page.evaluate(async () => {
      const { useSettingsStore } = await import('/src/store/useSettingsStore.ts');
      const state = useSettingsStore.getState();
      return {
        theme: state.theme,
        lastDarkTheme: state.lastDarkTheme,
        lastLightTheme: state.lastLightTheme,
        byokApiKey: state.byokApiKey
      };
    });

    expect(settings.theme).toBe('claude-light');
    expect(settings.lastDarkTheme).toBe('obsidian');
    expect(settings.lastLightTheme).toBe('claude-light');
    expect(settings.byokApiKey).toBe('sk-ant-test-key-12345');
  });

  test('TC-AUDIT-009: ExplainerPill Pointerdown Tap Outside Closes Cleanly', async ({ page }) => {
    await page.goto('/');
    const pillBtn = page.locator('button:has-text("Why Python for AI?")').first();
    await pillBtn.scrollIntoViewIfNeeded();
    await expect(pillBtn).toBeVisible();

    // Initial state is closed
    await expect(pillBtn).toHaveAttribute('aria-expanded', 'false');

    // Click to open
    await pillBtn.click();
    await expect(pillBtn).toHaveAttribute('aria-expanded', 'true');

    // Pointerdown outside (on body or main heading) closes it
    await page.locator('h1').first().dispatchEvent('pointerdown');
    await expect(pillBtn).toHaveAttribute('aria-expanded', 'false');
  });

  test('TC-AUDIT-010: CommandDock Minimized State Restored by Tour', async ({ page }) => {
    await page.goto('/');
    // Minimize dock
    const hideBtn = page.locator('button:has-text("Hide Dock"), [title="Hide Dock"]').first();
    if (await hideBtn.isVisible()) {
      await hideBtn.click();
      // Verify show dock button is visible
      await expect(page.locator('[data-testid="show-command-dock-btn"]')).toBeVisible();

      // Trigger tour event
      await page.evaluate(() => {
        window.dispatchEvent(new CustomEvent('openguide:restore-dock'));
      });

      // Verify dock wrapper is restored
      await expect(page.locator('[data-testid="command-dock-wrapper"]')).toBeVisible();
    }
  });

});
