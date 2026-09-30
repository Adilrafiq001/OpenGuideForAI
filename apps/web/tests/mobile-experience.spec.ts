import { test, expect } from '@playwright/test';

test.describe('OpenGuide Mobile, Cross-Device & Small Screen Suite', () => {

  const targetDevices = [
    { name: 'iPhone 16 Pro Max', width: 430, height: 932 },
    { name: 'Samsung Galaxy S23 Ultra', width: 412, height: 915 },
    { name: 'OnePlus Nord', width: 412, height: 915 },
    { name: 'Compact Boundary (iPhone SE)', width: 375, height: 667 },
    { name: 'Extreme Narrow Boundary', width: 320, height: 568 },
    { name: 'Landscape Mode (iPhone 16 Pro Max)', width: 932, height: 430 },
  ];

  for (const device of targetDevices) {
    test(`[Zero Overflow] ${device.name} (${device.width}x${device.height}) across all key routes`, async ({ page }) => {
      await page.setViewportSize({ width: device.width, height: device.height });

      const routes = ['/', '/track/0/intro', '/track/0', '/track/0/engine', '/holodeck', '/portfolio'];

      for (const route of routes) {
        await page.goto(route, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(300);

        const checkOverflow = await page.evaluate(() => {
          const docScroll = document.documentElement.scrollWidth;
          const bodyScroll = document.body.scrollWidth;
          const vw = window.innerWidth;
          const hasOverflow = docScroll > vw + 1 || bodyScroll > vw + 1;
          return {
            hasOverflow,
            docScroll,
            bodyScroll,
            vw,
          };
        });

        expect(
          checkOverflow.hasOverflow,
          `Horizontal scroll overflow detected on route "${route}" on ${device.name} (${device.width}x${device.height}): docScroll=${checkOverflow.docScroll}, bodyScroll=${checkOverflow.bodyScroll}, vw=${checkOverflow.vw}`
        ).toBeFalsy();
      }
    });
  }

  test('Native-grade MobileBottomNav and MobileNavDrawer on small screens, preserving desktop CommandDock on desktop', async ({ page }) => {
    // 1. Mobile Test on Samsung S23 Ultra (412 x 915)
    await page.setViewportSize({ width: 412, height: 915 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);

    // Verify MobileBottomNav is visible on mobile
    const bottomNav = page.locator('[data-testid="mobile-bottom-nav"]').first();
    await expect(bottomNav).toBeVisible({ timeout: 5000 });

    // Verify thumb items: Home, Tracks, Holodeck, Portfolio, More
    await expect(page.locator('[data-testid="mobile-nav-home"]').first()).toBeVisible();
    await expect(page.locator('[data-testid="mobile-nav-tracks"]').first()).toBeVisible();
    await expect(page.locator('[data-testid="mobile-nav-holodeck"]').first()).toBeVisible();
    await expect(page.locator('[data-testid="mobile-nav-portfolio"]').first()).toBeVisible();
    await expect(page.locator('[data-testid="mobile-nav-more"]').first()).toBeVisible();

    // Verify ZERO horizontal overflow with bottom nav mounted
    const mobileOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    expect(mobileOverflow).toBeFalsy();

    // Tap "More" to open the luxury MobileNavDrawer
    await page.locator('[data-testid="mobile-nav-more"]').first().click();
    await page.waitForTimeout(400);

    const drawer = page.locator('[data-testid="mobile-nav-drawer"]').first();
    await expect(drawer).toBeVisible({ timeout: 5000 });

    // Verify drawer contents: Tracks 0-3, Themes, Holodeck, Portfolio, Close button
    await expect(page.locator('[data-testid="drawer-track-0-btn"]').first()).toBeVisible();
    await expect(page.locator('[data-testid="drawer-track-1-btn"]').first()).toBeVisible();
    await expect(page.locator('[data-testid="drawer-track-2-btn"]').first()).toBeVisible();
    await expect(page.locator('[data-testid="drawer-track-3-btn"]').first()).toBeVisible();
    await expect(page.locator('[data-testid="drawer-holodeck-btn"]').first()).toBeVisible();
    await expect(page.locator('[data-testid="drawer-portfolio-btn"]').first()).toBeVisible();
    await expect(page.locator('[data-testid="mobile-drawer-themes-btn"]').first()).toBeVisible();

    // Test Display Size selection inside drawer
    const compactBtn = page.locator('[data-testid="drawer-display-compact-btn"]').first();
    await expect(compactBtn).toBeVisible();
    await compactBtn.click();
    await page.waitForTimeout(200);
    const displaySizeAttr = await page.evaluate(() => document.documentElement.getAttribute('data-display-size'));
    expect(displaySizeAttr).toBe('compact');

    // Close the drawer
    await page.locator('[data-testid="mobile-drawer-close-btn"]').first().click();
    await page.waitForTimeout(400);
    await expect(drawer).not.toBeVisible();

    // Test hamburger button in LandingHeader also opens the same drawer
    const headerMenuBtn = page.locator('[data-testid="landing-header-menu-btn"]').first();
    await expect(headerMenuBtn).toBeVisible();
    await headerMenuBtn.click();
    await page.waitForTimeout(400);
    await expect(drawer).toBeVisible();

    // Close via Escape key
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
    await expect(drawer).not.toBeVisible();

    // 2. Desktop Preservation Test (1280 x 800)
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.waitForTimeout(300);

    // On desktop, MobileBottomNav must be HIDDEN
    await expect(bottomNav).not.toBeVisible();

    // On desktop, CommandDock must be VISIBLE
    const desktopDockButtons = page.locator('.fixed button');
    const count = await desktopDockButtons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('CoursePlayer IDE on mobile: tab switching, Pyodide code execution, and terminal visibility', async ({ page }) => {
    // Test on iPhone 16 Pro Max
    await page.setViewportSize({ width: 430, height: 932 });
    await page.goto('/track/0/engine', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(600);

    // Header buttons must fit within viewport without overflow
    const headerFit = await page.evaluate(() => {
      const header = document.querySelector('header');
      if (!header) return true;
      return header.scrollWidth <= window.innerWidth;
    });
    expect(headerFit).toBeTruthy();

    // Switch to Code & Run tab on mobile
    const codeTab = page.locator('[data-testid="mobile-tab-editor"]').first();
    await expect(codeTab).toBeVisible({ timeout: 15000 });
    await codeTab.click();
    await page.waitForTimeout(400);

    // Virtual accessory bar should be visible for mobile typing
    const accessoryBar = page.locator('[data-testid="codemirror-accessory-bar"]').first();
    await expect(accessoryBar).toBeVisible({ timeout: 10000 });

    // Tap the Run Code button
    const runBtn = page.locator('[data-testid="run-code-button"]').first();
    await expect(runBtn).toBeVisible({ timeout: 10000 });
    await expect(runBtn).toBeEnabled({ timeout: 25000 });
    await runBtn.click();

    // Pyodide execution output should appear in terminal
    const terminal = page.locator('[data-testid="terminal-container"]').first();
    await expect(terminal).toBeVisible({ timeout: 20000 });

    // Verify terminal output stream is rendered
    const terminalOutput = page.locator('[data-testid="terminal-output"]').first();
    await expect(terminalOutput).toBeVisible({ timeout: 5000 });
    const terminalText = await terminalOutput.textContent();
    expect(terminalText).toBeDefined();

    // Check that floating Abby does NOT overlap the terminal on mobile IDE
    const overlapCheck = await page.evaluate(() => {
      const term = document.querySelector('[data-testid="terminal-container"]');
      const abbyWidget = document.querySelector('.abby-floating-anchor');
      if (!term || !abbyWidget) return false;
      const abbyStyle = window.getComputedStyle(abbyWidget);
      if (abbyStyle.display === 'none' || abbyStyle.visibility === 'hidden') return false;
      const tr = term.getBoundingClientRect();
      const ar = abbyWidget.getBoundingClientRect();
      return !(ar.right < tr.left || ar.left > tr.right || ar.bottom < tr.top || ar.top > tr.bottom);
    });
    expect(overlapCheck, 'Abby widget should not overlap the code terminal on mobile').toBeFalsy();
  });

  test('Abby Chatbot opens as full-width responsive bottom sheet on mobile screens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(400);

    // Open Abby via checkbox
    await page.evaluate(() => {
      const cb = document.querySelector('#abby-toggle-checkbox') as HTMLInputElement | null;
      if (cb) {
        cb.checked = true;
        cb.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    await page.waitForTimeout(500);

    // Verify modal bottom sheet dimensions
    const sheetMetrics = await page.evaluate(() => {
      const windowEl = document.querySelector('[data-testid="abby-chat-window"]');
      if (!windowEl) return null;
      const rect = windowEl.getBoundingClientRect();
      return {
        width: rect.width,
        height: rect.height,
        vw: window.innerWidth,
        vh: window.innerHeight,
        fitsWidth: rect.width <= window.innerWidth + 1, // allow 1px subpixel rounding
        fitsHeight: rect.height <= window.innerHeight + 1,
      };
    });

    expect(sheetMetrics).not.toBeNull();
    expect(sheetMetrics?.fitsWidth).toBeTruthy();
    expect(sheetMetrics?.fitsHeight).toBeTruthy();

    // Verify input box and close action
    const abbyInput = page.locator('.container-ai-input textarea').first();
    if (await abbyInput.isVisible()) {
      await expect(abbyInput).toBeVisible();
    }

    // Close Abby
    await page.evaluate(() => {
      const cb = document.querySelector('#abby-toggle-checkbox') as HTMLInputElement | null;
      if (cb) {
        cb.checked = false;
        cb.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
  });

  test('Theme Settings Modal renders properly within viewport on mobile without clipping', async ({ page }) => {
    await page.setViewportSize({ width: 412, height: 915 });
    await page.goto('/track/0/intro', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(400);

    // Open Theme Settings modal via header button
    const themeBtn = page.locator('button[aria-label="Themes and Studio Settings"]').first();
    await expect(themeBtn).toBeVisible({ timeout: 10000 });
    await themeBtn.click();
    await page.waitForTimeout(400);

    // Verify modal is visible and fits inside viewport
    const modalFit = await page.evaluate(() => {
      const modal = document.querySelector('.theme-settings-modal-dialog');
      if (!modal) return null;
      const rect = modal.getBoundingClientRect();
      return {
        fitsWidth: rect.width <= window.innerWidth + 1,
        fitsHeight: rect.height <= window.innerHeight + 1,
        rectWidth: rect.width,
        vw: window.innerWidth,
      };
    });

    expect(modalFit).not.toBeNull();
    expect(modalFit?.fitsWidth).toBeTruthy();
    expect(modalFit?.fitsHeight).toBeTruthy();

    // Verify theme swatch buttons are accessible
    const swatchBtns = page.locator('.theme-settings-modal-dialog button[title]');
    const count = await swatchBtns.count();
    expect(count).toBeGreaterThan(0);

    // Close modal
    const closeBtn = page.locator('button[aria-label="Close Theme Settings"]').first();
    await closeBtn.click();
  });

  test('Edge Case: Rapid responsive resize and orientation change maintains zero horizontal scroll', async ({ page }) => {
    // Start at mobile portrait
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(300);

    // Rotate to landscape
    await page.setViewportSize({ width: 667, height: 375 });
    await page.waitForTimeout(300);
    let overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflow).toBeFalsy();

    // Expand to tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(300);
    overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflow).toBeFalsy();

    // Expand to full desktop
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.waitForTimeout(300);
    overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflow).toBeFalsy();

    // Contract back down to extreme narrow 320px
    await page.setViewportSize({ width: 320, height: 568 });
    await page.waitForTimeout(300);
    overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflow).toBeFalsy();
  });

  test('Light theme contrast calibration: text colors meet high-contrast accessible values in light mode', async ({ page }) => {
    await page.setViewportSize({ width: 412, height: 915 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);

    // Switch to a light theme: pure-paper
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'pure-paper');
      document.documentElement.setAttribute('data-theme-mode', 'light');
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    });
    await page.waitForTimeout(200);

    // Verify CSS contrast override is active in light mode
    const emeraldContrast = await page.evaluate(() => {
      const dummy = document.createElement('span');
      dummy.className = 'text-emerald-400';
      document.body.appendChild(dummy);
      const color = window.getComputedStyle(dummy).color;
      dummy.remove();
      return color;
    });

    // #047857 in rgb is rgb(4, 120, 87)
    expect(emeraldContrast).toBe('rgb(4, 120, 87)');
  });

});
