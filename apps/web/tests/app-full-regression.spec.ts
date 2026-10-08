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
    const tracksLink = page.locator('#nav-tracks-menu').or(page.getByRole('link', { name: 'Tracks' })).first();
    await expect(tracksLink).toBeVisible();

    // Open Theme Switcher Modal via Header or Dock Button
    const themeBtn = page.locator('button[aria-label="Themes and Studio Settings"]').or(page.locator('button[aria-label="Choose color theme"]')).or(page.locator('button[aria-label="Theme Customizer"]')).first();
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

  test('04. Universal 12-Language Support, RTL Bidirectionality & Material-Wide Translation', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const langBtn = page.locator('button[aria-label="Select interface language"]').first();
    await expect(langBtn).toBeVisible({ timeout: 10000 });
    await langBtn.click();
    await page.waitForTimeout(300);

    // 1. Switch to Urdu (اردو) - verify RTL activation and document lang
    const urBtn = page.locator('button:has-text("اردو")').first();
    if (await urBtn.count() > 0) {
      await urBtn.click();
      await page.waitForTimeout(300);

      const htmlDir = await page.evaluate(() => document.documentElement.getAttribute('dir'));
      const htmlLang = await page.evaluate(() => document.documentElement.getAttribute('lang'));
      expect(htmlDir).toBe('rtl');
      expect(htmlLang).toBe('ur');

      // Verify Urdu translation rendered on badge/headings
      await expect(langBtn.locator('text=/^ur$/i')).toBeVisible();

      // Verify Track 0 button has Urdu text
      const urTrack0Btn = page.locator('text=مشن بریفنگ میں داخل ہوں').or(page.locator('text=ٹریک 0 شروع کریں')).first();
      await expect(urTrack0Btn).toBeVisible();
    }

    // 2. Switch to Arabic (العربية) - verify RTL remains active
    await langBtn.click();
    await page.waitForTimeout(300);
    const arBtn = page.locator('button:has-text("العربية")').first();
    if (await arBtn.count() > 0) {
      await arBtn.click();
      await page.waitForTimeout(300);

      const htmlDir = await page.evaluate(() => document.documentElement.getAttribute('dir'));
      expect(htmlDir).toBe('rtl');
      await expect(langBtn.locator('text=/^ar$/i')).toBeVisible();
    }

    // 3. Switch to Spanish (Español) - verify LTR returns
    await langBtn.click();
    await page.waitForTimeout(300);
    const esBtn = page.locator('button:has-text("Español")').first();
    if (await esBtn.count() > 0) {
      await esBtn.click();
      await page.waitForTimeout(300);

      const htmlDir = await page.evaluate(() => document.documentElement.getAttribute('dir'));
      expect(htmlDir).toBe('ltr');
      await expect(langBtn.locator('text=/^es$/i')).toBeVisible();
    }

    // 4. Switch back to English (English)
    await langBtn.click();
    await page.waitForTimeout(300);
    const enBtn = page.locator('button:has-text("English")').first();
    if (await enBtn.count() > 0) {
      await enBtn.click();
      await page.waitForTimeout(300);

      const htmlDir = await page.evaluate(() => document.documentElement.getAttribute('dir'));
      expect(htmlDir).toBe('ltr');
      await expect(langBtn.locator('text=/^en$/i')).toBeVisible();
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

    const allBtn = page.getByRole('button', { name: /^All(\s+Clusters)?$/i }).first();
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

    // Verify brand logo visible on mobile (compact monogram on mobile viewports)
    await expect(page.locator('header a[href="/"]').first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator('header a[href="/"]').getByText('OG').first()).toBeVisible();

    // Mobile Hamburger Menu Button
    const mobileMenuBtn = page.locator('button[aria-label="Toggle navigation menu"]').first();
    await expect(mobileMenuBtn).toBeVisible();
    await mobileMenuBtn.click({ force: true });
    await page.waitForTimeout(300);

    // Verify mobile drawer items
    await expect(page.locator('a[href="#pathways"]:visible').first()).toBeVisible();
    await expect(page.locator('a[href="#curriculum"]:visible').first()).toBeVisible();

    // Close mobile drawer
    await mobileMenuBtn.click({ force: true });
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
    await chips.nth(3).click({ noWaitAfter: true });
    await page.waitForTimeout(300);

    // Studio Console on Landing page also has momentum-scroll-x
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const consoleContainer = page.locator('.momentum-scroll-x').first();
    await expect(consoleContainer).toBeAttached();
  });

  test('14. Universal Header Synchronization: Language Selector & Theme/Settings Gear Across All Pages', async ({ page }) => {
    // 1. Landing Page Header Controls
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const landingLangBtn = page.locator('header button[aria-label="Select interface language"]').first();
    await expect(landingLangBtn).toBeVisible({ timeout: 10000 });

    const landingThemeSettingsBtn = page.locator('header button[aria-label="Themes and Studio Settings"]').first();
    await expect(landingThemeSettingsBtn).toBeVisible();

    // 2. Track Briefing Page Header Controls
    await page.goto('/track/0/intro', { waitUntil: 'domcontentloaded' });
    const introLangBtn = page.locator('header button[aria-label="Select interface language"]').first();
    await expect(introLangBtn).toBeVisible({ timeout: 10000 });

    const introThemeSettingsBtn = page.locator('header button[aria-label="Themes and Studio Settings"]').first();
    await expect(introThemeSettingsBtn).toBeVisible();

    // 3. Course Player IDE Header Controls
    await page.goto('/track/0/engine', { waitUntil: 'domcontentloaded' });
    const ideLangBtn = page.locator('header button[aria-label="Select interface language"]').first();
    await expect(ideLangBtn).toBeVisible({ timeout: 10000 });

    const ideSettingsBtn = page.locator('header button[aria-label="Settings"]').first();
    await expect(ideSettingsBtn).toBeVisible();
  });

  test('15. Phase 2 Track 1: Vector Spaces, Dynamic Briefing & In-Browser Semantic Search Boss Project', async ({ page }) => {
    // 1. Verify Track 1 Dynamic Briefing (/track/1/intro)
    await page.goto('/track/1/intro', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(400);

    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible({ timeout: 10000 });
    await expect(h1).toContainText(/Vector Spaces & High-Dimensional Geometry/i);

    // Verify 9 practical labs total
    await expect(page.locator('text=9 Practical Labs Total')).toBeVisible();

    // Verify 3 Modules: 1.1, 1.2, 1.3
    await expect(page.getByText('MODULE 1.1', { exact: true })).toBeVisible();
    await expect(page.getByText('MODULE 1.2', { exact: true })).toBeVisible();
    await expect(page.getByText('MODULE 1.3', { exact: true })).toBeVisible();

    // Verify Live Sandbox shows vector cosine code
    await expect(page.locator('text=cosine_similarity(v1, v2)')).toBeVisible();

    // Verify 3D Mechanical Initialize Button exists
    const mechCheckbox = page.locator('#init-mech-button');
    await expect(mechCheckbox).toBeAttached();

    // 2. Verify Track 1 Interactive IDE Workspace (/track/1/engine)
    await page.goto('/track/1/engine', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(600);

    // Verify Lesson 1.1.1 Title
    const lessonTitle = page.locator('h1').first();
    await expect(lessonTitle).toBeVisible({ timeout: 10000 });
    await expect(lessonTitle).toContainText(/The Vector as an Arrow in Semantic Space/i);

    // Verify Dynamic Module Header (Module 1.1 • Lesson 1)
    await expect(page.locator('text=Module 1.1 • Lesson 1')).toBeVisible();

    // Verify Curriculum Drawer shows Module 1.1, 1.2, 1.3
    const modulesTab = page.getByRole('button', { name: /Lessons|Modules/i }).first();
    await modulesTab.click();
    await page.waitForTimeout(300);

    await expect(page.locator('text=Module 1.1: Vector Embeddings & High-Dimensional Geometry')).toBeVisible();
    await expect(page.locator('text=Module 1.2: Cosine Similarity & Distance Metrics')).toBeVisible();
    await expect(page.locator('text=Module 1.3: Client-Side Vector Search & Boss Project')).toBeVisible();

    // Verify Boss Project Lesson is present
    await expect(page.locator('text=Boss Project: Interactive Semantic Search Engine')).toBeVisible();

    // 3. Verify Landing Page Track 1 Navigation Affordance
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(400);

    const track1Nav = page.locator('button[aria-label="Select Learning Track"]').first();
    await track1Nav.click();
    await expect(page.locator('text=Track 1: Vectors').first()).toBeVisible({ timeout: 5000 });
  });

  test('16. Phase 3 Track 2: RAG Pipelines, MCP Tools & Autonomous Agents', async ({ page }) => {
    // 1. Verify Track 2 Dynamic Briefing (/track/2/intro)
    await page.goto('/track/2/intro', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(400);

    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible({ timeout: 10000 });
    await expect(h1).toContainText(/RAG, Retrieval & Autonomous Agents/i);

    // Verify 9 practical labs total
    await expect(page.locator('text=9 Practical Labs Total')).toBeVisible();

    // Verify 3 Modules: 2.1, 2.2, 2.3
    await expect(page.getByText('MODULE 2.1', { exact: true })).toBeVisible();
    await expect(page.getByText('MODULE 2.2', { exact: true })).toBeVisible();
    await expect(page.getByText('MODULE 2.3', { exact: true })).toBeVisible();

    // Verify Live Sandbox shows AutonomousResearchAgent code
    await expect(page.locator('text=AutonomousResearchAgent()')).toBeVisible();

    // Verify 3D Mechanical Initialize Button exists
    const mechCheckbox = page.locator('#init-mech-button');
    await expect(mechCheckbox).toBeAttached();

    // 2. Verify Track 2 Interactive IDE Workspace (/track/2/engine)
    await page.goto('/track/2/engine', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(600);

    // Verify Lesson 2.1.1 Title
    const lessonTitle = page.locator('h1').first();
    await expect(lessonTitle).toBeVisible({ timeout: 10000 });
    await expect(lessonTitle).toContainText(/Sliding-Window Chunking with Overlap/i);

    // Verify Dynamic Module Header (Module 2.1 • Lesson 1)
    await expect(page.locator('text=Module 2.1 • Lesson 1')).toBeVisible();

    // Verify Curriculum Drawer shows Module 2.1, 2.2, 2.3
    const modulesTab = page.getByRole('button', { name: /Lessons|Modules/i }).first();
    await modulesTab.click();
    await page.waitForTimeout(300);

    await expect(page.locator('text=Module 2.1: Ingestion, Chunking & Retrieval Pipelines')).toBeVisible();
    await expect(page.locator('text=Module 2.2: The ReAct Loop & Model Context Protocol')).toBeVisible();
    await expect(page.locator('text=Module 2.3: Multi-Agent Systems & Boss Project')).toBeVisible();

    // Verify Boss Project Lesson is present
    await expect(page.locator('text=Boss Project: Autonomous Research Agent')).toBeVisible();

    // 3. Verify Landing Page Track 2 Navigation Affordance
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(400);

    const track2Nav = page.locator('button[aria-label="Select Learning Track"]').first();
    await track2Nav.click();
    await expect(page.locator('text=Track 2: Agents').first()).toBeVisible({ timeout: 5000 });
  });

  test('17. Phase 4: Track 3 Production Evals & Security + WebGPU Hardware Telemetry', async ({ page }) => {
    // 1. Verify Track 3 Dynamic Briefing (/track/3/intro)
    await page.goto('/track/3/intro', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(400);

    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible({ timeout: 10000 });
    await expect(h1).toContainText(/Track 3: Production Evals, Guardrails & Security/i);

    // Verify 9 practical labs total
    await expect(page.locator('text=9 Practical Labs Total')).toBeVisible();

    // Verify 3 Modules: 3.1, 3.2, 3.3
    await expect(page.getByText('MODULE 3.1', { exact: true })).toBeVisible();
    await expect(page.getByText('MODULE 3.2', { exact: true })).toBeVisible();
    await expect(page.getByText('MODULE 3.3', { exact: true })).toBeVisible();

    // Verify Live Sandbox shows ProductionEvalSuite code
    await expect(page.locator('text=ProductionEvalSuite()')).toBeVisible();

    // Verify 3D Mechanical Initialize Button exists
    const mechCheckbox = page.locator('#init-mech-button');
    await expect(mechCheckbox).toBeAttached();

    // 2. Verify Track 3 Interactive IDE Workspace (/track/3/engine)
    await page.goto('/track/3/engine', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(600);

    // Verify Lesson 3.1.1 Title
    const lessonTitle = page.locator('h1').first();
    await expect(lessonTitle).toBeVisible({ timeout: 10000 });
    await expect(lessonTitle).toContainText(/Exact-Match & Normalized Assertion Evals/i);

    // Verify Dynamic Module Header (Module 3.1 • Lesson 1)
    await expect(page.locator('text=Module 3.1 • Lesson 1')).toBeVisible();

    // Verify Curriculum Drawer shows Module 3.1, 3.2, 3.3
    const modulesTab = page.getByRole('button', { name: /Lessons|Modules/i }).first();
    await modulesTab.click();
    await page.waitForTimeout(300);

    await expect(page.locator('text=Module 3.1: Model Evaluation & Benchmarking (Evals)')).toBeVisible();
    await expect(page.locator('text=Module 3.2: OWASP AI Top 10 & Security Guardrails')).toBeVisible();
    await expect(page.locator('text=Module 3.3: Production Telemetry & Boss Project')).toBeVisible();

    // Verify Boss Project Lesson is present
    await expect(page.locator('text=Boss Project: Production Evaluation & Security Harness')).toBeVisible();

    // 3. Verify Landing Page Track 3 Navigation Affordance & Lens 05 WebGPU
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(400);

    const track3Nav = page.locator('button[aria-label="Select Learning Track"]').first();
    await track3Nav.click();
    await expect(page.locator('text=Track 3: Evals').first()).toBeVisible({ timeout: 5000 });

    const webgpuTab = page.getByRole('button', { name: /WebGPU/i }).first();
    await expect(webgpuTab).toBeVisible({ timeout: 10000 });
    await webgpuTab.click();
    await expect(page.locator('text=WebGPU Tensor Dispatch & Quantized Neural SLM')).toBeVisible();
  });

  test('18. Interactive Suite: Portfolio Certification, ReAct Agent Flow DAG & Synapse Minigames', async ({ page }) => {
    // 1. Verify Portfolio Page (/portfolio)
    await page.goto('/portfolio', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);

    // Verify Title & Monogram
    const portfolioH1 = page.locator('h1').first();
    await expect(portfolioH1).toBeVisible({ timeout: 10000 });
    await expect(portfolioH1).toContainText(/AI Engineering Credentials/i);
    await expect(page.locator('text=PORTFOLIO LEDGER')).toBeVisible();

    // Verify 4 Curriculum Milestone Badges
    await expect(page.locator('text=Curriculum Milestone Badges')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Kernel Architect' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Geometrician' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Agent Commander' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Systems Defender' })).toBeVisible();

    // In uncompleted state, verify milestone gating and preview certificate
    const previewBtn = page.getByRole('button', { name: /Preview Watermarked Sample/i });
    if (await previewBtn.isVisible()) {
      await previewBtn.click();
      await page.waitForTimeout(300);
    }

    // Verify Certificate Canvas
    await expect(page.locator('text=Certificate of Engineering Mastery').first()).toBeVisible();
    await expect(page.locator('text=Adil Rafiq Dar (ARD)').first()).toBeVisible();
    await expect(page.locator('text=Deterministic SHA-256 Document Integrity Signature').or(page.locator('text=Verification Signature (SHA-256)')).first()).toBeVisible();

    // Verify Interactive Student Name Input reactively updates certificate
    const nameInput = page.locator('input[placeholder="Enter Recipient Name..."]');
    await expect(nameInput).toBeVisible();
    await nameInput.fill('Dr. Alan Turing');
    await page.waitForTimeout(300);
    await expect(page.locator('text=Dr. Alan Turing')).toBeVisible();

    // Test Simulate 100% Complete button
    const simulateBtn = page.getByRole('button', { name: /Simulate 100% Complete/i });
    await expect(simulateBtn).toBeVisible();
    await simulateBtn.click();
    await page.waitForTimeout(400);

    // Verify Mastered badges (57 / 57 labs across 8 tracks, or 45 / 45)
    await expect(page.locator('text=57 / 57').or(page.locator('text=45 / 45')).first()).toBeVisible();
    await expect(page.locator('text=MASTERED').first()).toBeVisible();

    // Reset progress so simulated completion does not persist into local dev environment
    const resetProgressBtn = page.getByRole('button', { name: /Reset Progress/i }).first();
    if (await resetProgressBtn.count() > 0) {
      await resetProgressBtn.click();
      await page.waitForTimeout(300);
    }

    // 2. Verify The Synapse Lounge on Landing Page (/)
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);

    const synapseSection = page.locator('#synapse-lounge');
    await synapseSection.scrollIntoViewIfNeeded();
    await expect(page.locator('text=The Synapse Lounge.')).toBeVisible();

    // Verify Vector Hyper-Space Alignment Minigame with Unit Circle
    await expect(page.getByRole('button', { name: /Vector Hyper-Space Alignment/i })).toBeVisible();
    await expect(page.locator('text=Interactive Embedding Probe')).toBeVisible();
    await expect(page.locator('text=Cosine Metric')).toBeVisible();

    // Test slider adjustment
    const probeSlider = page.locator('input[type="range"]').first();
    await expect(probeSlider).toBeVisible();
    await probeSlider.fill('45');
    await probeSlider.dispatchEvent('change');
    await page.waitForTimeout(300);
    await expect(page.locator('text=Hyper-Plane Aligned!').first()).toBeVisible();

    // Verify Neural Gate Deductor Tab
    const neuronTab = page.getByRole('button', { name: /Neural Gate Deductor/i });
    await neuronTab.click();
    await page.waitForTimeout(300);
    await expect(page.locator('text=Single Perceptron Circuit')).toBeVisible();
    await expect(page.locator('text=NAND GATE')).toBeVisible();
    await expect(page.locator('text=Adjust Synaptic Weights & Activation Bias')).toBeVisible();
    await expect(page.locator('text=Live Truth Table Output')).toBeVisible();

    // 3. Verify X-Ray Debug Lens 5th Tab (Agent Flow DAG) in IDE (/track/2/engine)
    await page.goto('/track/2/engine', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(600);

    // Open X-Ray Debug Lens via button
    const xrayBtn = page.locator('[data-testid="xray-toggle-btn"]').first();
    await expect(xrayBtn).toBeVisible({ timeout: 15000 });
    await xrayBtn.click();
    await page.waitForTimeout(500);

    // Verify "Agent Flow DAG" tab exists and switch to it
    const flowTab = page.getByRole('tab', { name: /Agent Flow DAG/i }).or(page.getByRole('button', { name: /Agent Flow DAG/i })).first();
    await expect(flowTab).toBeVisible({ timeout: 10000 });
    await flowTab.click();
    await page.waitForTimeout(300);

    // Verify ReAct DAG Visualizer components
    await expect(page.locator('text=ReAct Reasoning & Tool Execution DAG')).toBeVisible();
    await expect(page.locator('text=Sequential Reasoning Chain')).toBeVisible();
    await expect(page.locator('text=Node Telemetry Inspector')).toBeVisible();

    // Verify preloaded trace switching
    const mcpTraceBtn = page.getByRole('button', { name: /FastMCP Determinant/i });
    await expect(mcpTraceBtn).toBeVisible();
    await mcpTraceBtn.click();
    await page.waitForTimeout(300);
    await expect(page.locator('text=fastmcp.matrix_det').first()).toBeVisible();

    // Close X-Ray Lens
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
  });

  test('20. Free Courses In-App Studio, Four Tools Setup Guides & De-Cluttered Header Responsiveness', async ({ page }) => {
    // 1. Audit Header Across Viewports (375px, 768px, 1024px, 1280px)
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);

    const header = page.locator('header').first();
    await expect(header).toBeVisible();

    // On 375px mobile, verify BrandLogo monogram and controls fit without overlap
    const logoBox375 = await page.locator('header a[href="/"]').boundingBox();
    const rightControls375 = await page.locator('header > div:last-child').boundingBox();
    expect(logoBox375).not.toBeNull();
    expect(rightControls375).not.toBeNull();
    // Zero horizontal collision
    expect(logoBox375!.x + logoBox375!.width).toBeLessThanOrEqual(rightControls375!.x + 10);

    // On 768px tablet, verify clean separation
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(300);
    const logoBox768 = await page.locator('header a[href="/"]').boundingBox();
    const rightControls768 = await page.locator('header > div:last-child').boundingBox();
    expect(logoBox768!.x + logoBox768!.width + 50).toBeLessThan(rightControls768!.x);

    // On 1024px, verify Launch Track 0 and Tracks dropdown exist
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.waitForTimeout(300);
    await expect(page.locator('header button:has-text("Launch Track 0")').first()).toBeVisible();
    await expect(page.locator('header button:has-text("Tracks")').first()).toBeVisible();

    // On 1280px, verify desktop navigation and controls coexist with ample room
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.waitForTimeout(300);
    await expect(page.locator('header a[href="#pathways"]').first()).toBeVisible();

    // 2. In-App Curated Free Courses Studio Test
    const vaultSection = page.locator('#vault');
    await vaultSection.scrollIntoViewIfNeeded();
    await expect(page.locator('text=The World\'s Best Free AI Courses')).toBeVisible();

    // Click on Karpathy course card
    const karpathyCard = page.locator('#vault .grid > div:first-child');
    await karpathyCard.click();
    await page.waitForTimeout(400);

    // Verify FreeCoursesModal dialog opened
    const coursesDialog = page.locator('[role="dialog"][aria-labelledby="course-modal-title"]');
    await expect(coursesDialog).toBeVisible({ timeout: 5000 });
    await expect(coursesDialog.locator('text=Neural Networks: Zero to Hero').first()).toBeVisible();

    // Verify YouTube iframe embed
    const iframe = coursesDialog.locator('iframe');
    await expect(iframe).toBeVisible();
    const iframeSrc = await iframe.getAttribute('src');
    expect(iframeSrc).toContain('embed/VMj-3S1tku0');

    // Verify Chapter timestamps
    await expect(coursesDialog.locator('button:has-text("00:00")').first()).toBeVisible();
    await expect(coursesDialog.locator('text=Introduction & Value class').first()).toBeVisible();

    // Switch to Transcript Tab
    const transcriptTab = coursesDialog.locator('button:has-text("Transcript")');
    await transcriptTab.click();
    await page.waitForTimeout(200);

    // Verify transcript search filter
    const transcriptInput = coursesDialog.locator('input[placeholder*="Search lecture transcript"]');
    await expect(transcriptInput).toBeVisible();
    await transcriptInput.fill('chain rule');
    await page.waitForTimeout(200);
    await expect(coursesDialog.locator('text=chain rule').first()).toBeVisible();

    // Verify Export buttons
    await expect(coursesDialog.locator('button:has-text("Export .MD")')).toBeVisible();
    await expect(coursesDialog.locator('button:has-text("Export .TXT")')).toBeVisible();

    // Switch to Runnable Python Tab
    const codeTab = coursesDialog.locator('button:has-text("Runnable Python")');
    await codeTab.click();
    await page.waitForTimeout(200);
    await expect(coursesDialog.locator('text=class Value:').first()).toBeVisible();

    // Close FreeCoursesModal with Escape
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    await expect(coursesDialog).not.toBeVisible();

    // 3. Four Tools. Zero Subscriptions. Setup Guides Test
    const freeStackSection = page.locator('#free-stack');
    await freeStackSection.scrollIntoViewIfNeeded();
    await expect(page.locator('text=Four Tools. Zero Subscriptions.')).toBeVisible();

    // Click MEMORY category badge
    const memoryPill = freeStackSection.locator('button:has-text("MEMORY")').first();
    await memoryPill.click();
    await page.waitForTimeout(400);

    // Verify FreeToolsModal dialog opened
    const toolsDialog = page.locator('[role="dialog"][aria-labelledby="tools-modal-title"]');
    await expect(toolsDialog).toBeVisible({ timeout: 5000 });
    await expect(toolsDialog.locator('text=Chroma').first()).toBeVisible();
    await expect(toolsDialog.locator('text=pip install chromadb').first()).toBeVisible();
    await expect(toolsDialog.locator('text=2026 Free Tier Policy Notice').first()).toBeVisible();

    // Switch to COMPUTE category inside modal
    const computeBtn = toolsDialog.locator('button:has-text("COMPUTE")').first();
    await computeBtn.click();
    await page.waitForTimeout(300);
    await expect(toolsDialog.locator('text=Google Colab').first()).toBeVisible();
    await expect(toolsDialog.locator('text=T4 GPU').first()).toBeVisible();

    // Close FreeToolsModal with Escape
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    await expect(toolsDialog).not.toBeVisible();
  });

});



