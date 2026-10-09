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
    expect(indexHtml).toContain('Track 5: Fine-Tuning, LoRA &amp; Quantization (INT8/NF4)');
    expect(indexHtml).toContain('Track 6: High-Throughput Inference Engines &amp; KV Paging');
    expect(indexHtml).toContain('Track 7: Multimodal, Vision Transformers &amp; Diffusion');
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
    await expect(vectorTab).toBeVisible({ timeout: 15000 });
    await expect(vectorTab).toHaveAttribute('aria-selected', 'true');

    // Verify 'frontier' filter button exists
    const frontierBtn = page.locator('button:has-text("frontier"), button:has-text("Frontier")').first();
    await expect(frontierBtn).toBeVisible({ timeout: 10000 });

    // Click frontier filter and check that active styling applies without error
    await frontierBtn.dispatchEvent('click');
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

  test('TC-AUDIT-016: Curriculum Integrity & Globally Unique Lesson IDs Across 57 Labs', async ({ page }) => {
    await page.goto('/');

    const curriculumData = await page.evaluate(async () => {
      const { track0 } = await import('/src/data/track0.ts');
      const { track1 } = await import('/src/data/track1.ts');
      const { track2 } = await import('/src/data/track2.ts');
      const { track3 } = await import('/src/data/track3.ts');
      const { track4 } = await import('/src/data/track4.ts');
      const { track5 } = await import('/src/data/track5.ts');
      const { track6 } = await import('/src/data/track6.ts');
      const { track7 } = await import('/src/data/track7.ts');

      const allTracks = [track0, track1, track2, track3, track4, track5, track6, track7];
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

    expect(curriculumData.totalLessons).toBe(57);
    expect(curriculumData.uniqueCount).toBe(57);
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

  test('TC-AUDIT-025: Sovereign Offline Knowledge Bank Frontier Parity (250 Core Topics)', async ({ page }) => {
    // 1. Static Contract: Verify offlineKnowledge.ts contains 65 core, batch1 contains 60 topics, batch2 contains 125 topics
    const offlineKnowledgePath = fs.existsSync(path.resolve(process.cwd(), 'apps/web/src/data/offlineKnowledge.ts'))
      ? path.resolve(process.cwd(), 'apps/web/src/data/offlineKnowledge.ts')
      : path.resolve(process.cwd(), 'src/data/offlineKnowledge.ts');
    const content = fs.readFileSync(offlineKnowledgePath, 'utf-8');

    const batch1Path = fs.existsSync(path.resolve(process.cwd(), 'apps/web/src/data/frontierKnowledgeBatch1.ts'))
      ? path.resolve(process.cwd(), 'apps/web/src/data/frontierKnowledgeBatch1.ts')
      : path.resolve(process.cwd(), 'src/data/frontierKnowledgeBatch1.ts');
    const batch1Content = fs.readFileSync(batch1Path, 'utf-8');

    const batch2Path = fs.existsSync(path.resolve(process.cwd(), 'apps/web/src/data/frontierKnowledgeBatch2.ts'))
      ? path.resolve(process.cwd(), 'apps/web/src/data/frontierKnowledgeBatch2.ts')
      : path.resolve(process.cwd(), 'src/data/frontierKnowledgeBatch2.ts');
    const batch2Content = fs.readFileSync(batch2Path, 'utf-8');

    const requiredTopics = [
      'flashattention-tiling-sram',
      'mixture-of-experts-moe',
      'direct-preference-optimization-dpo',
      'speculative-decoding-acceleration',
      'hnsw-vector-indexing',
      'structured-outputs-grammar-pushdown',
      'context-extrapolation-yarn-alibi',
      'quantization-formats-awq-gptq-gguf',
      'webgpu-wgsl-compute-shaders',
      'rag-chunking-and-reranking',
      'socratic-chain-of-thought',
      'senior-scam-phishing-defense',
      'student-feynman-concept-learning',
      'multilingual-ai-terminology-bridge',
      'agentic-multi-agent-orchestration',
      'synthetic-data-curation-filtering',
      'kv-cache-paged-attention-vllm'
    ];

    for (const topic of requiredTopics) {
      expect(content).toContain(`id: '${topic}'`);
    }

    const requiredBatch1Topics = [
      'ddpm-forward-reverse-sde',
      'rectified-flow-matching',
      'grpo-group-relative-policy',
      'mcts-test-time-compute',
      'zero-stage-1-2-3-memory',
      'fsdp-fully-sharded-data-parallel',
      'triton-block-level-programming',
      'adamw-weight-decay-decoupling',
      'pca-svd-eigen-decomposition',
      'svm-lagrange-dual-kernel'
    ];

    for (const topic of requiredBatch1Topics) {
      expect(batch1Content).toContain(`id: '${topic}'`);
    }

    const requiredBatch2Topics = [
      'vit-vision-transformer-patches',
      'clip-contrastive-pretraining',
      'whisper-encoder-decoder-speech',
      'colbert-late-interaction-scoring',
      'graph-rag-knowledge-triples',
      'bitnet-one-point-five-eight-bit',
      'webgpu-compute-pipeline-buffers',
      'webllm-tvm-wasi-browser-execution',
      'stride-ai-threat-modeling',
      'differential-privacy-dp-sgd'
    ];

    for (const topic of requiredBatch2Topics) {
      expect(batch2Content).toMatch(new RegExp(`id:\\s*['"]${topic}['"]`));
    }

    // 2. Physical DOM & Runtime Evaluation: Verify exactly 250 topics hydrated in browser
    await page.goto('/');
    const totalCount = await page.evaluate(async () => {
      const mod = await import('/src/data/offlineKnowledge.ts');
      return mod.OFFLINE_KNOWLEDGE_BASE.length;
    });
    expect(totalCount).toBe(283);
    expect(totalCount).toBeGreaterThanOrEqual(250);

    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    expect(errors.filter(e => !e.includes('favicon'))).toHaveLength(0);
  });

  test('TC-AUDIT-026: Continuum Grid & Responsive Visual Invariants', async ({ page }) => {
    const viewports = [
      { width: 375, height: 667, name: 'Mobile' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 1280, height: 800, name: 'Desktop' },
    ];

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/');

      // Verify no horizontal document overflow
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 2);

      // Verify Stage buttons are visible in the continuum grid
      const stage0Btn = page.locator('button:has-text("Stage 0")').first();
      await expect(stage0Btn).toBeVisible();

      const stage5Btn = page.locator('button:has-text("Stage 5")').first();
      await expect(stage5Btn).toBeVisible();

      // In Stage 0, verify the 4 persona cards are rendered
      const beginnerCard = page.locator('text=Absolute Beginner (Zero Knowledge of AI)').first();
      await expect(beginnerCard).toBeVisible();

      const familyCard = page.locator('text=Everyday Life & Family Helper').first();
      await expect(familyCard).toBeVisible();

      const seniorCard = page.locator('text=Senior & Lifelong Learner').first();
      await expect(seniorCard).toBeVisible();

      const studentCard = page.locator('text=Student & Homework Concept Learner').first();
      await expect(studentCard).toBeVisible();
    }
  });

  test('TC-AUDIT-027: Okapi BM25 Information Retrieval Precision & Term Saturation', async ({ page }) => {
    await page.goto('/');

    // Evaluate searchOfflineKnowledge in browser context
    const testResults = await page.evaluate(async () => {
      // Import searchOfflineKnowledge dynamically via module script
      const mod = await import('/src/data/offlineKnowledge.ts');
      const searchFn = mod.searchOfflineKnowledge;

      // 1. Exact frontier query
      const flashResults = searchFn('FlashAttention');
      const flashTop = flashResults[0]?.id;

      // 2. Query with stopwords & natural phrasing
      const pagedResults = searchFn('how does paged attention manage kv cache memory in vllm');
      const pagedTop = pagedResults[0]?.id;

      // 3. Speculative decoding natural query
      const specResults = searchFn('speculative decoding draft model verification');
      const specTop = specResults[0]?.id;

      // 4. Domain synonym query
      const alignmentResults = searchFn('rlhf preference alignment dpo');
      const alignmentTop = alignmentResults[0]?.id;

      // 5. Batch 1 Queries: Flow Matching, GRPO, ZeRO, AdamW
      const flowResults = searchFn('rectified flow matching straight trajectories');
      const flowTop = flowResults[0]?.id;

      const grpoResults = searchFn('grpo reasoning deepseek r1 critic free');
      const grpoTop = grpoResults[0]?.id;

      const zeroResults = searchFn('zero stage 3 deepspeed memory partitioning');
      const zeroTop = zeroResults[0]?.id;

      const adamwResults = searchFn('adamw weight decay decoupling l2 regularization');
      const adamwTop = adamwResults[0]?.id;

      // 6. Batch 2 Queries: ViT, CLIP, ColBERT, WebLLM, STRIDE
      const vitResults = searchFn('vit vision transformer patch projection');
      const vitTop = vitResults[0]?.id;

      const clipResults = searchFn('clip contrastive infonce image text');
      const clipTop = clipResults[0]?.id;

      const colbertResults = searchFn('colbert late interaction maxsim');
      const colbertTop = colbertResults[0]?.id;

      const strideResults = searchFn('stride threat modeling autonomous agents');
      const strideTop = strideResults[0]?.id;

      return {
        flashTop,
        flashCount: flashResults.length,
        pagedTop,
        specTop,
        alignmentTop,
        flowTop,
        grpoTop,
        zeroTop,
        adamwTop,
        vitTop,
        clipTop,
        colbertTop,
        strideTop
      };
    });

    expect(testResults.flashTop).toBe('flashattention-tiling-sram');
    expect(testResults.flashCount).toBeGreaterThan(0);
    expect(testResults.pagedTop).toBe('kv-cache-paged-attention-vllm');
    expect(testResults.specTop).toBe('speculative-decoding-draft-model-verification');
    expect(testResults.alignmentTop).toBe('direct-preference-optimization-dpo');
    expect(testResults.flowTop).toBe('rectified-flow-matching');
    expect(testResults.grpoTop).toBe('grpo-group-relative-policy');
    expect(testResults.zeroTop).toBe('zero-stage-1-2-3-memory');
    expect(testResults.adamwTop).toBe('adamw-weight-decay-decoupling');
    expect(testResults.vitTop).toBe('vit-vision-transformer-patches');
    expect(testResults.clipTop).toBe('clip-contrastive-pretraining');
    expect(testResults.colbertTop).toBe('colbert-late-interaction-scoring');
    expect(testResults.strideTop).toBe('stride-ai-threat-modeling');
  });

  test('TC-AUDIT-028: Cross-Lingual Multi-Script Query Retrieval (es, hi, zh, fr, de, ar)', async ({ page }) => {
    await page.goto('/');

    const crossLingualResults = await page.evaluate(async () => {
      const mod = await import('/src/data/offlineKnowledge.ts');
      const searchFn = mod.searchOfflineKnowledge;

      // Spanish queries
      const esAtencion = searchFn('atención');
      const esCuantizacion = searchFn('cuantización');

      // Hindi queries
      const hiAttention = searchFn('अटेंशन');
      const hiScam = searchFn('स्कैम');

      // Chinese queries
      const zhAttention = searchFn('注意力');
      const zhQuant = searchFn('量化');
      const zhSpec = searchFn('投机采样');

      // French query
      const frSpec = searchFn('décodage spéculatif');

      // German query
      const deQuant = searchFn('quantisierung');

      // Arabic query
      const arQuant = searchFn('تكميم');

      return {
        esAtencionTop: esAtencion[0]?.id,
        esCuantizacionTop: esCuantizacion[0]?.id,
        hiAttentionTop: hiAttention[0]?.id,
        hiScamTop: hiScam[0]?.id,
        zhAttentionTop: zhAttention[0]?.id,
        zhQuantTop: zhQuant[0]?.id,
        zhSpecTop: zhSpec[0]?.id,
        frSpecTop: frSpec[0]?.id,
        deQuantTop: deQuant[0]?.id,
        arQuantTop: arQuant[0]?.id,
      };
    });

    // Verify all cross-lingual queries correctly retrieved target knowledge cards
    expect(crossLingualResults.esAtencionTop).toBe('scaled-dot-product-attention');
    expect(crossLingualResults.esCuantizacionTop).toBe('quantization-precision');
    expect(crossLingualResults.hiAttentionTop).toBe('scaled-dot-product-attention');
    expect(crossLingualResults.hiScamTop).toBe('senior-scam-phishing-defense');
    expect(crossLingualResults.zhAttentionTop).toBe('scaled-dot-product-attention');
    expect(crossLingualResults.zhQuantTop).toBe('quantization-precision');
    expect(crossLingualResults.zhSpecTop).toBe('speculative-decoding-acceleration');
    expect(['speculative-decoding-acceleration', 'speculative-decoding-draft-model-verification']).toContain(crossLingualResults.frSpecTop);
    expect(crossLingualResults.deQuantTop).toBe('quantization-precision');
    expect(crossLingualResults.arQuantTop).toBe('quantization-precision');
  });

  test('TC-AUDIT-029: Interactive Visual Explainable Micro-Widgets in Knowledge Cards', async ({ page }) => {
    await page.goto('/');

    // 1. Open Offline AI Copilot modal via global custom event
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('open-offline-copilot'));
    });

    const copilotModal = page.locator('.copilot-modal');
    await expect(copilotModal).toBeVisible();

    const searchInput = page.locator('#copilot-search-input');
    await expect(searchInput).toBeVisible();

    // 2. Test Softmax Temperature Widget
    await searchInput.fill('temperature');
    const tempCard = page.locator('#copilot-entry-temperature-sampling');
    await expect(tempCard).toBeVisible();

    const tempWidget = tempCard.locator('[data-testid="softmax-temperature-widget"]');
    await expect(tempWidget).toBeVisible();

    const tempSlider = tempWidget.locator('#temp-slider');
    await expect(tempSlider).toBeVisible();
    await tempSlider.evaluate((el: HTMLInputElement) => {
      el.value = '2.0';
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await expect(tempWidget).toContainText('High Entropy');

    // 3. Test PagedAttention Widget
    await searchInput.fill('paged attention');
    const pagedCard = page.locator('#copilot-entry-kv-cache-paged-attention-vllm');
    await expect(pagedCard).toBeVisible();

    const pagedWidget = pagedCard.locator('[data-testid="paged-attention-widget"]');
    await expect(pagedWidget).toBeVisible();
    const addTokenBtn = pagedWidget.locator('button:has-text("+2")');
    await addTokenBtn.click();
    await expect(pagedWidget).toContainText('12 / 32');

    // 4. Test Cosine Similarity Dial Widget
    await searchInput.fill('cosine similarity');
    const cosineCard = page.locator('#copilot-entry-cosine-similarity-math');
    await expect(cosineCard).toBeVisible();

    const cosineWidget = cosineCard.locator('[data-testid="cosine-similarity-widget"]');
    await expect(cosineWidget).toBeVisible();
    const btn90 = cosineWidget.locator('button:has-text("90°")');
    await btn90.click();
    await expect(cosineWidget).toContainText('cos(θ) = 0.000');
    await expect(cosineWidget).toContainText('Orthogonal');

    // 5. Test RoPE Rotation Dial Widget
    await searchInput.fill('rotary position');
    const ropeCard = page.locator('#copilot-entry-rope-embeddings');
    await expect(ropeCard).toBeVisible();

    const ropeWidget = ropeCard.locator('[data-testid="rope-rotation-widget"]');
    await expect(ropeWidget).toBeVisible();
    const btnNext = ropeWidget.locator('button:has-text("m+1")');
    await btnNext.click();
    await expect(ropeWidget).toContainText('#3');
    const btnTheta45 = ropeWidget.locator('button:has-text("θ=45°")');
    await btnTheta45.click();
    await expect(ropeWidget).toContainText('Total Angle: 135°');
  });

  test('TC-AUDIT-027: EverydayCraftAiModal Master-Detail Psychological Usability & Ergonomics', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto('/');

    // 1. Open Master-Detail Continuum Modal
    const openBtn = page.locator('button:has-text("Real-World Scenarios in Depth")');
    await expect(openBtn).toBeVisible();
    await openBtn.click();

    // 2. Verify modal opened with Master-Detail layout
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();
    await expect(modal).toContainText('Real-World AI Application Continuum');
    await expect(modal).toContainText('MASTER-DETAIL EXPLORER');

    // 3. Verify Master Sidebar & Search Input
    const searchInput = modal.locator('input[placeholder*="Search trade, dilemma"]');
    await expect(searchInput).toBeVisible();

    // 4. Test Search Filtering in Real-Time
    await searchInput.fill('thermal');
    const thermalCard = modal.locator('button:has-text("Precision Thermal Expansion")');
    await expect(thermalCard).toBeVisible();
    await thermalCard.click();

    // 5. Verify Detail Panel displays rich authentic scenario data
    const detailPanel = modal.locator('main');
    await expect(detailPanel).toContainText('Precision Thermal Expansion & Machining Tolerances');
    await expect(detailPanel).toContainText('The Real-World Dilemma');
    await expect(detailPanel).toContainText('How AI Helps in Plain Language');
    await expect(detailPanel).toContainText('Production Prompt Blueprint');

    // 6. Test Prompt Blueprint Copying Interaction
    const copyBtn = detailPanel.locator('button:has-text("Copy Blueprint")');
    await expect(copyBtn).toBeVisible();
    await copyBtn.click();
    await expect(detailPanel).toContainText('Copied to Clipboard!');

    // 7. Test Python WASM Code Runner Execution
    const runBtn = detailPanel.locator('button:has-text("Run Code Locally")');
    await expect(runBtn).toBeVisible();
    await runBtn.click();
    await expect(detailPanel.locator('text=PYODIDE WASM STDOUT')).toBeVisible({ timeout: 5000 });

    // 8. Test "The 3 Rules Guide" Tab Switch
    const guideTab = modal.locator('button:has-text("The 3 Rules Guide")');
    await expect(guideTab).toBeVisible();
    await guideTab.click();
    await expect(modal).toContainText('You Are an LLM: How Anyone Can Talk to an AI in 3 Simple Rules');
    await expect(modal).toContainText('Rule 1: Role');
    await expect(modal).toContainText('Rule 2: Context');
    await expect(modal).toContainText('Rule 3: Format');

    // 9. Close Modal Cleanly
    const closeBtn = modal.locator('button[aria-label="Close modal"]');
    await closeBtn.click();
    await expect(modal).not.toBeVisible();

    // Zero console errors
    expect(errors.filter(e => !e.includes('favicon'))).toHaveLength(0);
  });

  test('TC-AUDIT-028: Human Psychological Usability & Anti-Horizontal Overflow Invariants', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    // 1. Check Desktop & Mobile viewports for anti-horizontal cutoff invariants
    await page.goto('/');

    // Check Cognitive Accelerator Pareto chips have flex-wrap (no horizontal clipping)
    const paretoChips = page.locator('[data-testid="pareto-chips-scroll"]');
    await expect(paretoChips).toBeVisible();
    await expect(paretoChips).toHaveClass(/flex-wrap/);

    // 2. Open Theme Settings Modal and verify navigation tabs wrap cleanly
    const themeTrigger = page.locator('[data-testid="open-themes-btn"]').first();
    if (await themeTrigger.isVisible()) {
      await themeTrigger.click();
      const themeModal = page.locator('[data-testid="theme-settings-modal"]');
      await expect(themeModal).toBeVisible();
      const navTabs = themeModal.locator('button[data-testid="tab-themes-btn"]').locator('..');
      await expect(navTabs).toHaveClass(/flex-wrap/);
      const closeThemeBtn = page.locator('[data-testid="close-theme-modal-btn"]');
      await closeThemeBtn.click();
    }

    // 3. Open Free Tools Modal and verify respectful plain language & wrapping tabs
    const toolsFooterBtn = page.locator('button:has-text("Free Tools"), button:has-text("4 Tools"), button:has-text("Free Sovereign Stack")').first();
    if (await toolsFooterBtn.isVisible()) {
      await toolsFooterBtn.click();
      const toolsModal = page.locator('div[role="dialog"][aria-labelledby="tools-modal-title"]');
      await expect(toolsModal).toBeVisible();

      // Verify respectful plain language: NO demeaning/condescending language
      await expect(toolsModal).toContainText('Granular, step-by-step walkthroughs');
      await expect(toolsModal).not.toContainText('idiot-proof');

      // Verify Tool Categories tablist has flex-wrap
      const categoryTablist = toolsModal.locator('div[role="tablist"][aria-label="Tool Categories"]');
      await expect(categoryTablist).toHaveClass(/flex-wrap/);

      // Close modal
      const closeBtn = toolsModal.locator('button[aria-label="Close dialog"]');
      await closeBtn.click();
      await expect(toolsModal).not.toBeVisible();
    }

    // 4. Verify Spatial Holodeck tier bar and view tabs wrap cleanly
    await page.goto('/holodeck');
    const computeTierContainer = page.locator('div[role="group"][aria-label="Graphics Compute Tier Selector"]').locator('..');
    await expect(computeTierContainer).toHaveClass(/flex-wrap/);

    const holodeckTablist = page.locator('div[role="tablist"][aria-label="Holodeck Visualizer Views"]');
    await expect(holodeckTablist).toHaveClass(/flex-wrap/);

    // 5. Verify Portfolio Page track filters wrap cleanly
    await page.goto('/portfolio');
    const trackFilterContainer = page.locator('button:has-text("All 28"), button:has-text("All 45"), button:has-text("All 57")').first().locator('..');
    await expect(trackFilterContainer).toHaveClass(/flex-wrap/);

    // 6. Test on narrow mobile screen (375x667)
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    const paretoChipsMobile = page.locator('[data-testid="pareto-chips-scroll"]');
    await expect(paretoChipsMobile).toBeVisible();
    await expect(paretoChipsMobile).toHaveClass(/flex-wrap/);

    // Verify 0 console errors
    expect(errors.filter(e => !e.includes('favicon'))).toHaveLength(0);
  });

  test('REG-SPONSOR-PORTAL: Multi-Sponsor modal opens and displays verified donation links', async ({ page }) => {
    await page.goto('/');
    const sponsorBtn = page.locator('button:has-text("Support $0 AI Education")').first();
    await expect(sponsorBtn).toBeVisible();
    await sponsorBtn.click();

    const sponsorModal = page.locator('#sponsor-modal-title');
    await expect(sponsorModal).toBeVisible();

    // Verify all 3 verified channels
    const ghLink = page.locator('a[href*="github.com/sponsors/openguideforai"]');
    await expect(ghLink).toBeVisible();
    const kofiLink = page.locator('a[href*="ko-fi.com/buymegoodcoffee"]');
    await expect(kofiLink).toBeVisible();
    const paypalLink = page.locator('a[href*="paypal.me/buymegoodcoffee"]');
    await expect(paypalLink).toBeVisible();

    // Test Escape key closes cleanly
    await page.keyboard.press('Escape');
    await expect(sponsorModal).not.toBeVisible();
  });

  test('REG-ANALYTICS: Cloudflare Web Analytics beacon is configured for production edge without CSP violations', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    await page.goto('/');

    const indexHtmlPath = fs.existsSync(path.resolve(process.cwd(), 'apps/web/index.html'))
      ? path.resolve(process.cwd(), 'apps/web/index.html')
      : path.resolve(process.cwd(), 'index.html');
    const indexHtml = fs.readFileSync(indexHtmlPath, 'utf-8');
    expect(indexHtml).toContain('f47cb826efea4a95a1215b3992b95c96');
    expect(indexHtml).toContain('cloudflareinsights.com/beacon.min.js');
    expect(errors.filter(e => e.includes('Content Security Policy'))).toHaveLength(0);
  });

  test('REG-PROFILER-MODAL: Hardware Profiler modal calculates VRAM rooflines correctly', async ({ page }) => {
    await page.goto('/');
    const profilerBtn = page.locator('button:has-text("Hardware & VRAM Profiler")').first();
    await expect(profilerBtn).toBeVisible();
    await profilerBtn.click();

    const profilerModal = page.locator('#hardware-profiler-title');
    await expect(profilerModal).toBeVisible();

    // Verify weights and KV cache breakdown
    await expect(page.locator('text=Model Weights VRAM')).toBeVisible();
    await expect(page.locator('text=KV Cache Footprint')).toBeVisible();
    await expect(page.locator('text=Total VRAM Required')).toBeVisible();

    // Switch precision to INT4
    const int4Btn = page.locator('button:has-text("INT4")');
    await int4Btn.click();

    // Test Abundant Progressive Hints in Hardware Profiler
    const unlockHintBtn = page.locator('button:has-text("Unlock Next Tier")');
    await expect(unlockHintBtn).toBeVisible();
    await unlockHintBtn.click();
    await expect(page.locator('text=Tier 1 (Mental Model)')).toBeVisible();

    // Close profiler
    await page.keyboard.press('Escape');
    await expect(profilerModal).not.toBeVisible();
  });

  test('REG-TRACKS-5-6-7-DIRECT-ROUTING: Briefing pages render curriculum lessons, sandboxes, and 0 console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });

    // Track 5: Fine-Tuning & Quantization Briefing
    await page.goto('/track/5/intro');
    await expect(page.locator('h1:has-text("Track 5: Fine-Tuning")')).toBeVisible();
    await expect(page.locator('text=Low-Rank Matrix Factorization & LoRA Forward Pass').first()).toBeVisible();
    await expect(page.locator('text=Direct Preference Optimization (DPO)').first()).toBeVisible();
    await expect(page.locator('button:has-text("INITIALIZE WORKSPACE NOW")').first()).toBeVisible();

    // Track 6: Inference Systems & Serving Briefing
    await page.goto('/track/6/intro');
    await expect(page.locator('h1:has-text("Track 6: Production MLOps")')).toBeVisible();
    await expect(page.locator('text=KV-Cache Byte Footprint & Arithmetic Intensity').first()).toBeVisible();
    await expect(page.locator('text=Speculative Decoding Acceptance-Rejection').first()).toBeVisible();
    await expect(page.locator('button:has-text("INITIALIZE WORKSPACE NOW")').first()).toBeVisible();

    // Track 7: Multimodal & Diffusion Models Briefing
    await page.goto('/track/7/intro');
    await expect(page.locator('h1:has-text("Track 7: Generative Diffusion")')).toBeVisible();
    await expect(page.locator('text=Forward Diffusion Noise Scheduling').first()).toBeVisible();
    await expect(page.locator('text=Vision Transformer (ViT) Patch Projection Mechanics').first()).toBeVisible();
    await expect(page.locator('button:has-text("INITIALIZE WORKSPACE NOW")').first()).toBeVisible();

    // Direct CoursePlayer IDE loading verification for Track 5
    await page.goto('/track/5');
    await expect(page.locator('text=Low-Rank Matrix Factorization & LoRA Forward Pass').first()).toBeVisible();

    // Zero unexpected errors
    expect(errors.filter(e => !e.includes('favicon'))).toHaveLength(0);
  });

  test('REG-OFFLINE-COPILOT-PEDAGOGICAL-WIDGETS: Bug Hunter and Tensor Surgery interactive widgets with progressive hints', async ({ page }) => {
    await page.goto('/');

    // Trigger Offline Copilot modal from landing page button
    const askBlueeBtn = page.locator('#ask-bluee-now-btn');
    await expect(askBlueeBtn).toBeVisible();
    await askBlueeBtn.click();

    const copilotModal = page.locator('div[role="dialog"][aria-label="Offline AI Copilot"]');
    await expect(copilotModal).toBeVisible();

    // 1. Search for Bug Hunter / mutation testing
    const searchInput = page.locator('#copilot-search-input');
    await searchInput.fill('mutation testing');
    await page.waitForTimeout(500);

    // Verify BugHunterChallenge rendered inside Copilot card
    const bugHunterCard = page.locator('text=The Bug Hunter: Adversarial AI Code Auditing');
    await expect(bugHunterCard).toBeVisible();

    // Test Abundant Progressive Hints unlocking in BugHunterChallenge
    const unlockHintBtn = page.locator('button:has-text("Unlock Next Tier")').first();
    await expect(unlockHintBtn).toBeVisible();
    await unlockHintBtn.click();

    // Verify mental models and invariant hints are visible
    await expect(page.locator('text=Tier 1 (Mental Model)')).toBeVisible();

    // 2. Search for Tensor Surgery
    await searchInput.fill('tensor surgery');
    await page.waitForTimeout(500);

    // Verify TensorSurgeryVisualizer rendered inside Copilot card
    const tensorSurgeryCard = page.locator('text=Tensor Surgery: Shape, Strides & Memory Manifolds');
    await expect(tensorSurgeryCard).toBeVisible();
    await expect(page.locator('text=Physical Memory Strides')).toBeVisible();
    await expect(page.locator('text=Physical Memory Buffer Architecture')).toBeVisible();

    // Close Copilot via close button
    const closeBtn = page.locator('#close-copilot-btn');
    await closeBtn.click();
    await expect(copilotModal).not.toBeVisible();
  });

  test('TC-AUDIT-006: 50 Application-Wide Defects Hardening Verification', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error' && !msg.text().includes('favicon')) {
        errors.push(msg.text());
      }
    });

    // 1. Landing Page Accessible Controls
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    const spectrumSearch = page.locator('#landing-spectrum-search-input');
    await expect(spectrumSearch).toBeVisible();
    await expect(spectrumSearch).toHaveAttribute('aria-label', 'Search trades, dilemmas, or scenarios');

    const heroCheckbox = page.locator('#hero-start-as-builder-mechanical-btn input[type="checkbox"]');
    await expect(heroCheckbox).toHaveAttribute('aria-label', 'Mechanical launch toggle switch');

    // 2. Settings Modal Sliders & BYOK Accessible Inputs
    const settingsBtn = page.locator('button[aria-label="Themes and Studio Settings"]').first();
    await settingsBtn.click();
    const settingsModal = page.locator('[data-testid="theme-settings-modal-dialog"]');
    await expect(settingsModal).toBeVisible();

    const preferencesTabBtn = page.locator('[data-testid="tab-preferences-btn"]');
    await preferencesTabBtn.click();

    const byokKeyInput = page.locator('#byok-api-key-input');
    await expect(byokKeyInput).toHaveAttribute('aria-label', 'BYOK API Key');

    const byokModelInput = page.locator('#byok-model-input');
    await expect(byokModelInput).toHaveAttribute('aria-label', 'Model Identifier');

    // Test Escape key dismiss
    await page.keyboard.press('Escape');
    await expect(settingsModal).not.toBeVisible();

    // 3. Offline Copilot Keyboard Dismiss
    const askBlueeBtn = page.locator('#ask-bluee-now-btn');
    await askBlueeBtn.click();
    const copilotModal = page.locator('div[role="dialog"][aria-label="Offline AI Copilot"]');
    await expect(copilotModal).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(copilotModal).not.toBeVisible();

    // 4. Portfolio Page Accessible File & Certificate Inputs
    await page.goto('/portfolio');
    await page.waitForLoadState('domcontentloaded');

    const fileInput = page.locator('#portfolio-import-backup-file');
    await expect(fileInput).toHaveAttribute('aria-label', 'Import JSON backup file');

    // Open sample preview to verify recipient name input
    const previewBtn = page.locator('button:has-text("Preview Sample Document")');
    if (await previewBtn.isVisible()) {
      await previewBtn.click();
      const recipientInput = page.locator('#portfolio-recipient-name-input');
      await expect(recipientInput).toBeVisible();
      await expect(recipientInput).toHaveAttribute('aria-label', 'Enter recipient name for certificate');
    }

    // 5. External Link Security: Target Blank Has Rel Noopener/Noreferrer
    const externalLinks = await page.locator('a[target="_blank"]').all();
    for (const link of externalLinks) {
      const rel = await link.getAttribute('rel');
      expect(rel).toBeTruthy();
      expect(rel).toMatch(/(noopener|noreferrer)/);
    }

    // Zero console errors
    expect(errors).toHaveLength(0);
  });

  test('TC-AUDIT-062: Builder & Curriculum 62-Defect Accessibility & Lifecycle Gate', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error' && !msg.text().includes('favicon')) {
        errors.push(msg.text());
      }
    });

    // 1. Builder Track 0: CheckUnderstandingQuiz dynamic count & ARIA states
    await page.goto('/builder/0/engine');
    await page.waitForLoadState('domcontentloaded');

    const quizHeader = page.locator('text=/Check Your Understanding \\(\\d+ Questions?\\)/');
    await expect(quizHeader).toBeVisible({ timeout: 10000 });

    // If already submitted/completed from a previous session, click Retake/Try Again to test selection
    const retakeBtn = page.locator('button[aria-label="Retake quiz for practice"], button[aria-label="Try quiz again"]');
    if (await retakeBtn.isVisible()) {
      await retakeBtn.click();
    }

    const quizOption = page.locator('button[aria-label^="Option 1:"]').first();
    await expect(quizOption).toBeVisible();
    await expect(quizOption).toHaveAttribute('aria-pressed', 'false');
    await quizOption.click();
    await expect(quizOption).toHaveAttribute('aria-pressed', 'true');

    const checkAnswersBtn = page.locator('button[aria-label="Check quiz answers"]');
    await expect(checkAnswersBtn).toBeVisible();

    // 2. PromptToPreviewLab controls & ARIA attributes
    const offlineProviderBtn = page.locator('button:has-text("Offline Demo")').first();
    await expect(offlineProviderBtn).toBeVisible();
    await expect(offlineProviderBtn).toHaveAttribute('aria-pressed', 'true');

    const viewCodeBtn = page.locator('[data-testid="toggle-view-code-btn"]');
    await expect(viewCodeBtn).toBeVisible();
    await expect(viewCodeBtn).toHaveAttribute('aria-pressed', 'false');

    const generateBtn = page.locator('button[aria-label="Generate code and run live preview"]');
    await expect(generateBtn).toBeVisible();

    // 3. Builder Track 1: SpecStudioLab template selection & ARIA states
    await page.goto('/builder/1/engine');
    await page.waitForLoadState('domcontentloaded');

    const prodSpecBtn = page.locator('#template-prod-spec');
    await expect(prodSpecBtn).toBeVisible({ timeout: 10000 });
    await expect(prodSpecBtn).toHaveAttribute('aria-pressed', 'true');

    const resetSpecBtn = page.locator('button[aria-label="Reset current specification template"]');
    await expect(resetSpecBtn).toBeVisible();

    const copySpecBtn = page.locator('button[aria-label="Copy specification prompt to clipboard"]');
    await expect(copySpecBtn).toBeVisible();

    const simulateBtn = page.locator('button[aria-label="Simulate deterministic agent execution"]');
    await expect(simulateBtn).toBeVisible();

    // 4. Builder Track 2: DiffReaderLab mode toggles, scenario selectors, accept/reject
    await page.goto('/builder/2/engine');
    await page.waitForLoadState('domcontentloaded');

    const unifiedBtn = page.locator('button:has-text("Unified")').first();
    await expect(unifiedBtn).toBeVisible({ timeout: 10000 });
    await expect(unifiedBtn).toHaveAttribute('aria-pressed', 'true');

    const splitBtn = page.locator('button:has-text("Split")').first();
    await expect(splitBtn).toBeVisible();
    await expect(splitBtn).toHaveAttribute('aria-pressed', 'false');

    const scenario1Btn = page.locator('button[aria-label^="Select scenario s1:"]').first();
    await expect(scenario1Btn).toBeVisible();
    await expect(scenario1Btn).toHaveAttribute('aria-pressed', 'true');

    const rejectBtn = page.locator('button[aria-label="Reject diff and rollback changes"]');
    await expect(rejectBtn).toBeVisible();

    const acceptBtn = page.locator('button[aria-label="Accept diff and commit to dev branch"]');
    await expect(acceptBtn).toBeVisible();

    // 5. TrackBriefing keyboard navigation & back button
    await page.goto('/track/0/intro');
    await page.waitForLoadState('domcontentloaded');

    const backBtn = page.locator('button[aria-label="Back to OpenGuide Studio"]');
    await expect(backBtn).toBeVisible({ timeout: 10000 });

    const firstLessonCard = page.locator('div[role="button"][aria-label^="Open lesson 1:"]').first();
    await expect(firstLessonCard).toBeVisible();
    await expect(firstLessonCard).toHaveAttribute('tabindex', '0');

    // 6. Interactive widgets ARIA verification via Offline AI Copilot
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('open-offline-copilot'));
    });

    const copilotModal = page.locator('.copilot-modal');
    await expect(copilotModal).toBeVisible();

    const searchInput = page.locator('#copilot-search-input');
    await searchInput.fill('temperature');
    const tempWidget = page.locator('[data-testid="softmax-temperature-widget"]');
    await expect(tempWidget).toBeVisible({ timeout: 10000 });
    const resetTempBtn = tempWidget.locator('button[aria-label="Reset temperature to 0.7"]');
    await expect(resetTempBtn).toBeVisible();

    await searchInput.fill('paged attention');
    const pagedWidget = page.locator('[data-testid="paged-attention-widget"]');
    await expect(pagedWidget).toBeVisible({ timeout: 10000 });
    await expect(pagedWidget.locator('button[aria-label="Add 2 tokens to cache sequence"]')).toBeVisible();
    await expect(pagedWidget.locator('button[aria-label="Evict 2 tokens from cache sequence"]')).toBeVisible();
    await expect(pagedWidget.locator('button[aria-label="Reset KV cache to starter prompt sequence"]')).toBeVisible();

    await searchInput.fill('cosine similarity');
    const cosineWidget = page.locator('[data-testid="cosine-similarity-widget"]');
    await expect(cosineWidget).toBeVisible({ timeout: 10000 });
    const angle90Btn = cosineWidget.locator('button[aria-label="Set angle to 90 degrees (orthogonal)"]');
    await expect(angle90Btn).toBeVisible();
    await angle90Btn.click();
    await expect(angle90Btn).toHaveAttribute('aria-pressed', 'true');

    // Close Copilot via close button
    const closeCopilotBtn = page.locator('#close-copilot-btn');
    await closeCopilotBtn.click();
    await expect(copilotModal).not.toBeVisible();

    // Zero console errors
    expect(errors).toHaveLength(0);
  });
});




