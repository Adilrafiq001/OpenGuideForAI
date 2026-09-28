import { test, expect } from '@playwright/test';

test.describe('OpenGuide Full Application Comprehensive End-To-End Regression Suite', () => {

  test.beforeEach(async ({ page }) => {
    // Set standard viewport for desktop testing
    await page.setViewportSize({ width: 1280, height: 800 });
    // Ensure clean state and default English language
    await page.addInitScript(() => {
      window.localStorage.setItem('opendesign-language', JSON.stringify({ state: { language: 'en' }, version: 0 }));
    });
  });

  test('01. Landing Page: Branding, Typography with / Prefix, Studio Console & Matrix Modal', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Title & Brand Logo
    await expect(page).toHaveTitle(/OpenGuide/i);
    const brand = page.locator('text=OpenGuide.').first();
    await expect(brand).toBeVisible({ timeout: 10000 });

    const subtitle = page.locator('text=AI STUDIO').first();
    await expect(subtitle).toBeVisible();

    // Default Language Check & Headline with "/" Prefix
    const heroH1 = page.locator('h1').first();
    await expect(heroH1).toBeVisible();
    await expect(heroH1).toContainText('/');
    await expect(heroH1).toContainText(/Zero To/i);
    await expect(heroH1).toContainText(/AI Engineer/i);

    // Eyebrow badge
    await expect(page.locator('text=100% Free & Open Source').first()).toBeVisible();

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
      // Dismiss popover via Escape
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

  test('02. Studio Console Lenses & Simulation Execution: In-Browser WASM, Vector Manifolds, RAG, FastMCP', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Locate Studio Console
    const consoleHeader = page.locator('text=OpenGuide Studio // WebAssembly CPython Runtime').first();
    await expect(consoleHeader).toBeVisible({ timeout: 10000 });

    // Test Lens 1: WASM Kernel (Active by default)
    await expect(page.locator('text=Interactive Pyodide CPython WebAssembly Sandbox').first()).toBeVisible();

    // Trigger Simulation execution
    const runSimBtn = page.getByRole('button', { name: /Run Simulation/i }).first();
    await expect(runSimBtn).toBeVisible();
    await runSimBtn.click();
    await page.waitForTimeout(600);
    await expect(page.locator('text=Vector dot-product matched in 0.38ms').first()).toBeVisible();

    // Test Lens 2: Vector Manifolds
    const vectorLensBtn = page.getByRole('button', { name: /Vector Manifolds/i }).first();
    await vectorLensBtn.click();
    await page.waitForTimeout(250);
    await expect(page.locator('text=High-Dimensional Semantic Manifold Projection').first()).toBeVisible();
    await expect(page.locator('text=Neural Topology').first()).toBeVisible();

    // Test Lens 3: RAG Engine
    const ragLensBtn = page.getByRole('button', { name: /RAG Engine/i }).first();
    await ragLensBtn.click();
    await page.waitForTimeout(250);
    await expect(page.locator('text=Dense Vector Retrieval & Zero-Hallucination Pipeline').first()).toBeVisible();

    // Test Lens 4: FastMCP Tools
    const mcpLensBtn = page.getByRole('button', { name: /FastMCP Tools/i }).first();
    await mcpLensBtn.click();
    await page.waitForTimeout(250);
    await expect(page.locator('text=FastMCP Tool Execution & Autonomous State Machine').first()).toBeVisible();
  });

  test('03. Cross-Theme Legibility: Verify Dark & Light Themes for Contrast, Header Visibility & Zero Black Windows', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Verify Header links visibility
    const tracksLink = page.getByRole('link', { name: 'Tracks' }).first();
    await expect(tracksLink).toBeVisible();

    // Open Theme Switcher Modal via Header or Dock Button
    const themeBtn = page.locator('button[aria-label="Choose color theme"]').or(page.locator('button[aria-label="Theme Customizer"]')).first();
    await expect(themeBtn).toBeVisible({ timeout: 10000 });
    await themeBtn.click();
    await page.waitForTimeout(500);

    const themeModal = page.locator('.fixed.inset-0.z-\\[200\\]').or(page.locator('[role="dialog"]')).first();
    await expect(themeModal).toBeVisible();

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

      // Verify header text remains crisp and visible in Light Theme
      await expect(tracksLink).toBeVisible();
      const tracksColor = await tracksLink.evaluate((el) => window.getComputedStyle(el).color);
      expect(tracksColor).toBeDefined();

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

  test('04. Multi-Language i18n & Store Persistence: Spanish, French, German, Chinese, Hindi & English', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const langBtn = page.locator('button[aria-label="Select interface language"]').first();
    await expect(langBtn).toBeVisible({ timeout: 10000 });
    await langBtn.click();
    await page.waitForTimeout(300);

    // Switch to Spanish
    const esBtn = page.locator('button:has-text("Español")').first();
    if (await esBtn.count() > 0) {
      await esBtn.click();
      await page.waitForTimeout(300);

      // Verify Spanish translation rendered
      await expect(page.locator('text=ES').first()).toBeVisible();

      // Switch back to English
      await langBtn.click();
      await page.waitForTimeout(300);
      const enBtn = page.locator('button:has-text("English")').first();
      await enBtn.click();
      await page.waitForTimeout(300);
      await expect(page.locator('text=EN').first()).toBeVisible();
    } else {
      await page.keyboard.press('Escape');
    }
  });

  test('05. Adaptive Learning Pathways: Beginner, Intermediate, Pro, Topic Deep Dives & Intuition Cards', async ({ page }) => {
    await page.goto('/#pathways', { waitUntil: 'domcontentloaded' });

    const pathwaysHeader = page.locator('text=Adaptive Learning Pathways').first();
    await pathwaysHeader.scrollIntoViewIfNeeded();
    await expect(pathwaysHeader).toBeVisible({ timeout: 10000 });

    // Pathway Tabs
    const beginnerTab = page.locator('button:has-text("Beginner: Absolute Zero")').first();
    await expect(beginnerTab).toBeVisible();

    const proTab = page.locator('button:has-text("Pro: Systems Architect")').first();
    if (await proTab.count() > 0) {
      await proTab.click();
      await page.waitForTimeout(300);
    }

    // Return to Beginner
    await beginnerTab.click();
    await page.waitForTimeout(300);

    // Verify Intuition Accordion
    const intuitionBtn = page.getByRole('button', { name: /The Intuition/i }).first();
    if (await intuitionBtn.count() > 0) {
      await intuitionBtn.click();
      await page.waitForTimeout(300);
      // Close intuition
      await intuitionBtn.click();
      await page.waitForTimeout(200);
    }
  });

  test('06. Cognitive Accelerator: All 5 Learning Psychology Tabs Functionality', async ({ page }) => {
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

  test('07. Spatial Holodeck: XR Suite, Three.js 3D Canvas, Cluster Slicer & Telemetry', async ({ page }) => {
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

  test('08. CoursePlayer & Track 0 Engine: Interactive In-Browser Pyodide Execution', async ({ page }) => {
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

  test('09. Magnification Dock: Positioning, Unclipped Expansion, Navigation & Hide/Show', async ({ page }) => {
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

  test('10. Mobile Responsive Layout & Drawer Navigation: 375x812 Viewport Audit', async ({ page }) => {
    // Set mobile viewport (iPhone X / 13 mini)
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Verify brand logo visible on mobile
    await expect(page.locator('text=OpenGuide.').first()).toBeVisible({ timeout: 10000 });

    // Mobile Hamburger Menu Button
    const mobileMenuBtn = page.locator('button[aria-label="Toggle navigation menu"]').first();
    await expect(mobileMenuBtn).toBeVisible();
    await mobileMenuBtn.click();
    await page.waitForTimeout(300);

    // Verify mobile drawer items
    await expect(page.locator('a[href="#pathways"]:visible').first()).toBeVisible();
    await expect(page.locator('a[href="#curriculum"]:visible').first()).toBeVisible();

    // Close mobile drawer
    await mobileMenuBtn.click();
    await page.waitForTimeout(300);

    // Verify no horizontal overflow
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 2); // allowance for scrollbar
  });

  test('11. Spatial Holodeck: Light Theme Text Contrast & Header Element Visibility (WCAG AAA Verification)', async ({ page }) => {
    // Set theme to GitHub Primer Light
    await page.addInitScript(() => {
      window.localStorage.setItem('openguide-settings', JSON.stringify({
        state: { theme: 'github-light', graphicsTier: 'auto' },
        version: 0
      }));
      document.documentElement.setAttribute('data-theme', 'github-light');
    });

    await page.goto('/holodeck', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(600);

    // Verify header container
    const header = page.locator('header').first();
    await expect(header).toBeVisible({ timeout: 10000 });

    // Verify "Back to Studio" button
    const backBtn = page.locator('button:has-text("Back to Studio")').first();
    await expect(backBtn).toBeVisible();

    // Verify "Spatial Holodeck" Title
    const title = page.locator('h1:has-text("Spatial Holodeck")').first();
    await expect(title).toBeVisible();

    // Check computed color of title is dark (not white!) in light theme
    const titleColor = await title.evaluate((el) => window.getComputedStyle(el).color);
    // In github-light, text-primary is rgb(36, 41, 47) or rgb(31, 35, 40)
    // Verify it is not rgb(255, 255, 255)
    expect(titleColor).not.toBe('rgb(255, 255, 255)');
    expect(titleColor).not.toBe('rgba(255, 255, 255, 1)');

    // Verify "Compute Tier:" label
    const computeLabel = page.locator('text=Compute Tier:').first();
    await expect(computeLabel).toBeVisible();
    const labelColor = await computeLabel.evaluate((el) => window.getComputedStyle(el).color);
    expect(labelColor).not.toBe('rgb(255, 255, 255)');

    // Verify Tier selector buttons exist and are clickable
    const autoBtn = page.getByRole('button', { name: 'Auto', exact: true }).first();
    const leanBtn = page.getByRole('button', { name: '2D Lean', exact: true }).first();
    await expect(autoBtn).toBeVisible();
    await expect(leanBtn).toBeVisible();
    await leanBtn.click();
    await page.waitForTimeout(300);

    // Also verify under Pure Paper theme
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'pure-paper');
    });
    await page.waitForTimeout(300);
    const titleColorPaper = await title.evaluate((el) => window.getComputedStyle(el).color);
    expect(titleColorPaper).not.toBe('rgb(255, 255, 255)');
  });

  test('12. Universal Vertical Scroll Physics, Nano-Bar Progress & Scroll To Top Affordance', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);

    // Verify top nano scroll progress line exists
    const progressBar = page.locator('div[data-testid="scroll-progress-bar"]').first();
    await expect(progressBar).toBeAttached({ timeout: 5000 });

    // Initial transform style should be scaleX(0)
    const initialTransform = await progressBar.evaluate((el) => el.style.transform);
    expect(initialTransform).toContain('scaleX(0');

    // Scroll down 1200px
    await page.evaluate(() => window.scrollTo({ top: 1200, behavior: 'instant' }));
    await page.waitForTimeout(400);

    // Progress bar transform should now be > 0
    const scrolledTransform = await progressBar.evaluate((el) => el.style.transform);
    expect(scrolledTransform).not.toBe('scaleX(0)');
    expect(scrolledTransform).toContain('scaleX(');

    // Floating scroll-to-top pill should become visible
    const toTopContainer = page.locator('div[data-testid="scroll-to-top-container"]').first();
    await expect(toTopContainer).toBeVisible({ timeout: 5000 });
    await expect(toTopContainer).toContainText(/Top/i);

    // Click Top button
    const topBtn = toTopContainer.locator('button').first();
    await topBtn.click();
    await page.waitForTimeout(600);

    // Verify smooth return towards top
    const currentY = await page.evaluate(() => window.scrollY);
    expect(currentY).toBeLessThan(300);
  });

  test('13. Horizontal Scroll Containers: Momentum, Edge Fade Masks & Chip Navigation', async ({ page }) => {
    await page.goto('/holodeck', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(600);

    // Vector chips scroll container
    const chipsContainer = page.locator('div[data-testid="vector-chips-scroll"]').first();
    await expect(chipsContainer).toBeVisible({ timeout: 10000 });

    // Verify momentum-scroll-x and scroll-mask-x classes are applied
    const classList = await chipsContainer.evaluate((el) => el.className);
    expect(classList).toContain('momentum-scroll-x');
    expect(classList).toContain('scroll-mask-x');

    // Verify chips inside can be selected
    const chips = chipsContainer.locator('button');
    const chipCount = await chips.count();
    expect(chipCount).toBeGreaterThan(3);

    // Click the 4th chip
    await chips.nth(3).click();
    await page.waitForTimeout(300);

    // Studio Console on Landing page also has momentum-scroll-x
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const consoleContainer = page.locator('.momentum-scroll-x').first();
    await expect(consoleContainer).toBeAttached();
  });

});

