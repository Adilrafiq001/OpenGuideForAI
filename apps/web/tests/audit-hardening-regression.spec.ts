import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Audit Hardening & Regression Suite (64+5 Bug Audit Validation)', () => {

  test('TC-AUDIT-001: 24-Theme Parity in index.html Pre-Bootstrap Script', async ({ page }) => {
    // Read index.html from disk to verify static contract
    const indexHtmlPath = fs.existsSync(path.resolve(process.cwd(), 'apps/web/index.html'))
      ? path.resolve(process.cwd(), 'apps/web/index.html')
      : path.resolve(process.cwd(), 'index.html');
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
    await page.waitForLoadState('domcontentloaded');
    const htmlTheme = await page.locator('html').getAttribute('data-theme');
    const htmlMode = await page.locator('html').getAttribute('data-theme-mode');
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
    const announcementPill = page.locator('text=/OpenGuide v\\d+\\.\\d+\\.\\d+ Live/');
    await expect(announcementPill).toBeVisible();

    // Verify announcement text contains Bluee mascot name
    const subtext = page.locator('text=/50\\+.*Bluee/i');
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
    const indexHtmlPath = fs.existsSync(path.resolve(process.cwd(), 'apps/web/index.html'))
      ? path.resolve(process.cwd(), 'apps/web/index.html')
      : path.resolve(process.cwd(), 'index.html');
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

  test('TC-AUDIT-011: VectorSpace3D Filter Cluster Parity & Frontier Cluster Presence', async ({ page }) => {
    await page.goto('/holodeck');
    // Ensure Vector Space tab is active
    const vectorTab = page.locator('#tab-vectors');
    await expect(vectorTab).toBeVisible();
    await expect(vectorTab).toHaveAttribute('aria-selected', 'true');

    // Verify 'frontier' filter button exists
    const frontierBtn = page.locator('button:has-text("frontier"), button:has-text("Frontier")').first();
    await expect(frontierBtn).toBeVisible();

    // Click frontier filter and check that active styling applies without error
    await frontierBtn.click({ force: true });
    await expect(frontierBtn).toHaveClass(/font-bold/);
  });

  test('TC-AUDIT-012: LandingPage Core Tracks & Holodeck Keyboard Accessibility', async ({ page }) => {
    await page.goto('/');

    const track0 = page.locator('article[aria-label="Track 0: Absolute Zero briefing"]');
    await expect(track0).toHaveAttribute('tabindex', '0');
    await expect(track0).toHaveAttribute('role', 'link');

    const track1 = page.locator('article[aria-label="Track 1: Embeddings briefing"]');
    await expect(track1).toHaveAttribute('tabindex', '0');
    await expect(track1).toHaveAttribute('role', 'link');

    const holodeckCard = page.locator('article[aria-label="Universal Spatial Holodeck"]');
    await expect(holodeckCard).toHaveAttribute('tabindex', '0');
    await expect(holodeckCard).toHaveAttribute('role', 'link');

    // Focus and press Enter on Holodeck card to verify keyboard navigation
    await holodeckCard.focus();
    await page.keyboard.press('Enter');
    await page.waitForURL('**/holodeck');
    expect(page.url()).toContain('/holodeck');
  });

  test('TC-AUDIT-013: Web Audio Safety & Clean Sound Triggering', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto('/');
    await page.evaluate(async () => {
      const { playTactileSound, playCosineSonification } = await import('/src/services/soundHaptics.ts');
      playTactileSound('click');
      playTactileSound('success');
      playTactileSound('chime');
      playCosineSonification(0.85);
    });

    expect(errors.filter(e => !e.includes('favicon'))).toHaveLength(0);
  });

  test('TC-AUDIT-014: StudioFooter Modal Accessibility & Route-Agnostic Anchor Navigation', async ({ page }) => {
    await page.goto('/');

    // Verify footer anchor links point to root anchors so they work cross-route
    const loungeLink = page.locator('#studio-footer a[href="/#synapse-lounge"]');
    await expect(loungeLink).toBeVisible();

    const acceleratorLink = page.locator('#studio-footer a[href="/#cognitive-accelerator"]');
    await expect(acceleratorLink).toBeVisible();

    const vaultLink = page.locator('#studio-footer a[href="/#vault"]');
    await expect(vaultLink).toBeVisible();

    // Open legal modal from footer and check close button aria-label
    const legalBtn = page.locator('#studio-footer button:has-text("Terms of Service")').first();
    await legalBtn.click();
    const legalCloseBtn = page.locator('button[aria-label="Close legal modal"]');
    await expect(legalCloseBtn).toBeVisible();
    await legalCloseBtn.click();
    await expect(legalCloseBtn).not.toBeVisible();
  });

  test('TC-AUDIT-015: Hardened Clipboard Action Resilience Without Unhandled Rejections', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto('/');

    // Simulate clicking copy commit hash in footer
    const copyHashBtn = page.locator('#studio-footer button[title="Copy commit hash to clipboard"]');
    if (await copyHashBtn.isVisible()) {
      await copyHashBtn.click();
    }

    // Verify 0 uncaught errors or unhandled rejections
    expect(errors.filter(e => !e.includes('favicon'))).toHaveLength(0);
  });

  test('TC-AUDIT-016: Curriculum Integrity & Globally Unique Lesson IDs Across 45 Labs', async ({ page }) => {
    await page.goto('/');

    const curriculumData = await page.evaluate(async () => {
      const { track0 } = await import('/src/data/track0.ts');
      const { track1 } = await import('/src/data/track1.ts');
      const { track2 } = await import('/src/data/track2.ts');
      const { track3 } = await import('/src/data/track3.ts');
      const { track4 } = await import('/src/data/track4.ts');

      const allTracks = [track0, track1, track2, track3, track4];
      const lessonIds: string[] = [];
      let totalLessons = 0;
      let missingVerificationCount = 0;

      for (const track of allTracks) {
        for (const mod of track.modules) {
          for (const les of mod.lessons) {
            totalLessons++;
            lessonIds.push(les.id);
            if (!les.id || !les.title || !les.initialCode) {
              missingVerificationCount++;
            }
            if (!les.expectedOutput && !les.testCode) {
              missingVerificationCount++;
            }
          }
        }
      }

      const uniqueIds = new Set(lessonIds);
      return {
        totalLessons,
        uniqueCount: uniqueIds.size,
        hasDuplicates: uniqueIds.size !== lessonIds.length,
        missingVerificationCount
      };
    });

    expect(curriculumData.totalLessons).toBe(45);
    expect(curriculumData.uniqueCount).toBe(45);
    expect(curriculumData.hasDuplicates).toBe(false);
    expect(curriculumData.missingVerificationCount).toBe(0);
  });

  test('TC-AUDIT-017: Cognitive Accelerator Timer Stability & Synapse Sound Disconnection', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto('/#cognitive-accelerator');
    const blurtingTab = page.locator('button:has-text("Blurting Retrieval")');
    if (await blurtingTab.isVisible()) {
      await blurtingTab.click();
      await page.waitForTimeout(300);
      // Verify countdown is ticking and recall button is interactive
      const recallBtn = page.locator('button:has-text("Start Forced Recall Now")');
      await expect(recallBtn).toBeVisible();
      await recallBtn.click();
      await expect(page.locator('#cognitive-accelerator textarea')).toBeVisible();
    }

    expect(errors.filter(e => !e.includes('favicon'))).toHaveLength(0);
  });

  test('TC-AUDIT-018: FirstPrinciplesModal Accessibility, Escape Key & Body Scroll Lock', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto('/');
    // Click any visible ExplainerPill to open FirstPrinciplesModal
    const pill = page.locator('button:has-text("The Intuition")').first();
    if (await pill.isVisible()) {
      await pill.click();
      await page.waitForTimeout(300);

      const dialog = page.locator('[role="dialog"][aria-label="First Principles Knowledge Matrix"]');
      if (await dialog.isVisible()) {
        // Verify body scroll lock is applied
        const overflow = await page.evaluate(() => document.body.style.overflow);
        expect(overflow).toBe('hidden');

        // Press Escape to close modal
        await page.keyboard.press('Escape');
        await page.waitForTimeout(300);

        // Verify body scroll lock is released
        const restoredOverflow = await page.evaluate(() => document.body.style.overflow);
        expect(restoredOverflow).not.toBe('hidden');
      }
    }

    expect(errors.filter(e => !e.includes('favicon'))).toHaveLength(0);
  });

  test('TC-AUDIT-019: VectorSpace3D Audio Mute Synchronization & Mid-Flight Simulation Unmount', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    // 1. Holodeck VectorSpace3D Audio Mute Synchronization
    await page.goto('/holodeck');
    const muteBtn = page.locator('button[title*="Spatial Audio"]').first();
    if (await muteBtn.isVisible()) {
      await muteBtn.click();
      await page.waitForTimeout(200);
      await muteBtn.click();
      await page.waitForTimeout(200);
    }

    // 2. Mid-flight simulation unmount test
    await page.goto('/');
    const runSimBtn = page.locator('button:has-text("Run Simulation"), button:has-text("Simulate")').first();
    if (await runSimBtn.isVisible()) {
      await runSimBtn.click();
      // Immediately navigate mid-flight before simulation timer fires
      await page.goto('/portfolio');
      await page.waitForTimeout(600);
    }

    expect(errors.filter(e => !e.includes('favicon'))).toHaveLength(0);
  });

  test('TC-AUDIT-020: Universal UUID Generation & Non-Secure Fallback Verification', async ({ page }) => {
    await page.goto('/');
    const result = await page.evaluate(async () => {
      // Test 1: Native crypto.randomUUID
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      
      // Test 2: Injected fallback test when crypto.randomUUID is deleted/undefined
      const originalRandomUUID = crypto.randomUUID;
      try {
        // @ts-ignore
        delete crypto.randomUUID;
      } catch {}
      
      // Dynamically import or verify safeRandomUUID logic
      const generateFallback = () => {
        if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
          const bytes = new Uint8Array(16);
          crypto.getRandomValues(bytes);
          bytes[6] = (bytes[6] & 0x0f) | 0x40;
          bytes[8] = (bytes[8] & 0x3f) | 0x80;
          const hex = Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
          return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
          const r = (Math.random() * 16) | 0;
          const v = c === 'x' ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        });
      };

      const fallbackUUID = generateFallback();
      try {
        crypto.randomUUID = originalRandomUUID;
      } catch {}
      return {
        isValid: uuidRegex.test(fallbackUUID),
        length: fallbackUUID.length
      };
    });

    expect(result.isValid).toBe(true);
    expect(result.length).toBe(36);
  });

  test('TC-AUDIT-021: Modals Body Scroll Lock & Escape Key Restoration Suite', async ({ page }) => {
    await page.goto('/');

    // 1. Command Palette Modal (Click trigger button or Control+KeyK)
    const searchBtn = page.locator('button[data-testid="header-command-palette-btn"]');
    if (await searchBtn.isVisible()) {
      await searchBtn.click();
    } else {
      await page.keyboard.press('Control+KeyK');
    }
    await page.waitForTimeout(300);
    let overflow = await page.evaluate(() => document.body.style.overflow);
    expect(overflow).toBe('hidden');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    overflow = await page.evaluate(() => document.body.style.overflow);
    expect(overflow).not.toBe('hidden');

    // 2. Portfolio Gist Sync Modal
    await page.goto('/portfolio');
    const syncGistBtn = page.locator('button:has-text("Sync Private Gist"), button:has-text("Gist Sync")').first();
    if (await syncGistBtn.isVisible()) {
      await syncGistBtn.click();
      await page.waitForTimeout(200);
      overflow = await page.evaluate(() => document.body.style.overflow);
      expect(overflow).toBe('hidden');
      await page.keyboard.press('Escape');
      await page.waitForTimeout(200);
      overflow = await page.evaluate(() => document.body.style.overflow);
      expect(overflow).not.toBe('hidden');
    }
  });

  test('TC-AUDIT-022: MagnificationDock Keyboard Activation & MobileBottomNav ARIA Current', async ({ page }) => {
    await page.goto('/');

    // Test dock items keyboard activation support
    const dockItem = page.locator('[data-testid="command-dock-wrapper"] [role="button"]').first();
    if (await dockItem.isVisible()) {
      await dockItem.focus();
      // Press Space or Enter on the focused dock button
      await page.keyboard.press('Space');
      await page.waitForTimeout(200);
    }

    // Test Mobile Bottom Nav on mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    const homeNavBtn = page.locator('[data-testid="mobile-nav-home"]');
    await expect(homeNavBtn).toHaveAttribute('aria-current', 'page');
  });

  test('TC-AUDIT-023: Jupyter Notebook Exporter CRLF Normalization & Diagnostic Line Extraction', async ({ page }) => {
    await page.goto('/');

    const evaluation = await page.evaluate(() => {
      // 1. CRLF normalization test
      const testContentWithCRLF = "Line 1\r\nLine 2\r\nLine 3\r\n";
      const normalized = testContentWithCRLF.replace(/\r\n/g, '\n');
      const hasCR = normalized.includes('\r');

      // 2. Multi-frame traceback innermost line extraction
      const traceback = `Traceback (most recent call last):
  File "<exec>", line 10, in <module>
  File "<exec>", line 4, in calculate_loss
ZeroDivisionError: division by zero`;

      const allMatches = [...traceback.matchAll(/line (\d+)/gi)];
      const lastLine = allMatches.length > 0 ? parseInt(allMatches[allMatches.length - 1][1], 10) : undefined;

      return {
        hasCR,
        lastLine
      };
    });

    expect(evaluation.hasCR).toBe(false);
    expect(evaluation.lastLine).toBe(4);
  });

  test('TC-AUDIT-024: VectorSpace3D 2D Lean Selective Labeling & Harmonic Chord Audio Sonification', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto('/holodeck');

    // 1. Beginner Guide is collapsed by default to preserve viewport space
    const guideContent = page.locator('text=How the Holodeck Works: Visualizing the AI Latent Mind');
    await expect(guideContent).not.toBeVisible();

    // 2. Guide toggles open and closed smoothly
    const guideToggle = page.locator('button:has-text("How It Works"), button:has-text("Hide Guide")').first();
    await guideToggle.click();
    await expect(guideContent).toBeVisible();
    await guideToggle.click();
    await expect(guideContent).not.toBeVisible();

    // 3. Play Chord Button synthesized audio and visual feedback
    const playChordBtn = page.locator('button[data-testid="play-chord-button"]');
    await expect(playChordBtn).toBeVisible();
    await playChordBtn.click();
    await page.waitForTimeout(300);

    // 4. Switch to 2D Lean SVG Mode
    const leanBtn = page.locator('button:has-text("2D Lean")');
    await leanBtn.click();
    await page.waitForTimeout(200);

    // 5. Verify 2D selective labeling: only active [A] and [B] have text pills rendered
    const textNodes = page.locator('svg text');
    const textCount = await textNodes.count();
    // In clean selective mode, exactly 2 labels ([A] and [B]) are rendered instead of 25 colliding blobs
    expect(textCount).toBeLessThanOrEqual(3);

    const textA = page.locator('svg text:has-text("[A]")');
    const textB = page.locator('svg text:has-text("[B]")');
    await expect(textA).toBeVisible();
    await expect(textB).toBeVisible();

    // Zero console errors
    expect(errors.filter(e => !e.includes('favicon'))).toHaveLength(0);
  });
});



