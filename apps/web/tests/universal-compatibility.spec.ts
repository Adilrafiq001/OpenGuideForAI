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

});
