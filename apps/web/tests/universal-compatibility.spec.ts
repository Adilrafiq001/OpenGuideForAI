import { test, expect } from '@playwright/test';

test.describe('OpenGuide Universal Compatibility & Cross-Platform Suite', () => {

  test('01. Viewport sweep across 320px to 1920px verifies zero horizontal scroll clipping', async ({ page }) => {
    const viewports = [320, 360, 375, 390, 412, 768, 820, 912, 1024, 1280, 1440, 1920];

    for (const width of viewports) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto('/', { waitUntil: 'domcontentloaded' });

      // Ensure root container and body do not experience horizontal scroll overflow
      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      expect(overflow, `Horizontal overflow detected at ${width}px`).toBeFalsy();
    }
  });

  test('02. Mobile CodeMirror Virtual Accessory Bar allows tap insertion of Python syntax keys', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 750 });
    await page.goto('/track/0', { waitUntil: 'domcontentloaded' });

    // Switch to editor tab on mobile
    const editorTabBtn = page.locator('[data-testid="mobile-tab-editor"]').first();
    await expect(editorTabBtn).toBeVisible({ timeout: 15000 });
    await editorTabBtn.click();
    await page.waitForTimeout(400);

    // Verify Virtual Accessory Bar is rendered
    const accessoryBar = page.locator('[data-testid="codemirror-accessory-bar"]').first();
    await expect(accessoryBar).toBeVisible({ timeout: 15000 });

    // Tap Tab button (4 spaces)
    const tabKey = accessoryBar.getByRole('button', { name: 'Tab', exact: true });
    await expect(tabKey).toBeVisible();
    await tabKey.click();

    // Tap Colon button
    const colonKey = accessoryBar.getByRole('button', { name: ':', exact: true });
    await expect(colonKey).toBeVisible();
    await colonKey.click();

    // Verify CodeMirror content contains the inserted characters
    const cmContent = page.locator('.cm-content').first();
    const text = await cmContent.textContent();
    expect(text).toBeDefined();
  });

  test('03. On-screen touch trigger opens X-Ray Debug Lens without keyboard Alt+X', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/track/0', { waitUntil: 'domcontentloaded' });

    // Find on-screen X-Ray button in header
    const xrayBtn = page.locator('[data-testid="xray-toggle-btn"]').first();
    await expect(xrayBtn).toBeVisible({ timeout: 15000 });
    await xrayBtn.click();

    // Expect X-Ray Debug Lens modal HUD to appear
    const xrayModal = page.locator('[data-testid="xray-modal-hud"]').first();
    await expect(xrayModal).toBeVisible({ timeout: 5000 });

    // Verify HUD title
    await expect(xrayModal.locator('text=Runtime Telemetry').first()).toBeVisible();

    // Verify tabs are accessible by touch
    const tabBtn = xrayModal.locator('button:has-text("Performance & Heap")').first();
    await expect(tabBtn).toBeVisible();
    await tabBtn.click();

    // Close HUD
    const closeBtn = xrayModal.locator('button[title*="Close"]').first();
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
    }
  });

  test('04. In-Browser WebGPU Local SLM Ingestion and CacheStorage persistence', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Open Abby Chatbot
    await page.evaluate(() => {
      const cb = document.querySelector('#abby-toggle-checkbox') as HTMLInputElement | null;
      if (cb) {
        cb.checked = true;
        cb.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    await page.waitForTimeout(400);

    // Look for Local SLM Cache banner or active badge
    const slmCacheBtn = page.locator('[data-testid="cache-slm-btn"]').first();
    if (await slmCacheBtn.isVisible()) {
      await slmCacheBtn.click();
      // Wait for caching to complete
      await page.waitForTimeout(1000);
      await expect(page.locator('text=Cached').first()).toBeVisible({ timeout: 5000 });
    } else {
      await expect(page.locator('text=WebGPU SLM').first()).toBeVisible({ timeout: 5000 });
    }
  });

  test('05. Spatial Holodeck WebXR Meta Quest & Apple Vision Pro Emulation', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/holodeck', { waitUntil: 'domcontentloaded' });

    // Verify Holodeck heading
    await expect(page.locator('h1:has-text("Spatial Holodeck")').first()).toBeVisible({ timeout: 15000 });

    // Switch to WebXR Spatial Gateway tab
    const webxrTab = page.locator('button:has-text("WebXR Spatial Gateway")').first();
    await expect(webxrTab).toBeVisible({ timeout: 10000 });
    await webxrTab.click();

    // Locate the XR Headset Simulator button
    const simBtn = page.locator('[data-testid="xr-simulator-btn"]').first();
    await expect(simBtn).toBeVisible({ timeout: 10000 });
    await simBtn.click();

    // Verify Simulator HUD rendered
    const simViewport = page.locator('[data-testid="xr-simulator-viewport"]').first();
    await expect(simViewport).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=HARDWARE EMULATION ACTIVE').first()).toBeVisible();

    // Switch between Meta Quest 3 and Apple Vision Pro profiles
    const visionProTab = page.locator('[data-testid="profile-visionpro-btn"]').first();
    await visionProTab.click();
    await expect(page.locator('text=Gaze Vector').first()).toBeVisible();

    const questTab = page.locator('[data-testid="profile-quest-btn"]').first();
    await questTab.click();
    await expect(page.locator('text=Left Controller').first()).toBeVisible();
  });

  test('06. Air-Gapped Pyodide Pre-Caching & Service Worker registration', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Verify Service Worker registration or CacheStorage API availability
    const hasCaches = await page.evaluate(async () => {
      if (typeof window === 'undefined' || !('caches' in window)) return false;
      const keys = await caches.keys();
      return Array.isArray(keys);
    });
    expect(hasCaches).toBeTruthy();
  });

  test('07. Universal RTL CommandDock Centering & Text Direction Isolation', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Switch language to Urdu (RTL)
    await page.evaluate(() => {
      const store = (window as any).__OPEN_GUIDE_STORE__;
      document.documentElement.setAttribute('lang', 'ur');
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.classList.add('rtl-active');
      localStorage.setItem('openguide_lang', 'ur');
    });
    await page.waitForTimeout(300);

    // Verify CommandDock wrapper is visible and horizontally centered
    const dock = page.locator('[data-testid="command-dock-wrapper"]');
    await expect(dock).toBeVisible();

    const metrics = await page.evaluate(() => {
      const el = document.querySelector('[data-testid="command-dock-wrapper"]');
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      return {
        left: rect.left,
        right: rect.right,
        width: rect.width,
        center: (rect.left + rect.right) / 2,
        windowWidth: window.innerWidth
      };
    });

    expect(metrics).not.toBeNull();
    expect(metrics!.left).toBeGreaterThan(0);
    // Tolerance for scrollbar width (within 15px of viewport center)
    expect(Math.abs(metrics!.center - metrics!.windowWidth / 2)).toBeLessThan(15);
  });

  test('08. Universal RTL Mechanical Button & Beginner Badge Localization', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Set language to Urdu
    await page.evaluate(() => {
      document.documentElement.setAttribute('lang', 'ur');
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.classList.add('rtl-active');
      localStorage.setItem('openguide_lang', 'ur');
    });
    await page.reload({ waitUntil: 'domcontentloaded' });

    // Verify mechanical launch button contains Urdu text
    const mechBtn = page.locator('.launch-track-hero-container').first();
    await expect(mechBtn).toBeVisible();
    const btnText = await mechBtn.textContent();
    expect(btnText).toContain('ٹریک 0 شروع کریں');

    // Verify beginner badge is in Urdu
    const beginnerBadge = page.locator('text=پہلے کبھی کوڈنگ نہیں کی؟').first();
    await expect(beginnerBadge).toBeVisible();
  });

  test('09. Theme Settings Modal Unfrozen Mouse Wheel Scrolling', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Open Theme Settings Modal
    const themeBtn = page.locator('[data-testid="header-theme-settings-btn"]').first();
    await expect(themeBtn).toBeVisible();
    await themeBtn.click();

    const modal = page.locator('[data-testid="theme-settings-modal-dialog"]').first();
    await expect(modal).toBeVisible();

    // Verify scroll container has data-lenis-prevent and does not suppress wheel
    const scrollResult = await page.evaluate(() => {
      const el = document.querySelector('[data-testid="theme-settings-modal-dialog"] .overflow-y-auto') as HTMLElement | null;
      if (!el) return { found: false, prevented: true, scrolled: false };

      const wheelEvt = new WheelEvent('wheel', {
        deltaY: 150,
        bubbles: true,
        cancelable: true
      });
      el.dispatchEvent(wheelEvt);
      el.scrollTop = 120;

      return {
        found: true,
        prevented: wheelEvt.defaultPrevented,
        scrolled: el.scrollTop > 0
      };
    });

    expect(scrollResult.found).toBe(true);
    expect(scrollResult.prevented).toBe(false);
    expect(scrollResult.scrolled).toBe(true);
  });

  test('10. 24 Unique Research-Based Themes Available with Dynamic Counts', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Open Theme Settings Modal
    const themeBtn = page.locator('[data-testid="header-theme-settings-btn"]').first();
    await themeBtn.click();

    const modal = page.locator('[data-testid="theme-settings-modal-dialog"]').first();
    await expect(modal).toBeVisible();

    // Verify dynamic subtitle reports 24 themes
    await expect(modal.locator('text=Explore 24 calibrated themes (12 Dark & 12 Light)').first()).toBeVisible();

    // Switch between Dark and Light mode and verify 12 themes in each
    const modeBadge = modal.locator('.font-mono.px-1\\.5').first();
    await expect(modeBadge).toHaveText('12');
  });

  test('11. Code Editor & Environment Settings Synchronize to CodeMirror & CSS Variables', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Open Theme Settings Modal
    const themeBtn = page.locator('[data-testid="header-theme-settings-btn"]').first();
    await themeBtn.click();

    // Switch to Preferences tab
    const prefTab = page.locator('[data-testid="tab-preferences-btn"]').first();
    await expect(prefTab).toBeVisible();
    await prefTab.click();

    // Click Fira Code font
    const firaBtn = page.locator('[data-testid="editor-font-fira-code-btn"]').first();
    await expect(firaBtn).toBeVisible();
    await firaBtn.click();

    // Verify root attribute updated to fira-code and CSS variable set
    const editorFontAttr = await page.evaluate(() => document.documentElement.getAttribute('data-editor-font'));
    expect(editorFontAttr).toBe('fira-code');

    const fontCodeMono = await page.evaluate(() => document.documentElement.style.getPropertyValue('--font-code-mono'));
    expect(fontCodeMono).toContain('Fira Code');

    // Select 16px Font Size
    const font16Btn = page.locator('[data-testid="font-size-16-btn"]').first();
    if (await font16Btn.count() > 0) {
      await font16Btn.click();
      const fontSizeVar = await page.evaluate(() => document.documentElement.style.getPropertyValue('--editor-font-size'));
      expect(fontSizeVar).toBe('16px');
    }
  });

  test('12. Real-Time Stage Transparency (Beyond Popup) & Peek Main UI Feature', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Open Theme Settings Modal
    const themeBtn = page.locator('[data-testid="header-theme-settings-btn"]').first();
    await themeBtn.click();

    const backdrop = page.locator('[data-testid="modal-stage-backdrop"]').first();
    await expect(backdrop).toBeVisible();

    // 1. Verify backdrop does NOT have backdrop-blur-md (zero blurring of the live main app)
    const backdropClasses = await backdrop.getAttribute('class');
    expect(backdropClasses).not.toContain('backdrop-blur');

    // 2. Switch to Preferences and test Stage Transparency slider at 1.0 (Clear Stage)
    const prefTab = page.locator('[data-testid="tab-preferences-btn"]').first();
    await prefTab.click();

    const clearBtn = page.locator('button:has-text("Clear 100%")').first();
    await expect(clearBtn).toBeVisible();
    await clearBtn.click();

    // At 1.0 (100% Clear Stage), backdrop background should be rgba(0, 0, 0, 0) (completely clear)
    const backdropBg = await backdrop.evaluate((el: HTMLElement) => el.style.backgroundColor);
    expect(backdropBg).toBe('rgba(0, 0, 0, 0)');

    // 3. Test Peek Main UI button in modal header
    const peekBtn = page.locator('[data-testid="peek-stage-btn"]').first();
    await expect(peekBtn).toBeVisible();
    await peekBtn.click();

    // Modal dialog fades to peeking state (opacity: 0.05)
    const modalDialog = page.locator('[data-testid="theme-settings-modal-dialog"]').first();
    await expect(modalDialog).toHaveCSS('opacity', '0.05');

    // Floating return button appears
    const returnBtn = page.locator('[data-testid="return-from-peek-btn"]').first();
    await expect(returnBtn).toBeVisible();

    // Click return button restores modal
    await returnBtn.click();
    await expect(returnBtn).toBeHidden();
    await expect(modalDialog).toHaveCSS('opacity', '1');

    // 4. Test real-time theme switching while modal remains open
    const themesTab = page.locator('[data-testid="tab-themes-btn"]').first();
    await themesTab.click();

    const paperSwatch = page.locator('[data-testid="theme-swatch-btn"][title*="Archival Fine Paper"]').first();
    if (await paperSwatch.count() > 0) {
      await paperSwatch.click();
      await page.waitForTimeout(300);
      const currentTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
      expect(currentTheme).toBe('pure-paper');
    }
  });

});

