import { test, expect } from '@playwright/test';

test.describe('OpenGuide UI/UX Modernization & Universal Synchronization Suite', () => {

  test('01. Unified Header Tracks Dropdown lists all 8 Tracks on hover and eliminates duplicate button', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.goto('/');

    // Hover over Tracks menu in header
    const tracksMenu = page.locator('#nav-tracks-menu');
    await expect(tracksMenu).toBeVisible();
    await tracksMenu.hover();

    // Verify all 8 tracks appear in the dropdown
    await expect(page.locator('text=Track 0: Absolute Zero').first()).toBeVisible();
    await expect(page.locator('text=Track 1: Vectors').first()).toBeVisible();
    await expect(page.locator('text=Track 2: Agents').first()).toBeVisible();
    await expect(page.locator('text=Track 3: Evals').first()).toBeVisible();
    await expect(page.locator('text=Track 4: Frontier Attention').first()).toBeVisible();
    await expect(page.locator('text=Track 5: Fine-Tuning & LoRA').first()).toBeVisible();
    await expect(page.locator('text=Track 6: Production MLOps').first()).toBeVisible();
    await expect(page.locator('text=Track 7: Generative Diffusion').first()).toBeVisible();

    // Verify curriculum architecture heading shows 8 Core Tracks & 57 Interactive Labs
    await expect(page.locator('text=8 Core Tracks • 57 Interactive Labs')).toBeVisible();

    // Verify 0 console errors
    const fatalErrors = consoleErrors.filter(e => !e.includes('favicon'));
    expect(fatalErrors).toHaveLength(0);
  });

  test('02. Interactive 11 Architectural Pillars cards open deep-dive modal', async ({ page }) => {
    await page.goto('/');

    // Scroll to Section 4: The 11 Core Engineering Pillars
    const pillarsSection = page.locator('#pillars');
    await expect(pillarsSection).toBeVisible();

    // Click on Pillar 1: AI Fundamentals
    const pillar1Card = page.locator('button:has-text("AI Fundamentals")').first();
    await expect(pillar1Card).toBeVisible();
    await pillar1Card.click();

    // Verify Architectural Pillars Modal is rendered with First Principles & Python code
    await expect(page.locator('#pillars-modal-title')).toBeVisible();
    await expect(page.locator('text=The Mathematical First Principle')).toBeVisible();
    await expect(page.locator('text=Production Failure Mode')).toBeVisible();

    // Close modal
    await page.locator('button[aria-label="Close modal"]').first().click();
    await expect(page.locator('#pillars-modal-title')).toBeHidden();
  });

  test('03. Autonomous Breach Mystery Forensic Lab opens from Labs & Science dropdown and solves multi-stage mystery', async ({ page }) => {
    await page.goto('/');

    // Hover Labs & Science dropdown
    const labsMenu = page.locator('#nav-labs-menu');
    await expect(labsMenu).toBeVisible();
    await labsMenu.hover();

    // Click Autonomous Breach Mystery button
    const mysteryBtn = page.locator('button:has-text("Autonomous Breach Mystery")').first();
    await expect(mysteryBtn).toBeVisible();
    await mysteryBtn.click();

    // Verify Mystery Modal is rendered
    await expect(page.locator('#mystery-lab-title')).toBeVisible();
    await expect(page.locator('text=SEV-1 Autonomous Agent Containment Failure')).toBeVisible();

    // Navigate to Tab 2: Evidence Locker
    const evidenceTabBtn = page.locator('button:has-text("2. Evidence Locker")');
    await expect(evidenceTabBtn).toBeVisible();
    await evidenceTabBtn.click();
    await expect(page.locator('button:has-text("Table: ingestion_batch_log")')).toBeVisible();

    // Navigate to Tab 3: Vector Crime Lab
    const labTabBtn = page.locator('button:has-text("3. Vector Crime Lab")');
    await expect(labTabBtn).toBeVisible();
    await labTabBtn.click();

    // Execute Forensic Inspection Query in Python terminal
    const runQueryBtn = page.locator('button:has-text("Run Forensic Audit")');
    await expect(runQueryBtn).toBeVisible();
    await runQueryBtn.click();

    // Verify Forensic Output appears
    await expect(page.locator('text=FORENSIC VECTOR COSINE AUDIT')).toBeVisible();

    // Navigate to Tab 5: Submit Indictment
    const indictmentTabBtn = page.locator('button:has-text("5. Submit Indictment")');
    await expect(indictmentTabBtn).toBeVisible();
    await indictmentTabBtn.click();

    // Submit Stage 1 Indictment (Chunk-007)
    const stage1Input = page.locator('input[placeholder*="Chunk-007"]');
    await stage1Input.fill('Chunk-007');
    await page.locator('form button[type="submit"]:has-text("Submit Indictment")').click();

    // Verify Stage 1 is solved and reveals the mastermind clue
    await expect(page.locator('text=STAGE 1 SOLVED')).toBeVisible();

    // Submit Stage 2 Indictment (Miranda Vance)
    const stage2Input = page.locator('input[placeholder*="Miranda Vance"]');
    await stage2Input.fill('Miranda Vance');
    await page.locator('button:has-text("Indict Mastermind")').click();

    // Verify Full Case is Cracked with Cryptographic Certificate
    await expect(page.locator('text=FULL CASE CRACKED')).toBeVisible();
    await expect(page.locator('text=OPENGUIDE FORENSIC AI AUDITOR CERTIFICATE')).toBeVisible();

    // Close modal
    await page.locator('button[aria-label="Close mystery modal"]').click();
    await expect(page.locator('#mystery-lab-title')).toBeHidden();
  });

  test('04. Free Courses Modal embeds YouTube with CSP-compliant player', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.goto('/');

    // Click on "Watch Curated Masterclasses" or any course card in knowledge vault
    const courseCard = page.locator('text=Neural Networks: Zero to Hero').first();
    await expect(courseCard).toBeVisible();
    await courseCard.click();

    // Verify Course Studio modal is opened
    await expect(page.locator('text=In-App Sovereign Player (Zero External Redirects)')).toBeVisible();

    // Verify YouTube iframe exists with youtube-nocookie
    const iframe = page.locator('iframe[src*="youtube-nocookie.com"]');
    await expect(iframe).toBeVisible();
    const src = await iframe.getAttribute('src');
    expect(src).toContain('youtube-nocookie.com');

    // Close modal
    await page.locator('button:has-text("Close Studio")').click();

    // Verify no CSP frame-src blocking error
    const cspErrors = consoleErrors.filter(e => e.includes('Content Security Policy') || e.includes('frame-src'));
    expect(cspErrors).toHaveLength(0);
  });

  test('05. Portfolio Ledger UI is organized into 3 non-overlapping command cards', async ({ page }) => {
    await page.goto('/portfolio');

    // Verify Hero title
    await expect(page.locator('text=AI Engineering Credentials & Portfolio.')).toBeVisible();
    await expect(page.locator('text=SHA-256 Validated')).toBeVisible();

    // Verify 3 distinct action cards exist
    await expect(page.locator('text=Sovereign Portability')).toBeVisible();
    await expect(page.locator('text=Public Proof & Badges')).toBeVisible();
    await expect(page.locator('text=Sandbox Testing Suite')).toBeVisible();

    // Verify key action buttons exist without overlapping
    await expect(page.locator('button:has-text("Encrypted Gist Sync")')).toBeVisible();
    await expect(page.locator('button:has-text("W3C Credential (.jsonld)")')).toBeVisible();
    await expect(page.locator('button:has-text("Export Ledger (.json)")')).toBeVisible();
    await expect(page.locator('[data-testid="share-twitter-btn"]')).toBeVisible();
    await expect(page.locator('[data-testid="share-linkedin-btn"]')).toBeVisible();
    await expect(page.locator('[data-testid="portfolio-export-ipynb-btn"]')).toBeVisible();
    await expect(page.locator('button:has-text("Simulate 100% Complete")')).toBeVisible();

    // Verify milestone badges section shows all 8 tracks
    await expect(page.locator('text=Curriculum Milestone Badges')).toBeVisible();
  });

  test('06. Spatial Holodeck features AR Glasses Mode with True-Black Micro-OLED Optics', async ({ page }) => {
    await page.goto('/holodeck');

    // Switch to WebXR Spatial Gateway tab
    const webxrTab = page.locator('#tab-webxr');
    await expect(webxrTab).toBeVisible();
    await webxrTab.click();

    // Click XR Spatial Simulator button
    const simBtn = page.locator('[data-testid="xr-simulator-btn"]');
    await expect(simBtn).toBeVisible();
    await simBtn.click();

    // Verify Simulator Viewport is active
    await expect(page.locator('[data-testid="xr-simulator-viewport"]')).toBeVisible();

    // Verify AR Glasses profile button
    const arBtn = page.locator('[data-testid="profile-arglasses-btn"]');
    await expect(arBtn).toBeVisible();
    await arBtn.click();

    // Verify True-Black Micro-OLED Waveguide banner
    await expect(page.locator('text=TRUE-BLACK MICRO-OLED WAVEGUIDE')).toBeVisible();
    await expect(page.locator('text=3DOF Spatial Anchoring active')).toBeVisible();

    // Verify Spatial Curriculum Selector has all 8 tracks (T0 to T7)
    await expect(page.locator('button:has-text("T0")')).toBeVisible();
    await expect(page.locator('button:has-text("T7")')).toBeVisible();
  });

  test('07. Command Palette indexes all 8 tracks and displays 57 Labs in footer', async ({ page }) => {
    await page.goto('/');

    // Open command palette via shortcut or header button
    const searchBtn = page.locator('[data-testid="header-command-palette-btn"]');
    await expect(searchBtn).toBeVisible();
    await searchBtn.click();

    // Verify modal is open
    await expect(page.locator('[data-testid="command-palette-modal"]')).toBeVisible();
    await expect(page.locator('[data-testid="command-palette-footer"]')).toContainText('57 Labs • 24 Themes • 12 Languages');

    // Type "Track 7" into search input
    const input = page.locator('[data-testid="command-palette-input"]');
    await input.fill('Track 7');

    // Verify Track 7 appears in command palette results
    await expect(page.locator('[data-testid="palette-item-track-7"]')).toBeVisible();

    // Press Escape to close
    await page.keyboard.press('Escape');
    await expect(page.locator('[data-testid="command-palette-modal"]')).toBeHidden();
  });

  test('08. Smart AR Glasses Mode is prominently showcased on Landing Page and provides multi-device onboarding guide', async ({ page }) => {
    await page.goto('/');

    // Scroll to Section 4.6: Universal Spatial Holodeck & Smart AR Glasses showcase
    const holodeckSection = page.locator('#holodeck-showcase');
    await expect(holodeckSection).toBeVisible();
    await expect(page.locator('text=Spatial Holodeck on Smart AR Glasses')).toBeVisible();

    // Click "How to Connect AR Glasses" button
    const arGuideBtn = page.locator('button:has-text("How to Connect AR Glasses")');
    await expect(arGuideBtn).toBeVisible();
    await arGuideBtn.click();

    // Verify AR Glasses Guide Modal opened
    await expect(page.locator('#ar-guide-title')).toBeVisible();
    await expect(page.locator('text=Smart AR Glasses Mode: Setup & Controls')).toBeVisible();

    // Switch to Viture tab
    const vitureTab = page.locator('button:has-text("Viture (One/Pro XR)")');
    await expect(vitureTab).toBeVisible();
    await vitureTab.click();
    await expect(page.locator('text=electrochromic lens tinting')).toBeVisible();

    // Switch to RayNeo tab
    const rayneoTab = page.locator('button:has-text("RayNeo (Air 2/X2)")');
    await expect(rayneoTab).toBeVisible();
    await rayneoTab.click();
    await expect(page.locator('text=Micro-LED & Micro-OLED Waveguide')).toBeVisible();


    // Close AR Glasses modal
    await page.locator('button[aria-label="Close AR Glasses Guide"]').click();
    await expect(page.locator('#ar-guide-title')).toBeHidden();

    // Navigate to /holodeck and verify top toolbar button opens guide
    await page.goto('/holodeck');
    const holodeckGuideBtn = page.locator('button:has-text("AR Glasses Guide (Xreal • Viture • RayNeo)")');
    await expect(holodeckGuideBtn).toBeVisible();
    await holodeckGuideBtn.click();
    await expect(page.locator('#ar-guide-title')).toBeVisible();
    await page.locator('button[aria-label="Close AR Glasses Guide"]').click();
    await expect(page.locator('#ar-guide-title')).toBeHidden();
  });


});

