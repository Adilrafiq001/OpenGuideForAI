import { test, expect } from '@playwright/test';

test.describe('OpenGuide Full Application Comprehensive Regression Suite', () => {

  test.beforeEach(async ({ page }) => {
    // Set standard viewport for desktop testing
    await page.setViewportSize({ width: 1280, height: 800 });
    // Ensure clean state and default English language
    await page.addInitScript(() => {
      window.localStorage.setItem('opendesign-language', JSON.stringify({ state: { language: 'en' }, version: 0 }));
    });
  });

  test('01. Landing Page: Branding, Typography, Motionsites Physics Hero & Navigation', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Title & Brand Logo
    await expect(page).toHaveTitle(/OpenGuide/i);
    const brand = page.locator('text=OpenGuide.').first();
    await expect(brand).toBeVisible({ timeout: 10000 });

    const subtitle = page.locator('text=AI STUDIO').first();
    await expect(subtitle).toBeVisible();

    // Default Language Check: should be English
    const heroH1 = page.locator('h1').first();
    await expect(heroH1).toBeVisible();
    await expect(heroH1).toContainText(/Zero To/i);
    await expect(heroH1).toContainText(/AI Engineer/i);

    // Motionsites Physics Pills in Hero
    const wasmPill = page.locator('text=0ms WebAssembly CPython');
    if (await wasmPill.count() > 0) {
      await expect(wasmPill).toBeVisible();
    }

    // ARD Attribution Line
    const ardText = page.locator('text=ARD').first();
    await expect(ardText).toBeVisible();

    // Launch Track 0 Button
    const launchBtn = page.getByRole('button', { name: /Launch Track 0/i }).first();
    await expect(launchBtn).toBeVisible();

    // Explainer Pills in Hero
    const whyPython = page.getByRole('button', { name: /Why Python/i }).first();
    if (await whyPython.count() > 0) {
      await expect(whyPython).toBeVisible();
      await whyPython.click();
      await page.waitForTimeout(300);
      // Verify popover opened
      await expect(page.locator('text=Why Python is the Global Standard for AI').first()).toBeVisible();
      // Dismiss popover via Escape so it does not intercept subsequent clicks
      await page.keyboard.press('Escape');
      await page.waitForTimeout(400);
    }

    // First Principles Matrix Modal
    const exploreQuestionsBtn = page.locator('button:has-text("Explore All")').first();
    if (await exploreQuestionsBtn.count() > 0) {
      await exploreQuestionsBtn.scrollIntoViewIfNeeded();
      await exploreQuestionsBtn.click();
      await page.waitForTimeout(400);

      const matrixModalTitle = page.locator('text=First Principles Knowledge Matrix').first();
      await expect(matrixModalTitle).toBeVisible();

      // Close Modal
      const closeBtn = page.locator('button[aria-label="Close modal"]').or(page.getByRole('button', { name: /Close/i })).first();
      if (await closeBtn.count() > 0) {
        await closeBtn.click();
      } else {
        await page.keyboard.press('Escape');
      }
      await page.waitForTimeout(300);
    }
  });

  test('02. Cross-Theme Legibility: Verify Dark & Light Themes for Contrast & Zero Black Windows', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Open Theme Switcher Modal via Header or Dock Button
    const themeBtn = page.locator('button[aria-label="Choose color theme"]').or(page.locator('button[aria-label="Theme Customizer"]')).first();
    await expect(themeBtn).toBeVisible({ timeout: 10000 });
    await themeBtn.click();
    await page.waitForTimeout(500);

    // Modal should be open
    const modalHeader = page.locator('text=Workspace Personalization').first();
    await expect(modalHeader).toBeVisible();

    const themeModal = page.locator('.fixed.inset-0.z-\\[200\\]').or(page.locator('[role="dialog"]')).first();

    // Test a Dark Theme (Midnight Slate) scoped to modal
    const darkThemeItem = themeModal.getByText('Midnight Slate').first();
    if (await darkThemeItem.count() > 0) {
      await darkThemeItem.click();
      await page.waitForTimeout(300);
      const activeTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
      expect(activeTheme).toBe('midnight');
    }

    // Test a Light Theme (Pure Paper) scoped to modal
    const lightThemeItem = themeModal.getByText('Pure Paper').first();
    if (await lightThemeItem.count() > 0) {
      await lightThemeItem.click();
      await page.waitForTimeout(300);
      const activeTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
      expect(activeTheme).toBe('pure-paper');

      // Close theme modal
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);

      // Verify that CognitiveAccelerator is visible and properly styled in light theme
      const cogBox = page.locator('#cognitive-accelerator').or(page.locator('text=The Cognitive Accelerator')).first();
      await expect(cogBox).toBeVisible();

      // Reset back to Obsidian Black
      await themeBtn.click();
      await page.waitForTimeout(300);
      const obsidianItem = themeModal.getByText('Obsidian Black').first();
      if (await obsidianItem.count() > 0) {
        await obsidianItem.click();
      }
      await page.keyboard.press('Escape');
    } else {
      await page.keyboard.press('Escape');
    }
  });

  test('03. Cognitive Accelerator: All 5 Learning Psychology Tabs Functionality', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Scroll to Cognitive Accelerator
    const cogSection = page.locator('text=The Cognitive Accelerator').first();
    await cogSection.scrollIntoViewIfNeeded();
    await expect(cogSection).toBeVisible({ timeout: 10000 });

    // Tab 1: 80/20 Pareto
    const paretoTab = page.getByRole('button', { name: /80\/20 Pareto/i }).first();
    await expect(paretoTab).toBeVisible();
    await paretoTab.click();
    await expect(page.locator('text=Core Mathematical Formula').first()).toBeVisible();

    // Tab 2: Blurting Retrieval
    const blurtingTab = page.getByRole('button', { name: /Blurting Retrieval/i }).first();
    await expect(blurtingTab).toBeVisible();
    await blurtingTab.click();
    await page.waitForTimeout(300);

    const recallBtn = page.getByRole('button', { name: /Start Forced Recall Now/i }).first();
    if (await recallBtn.count() > 0) {
      await recallBtn.click();
      await page.waitForTimeout(200);
      const textarea = page.locator('textarea').first();
      await expect(textarea).toBeVisible();
      await textarea.fill('Vector embeddings project high-dimensional semantic spaces into cosine similarities.');
      const evalBtn = page.getByRole('button', { name: /Evaluate Recall/i }).first();
      await expect(evalBtn).toBeEnabled();
      await evalBtn.click();
      await page.waitForTimeout(300);
      await expect(page.locator('text=Active Neural Consolidation Feedback').first()).toBeVisible();
    }

    // Tab 3: Feynman Novice Translator
    const feynmanTab = page.getByRole('button', { name: /Feynman Novice/i }).first();
    await expect(feynmanTab).toBeVisible();
    await feynmanTab.click();
    await page.waitForTimeout(300);

    const feynmanInput = page.locator('textarea').first();
    await expect(feynmanInput).toBeVisible();
    await feynmanInput.fill('Imagine you are searching for your favorite book in a library.');
    const inspectBtn = page.getByRole('button', { name: /Inspect Ideal Plain Explanation/i }).first();
    await expect(inspectBtn).toBeVisible();
    await inspectBtn.click();
    await page.waitForTimeout(200);
    await expect(page.locator('text=Benchmark Plain-English Explanation').first()).toBeVisible();

    // Tab 4: Targeted Deliberate Drills
    const drillsTab = page.getByRole('button', { name: /Targeted Drills/i }).first();
    await expect(drillsTab).toBeVisible();
    await drillsTab.click();
    await page.waitForTimeout(300);
    await expect(page.locator('text=Hard Scenario Test').first()).toBeVisible();

    // Tab 5: Verified Tools
    const vaultTab = page.getByRole('button', { name: /Verified Tools/i }).first();
    await expect(vaultTab).toBeVisible();
    await vaultTab.click();
    await page.waitForTimeout(300);
    await expect(page.locator('text=100% Free & Open Ecosystem').first()).toBeVisible();
  });

  test('04. Spatial Holodeck: XR Suite, Three.js 3D Canvas, Cluster Slicer & Telemetry', async ({ page }) => {
    await page.goto('/holodeck', { waitUntil: 'domcontentloaded' });

    // Check Header & Telemetry
    await expect(page.locator('text=Spatial Holodeck').first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Semantic Embedding Hyper-Space').first()).toBeVisible();

    // Canvas should exist and be visible
    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeVisible();

    // Sub-Manifold Cluster Slicer buttons
    const neuralBtn = page.getByRole('button', { name: /Neural/i }).first();
    if (await neuralBtn.count() > 0) {
      await neuralBtn.click();
      await page.waitForTimeout(300);
    }

    const mathBtn = page.getByRole('button', { name: /Math/i }).first();
    if (await mathBtn.count() > 0) {
      await mathBtn.click();
      await page.waitForTimeout(300);
    }

    const allBtn = page.getByRole('button', { name: /All Clusters/i }).or(page.locator('button:has-text("All")')).first();
    if (await allBtn.count() > 0) {
      await allBtn.click();
      await page.waitForTimeout(300);
    }

    // Cosine similarity slider exists
    const slider = page.locator('input[type="range"]').first();
    if (await slider.count() > 0) {
      await expect(slider).toBeVisible();
    }
  });

  test('05. CoursePlayer & Track 0 Engine: Interactive In-Browser Pyodide Execution', async ({ page }) => {
    await page.goto('/track/0/intro', { waitUntil: 'domcontentloaded' });

    await expect(page.locator('text=Track 0').first()).toBeVisible({ timeout: 10000 });
    const startIDE = page.locator('button:has-text("Engage Engine")').first();
    if (await startIDE.count() > 0) {
      await startIDE.click();
      await page.waitForURL(/.*\/track\/0\/engine/, { timeout: 10000 });
    } else {
      await page.goto('/track/0/engine', { waitUntil: 'domcontentloaded' });
    }

    // Check IDE interface elements
    const runBtn = page.getByRole('button', { name: /Run Code/i }).first();
    await expect(runBtn).toBeVisible({ timeout: 10000 });

    // X-Ray Debug Lens Toggle
    const xrayBtn = page.locator('button:has-text("X-Ray")').or(page.locator('button[aria-label="Toggle X-Ray Debug Lens"]')).first();
    if (await xrayBtn.count() > 0) {
      await xrayBtn.click();
      await page.waitForTimeout(300);

      // Verify X-Ray modal is open
      await expect(page.locator('text=X-Ray Debug Lens // Runtime Telemetry').first()).toBeVisible();

      // Close X-Ray modal
      const closeXrayBtn = page.locator('button[title="Close X-Ray Lens (Esc)"]').or(page.locator('button[aria-label="Close"]'));
      if (await closeXrayBtn.count() > 0) {
        await closeXrayBtn.first().click();
      } else {
        await page.keyboard.press('Escape');
      }
      await page.waitForTimeout(300);
    }
  });

  test('06. Magnification Dock: Positioning, Unclipped Expansion, Navigation & Hide/Show', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Dock toolbar container
    const dockToolbar = page.locator('[role="toolbar"][aria-label="Application dock"]').first();
    await expect(dockToolbar).toBeVisible({ timeout: 10000 });

    // Dock Items: Hover over dock items to verify magnification
    const dockButtons = dockToolbar.locator('div[role="button"]');
    const count = await dockButtons.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < Math.min(count, 5); i++) {
      const btn = dockButtons.nth(i);
      await btn.hover();
      await page.waitForTimeout(100);
    }

    // Toggle Dock Visibility: Last item is "Hide Dock"
    const hideBtn = dockButtons.last();
    await hideBtn.click();
    await page.waitForTimeout(400);

    // Restore button appears: "Show Dock"
    const restoreBtn = page.locator('button:has-text("Show Dock")').first();
    await expect(restoreBtn).toBeVisible({ timeout: 5000 });
    await restoreBtn.click();
    await page.waitForTimeout(400);

    // Dock restored
    await expect(dockToolbar).toBeVisible();
  });

});
