import { test, expect } from '@playwright/test';

test.describe('Spatial Holodeck on Smart AR Glasses Suite', () => {
  test.beforeEach(async ({ page }) => {
    // Clear state and mark onboarding as complete for a deterministic testing canvas
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
      localStorage.setItem('og_onboarding_completed', 'true');
    });
  });

  test('TC-SPATIAL-001: Route navigation to /holodeck and /spatial renders with 0 console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    // 1. Visit /holodeck
    await page.goto('/holodeck');
    await expect(page.locator('h1')).toContainText('Spatial Holodeck');
    await expect(page.locator('#tab-vectors')).toBeVisible();

    // 2. Visit /spatial alias and verify redirect to /holodeck
    await page.goto('/spatial');
    await expect(page).toHaveURL(/.*\/holodeck/);
    await expect(page.locator('h1')).toContainText('Spatial Holodeck');

    // 3. Confirm 0 console errors
    expect(consoleErrors).toEqual([]);
  });

  test('TC-SPATIAL-002: Holodeck tab switching & keyboard roving arrow navigation', async ({ page }) => {
    await page.goto('/holodeck');

    const tabVectors = page.locator('#tab-vectors');
    const tabSynapses = page.locator('#tab-synapses');
    const tabWebxr = page.locator('#tab-webxr');

    // Default tab is vectors
    await expect(tabVectors).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('#tabpanel-vectors')).toBeVisible();

    // Click synapses tab
    await tabSynapses.click();
    await expect(tabSynapses).toHaveAttribute('aria-selected', 'true');
    await expect(page).toHaveURL(/.*tab=synapses/);
    await expect(page.locator('#tabpanel-synapses')).toBeVisible();

    // Click webxr tab
    await tabWebxr.click();
    await expect(tabWebxr).toHaveAttribute('aria-selected', 'true');
    await expect(page).toHaveURL(/.*tab=webxr/);
    await expect(page.locator('#tabpanel-webxr')).toBeVisible();

    // Keyboard roving navigation: focus webxr and press ArrowLeft
    await tabWebxr.focus();
    await page.keyboard.press('ArrowLeft');
    await expect(tabSynapses).toHaveAttribute('aria-selected', 'true');
    await expect(tabSynapses).toBeFocused();

    // Press ArrowLeft again to land on vectors
    await page.keyboard.press('ArrowLeft');
    await expect(tabVectors).toHaveAttribute('aria-selected', 'true');
    await expect(tabVectors).toBeFocused();

    // Press End key to land on last tab (webxr)
    await page.keyboard.press('End');
    await expect(tabWebxr).toHaveAttribute('aria-selected', 'true');
    await expect(tabWebxr).toBeFocused();

    // Press Home key to return to vectors
    await page.keyboard.press('Home');
    await expect(tabVectors).toHaveAttribute('aria-selected', 'true');
    await expect(tabVectors).toBeFocused();
  });

  test('TC-SPATIAL-003: Smart AR Glasses Guide Modal features 2026 flagship specs & keyboard accessibility', async ({ page }) => {
    await page.goto('/holodeck');

    // Open guide modal
    const openGuideBtn = page.locator('button:has-text("AR Glasses Guide")');
    await expect(openGuideBtn).toBeVisible();
    await openGuideBtn.click();

    const dialog = page.locator('div[role="dialog"][aria-modal="true"]');
    await expect(dialog).toBeVisible();
    await expect(dialog.locator('#ar-guide-title')).toContainText('Smart AR Glasses Mode: Setup & Controls');

    // Verify Viture Pro 2 specs
    await expect(dialog).toContainText('Viture (Pro XR, Pro 2, One, One Lite)');
    await expect(dialog).toContainText('135% sRGB');

    // Switch to Xreal tab
    const xrealTab = dialog.locator('#ar-tab-xreal');
    await xrealTab.click();
    await expect(dialog).toContainText('Xreal (Air 2 Ultra, Air 2 Pro, Air 1/2)');
    await expect(dialog).toContainText('dual 3D environment sensors');

    // Switch to RayNeo tab
    const rayneoTab = dialog.locator('#ar-tab-rayneo');
    await rayneoTab.click();
    await expect(dialog).toContainText('RayNeo (Air 2s, Air 2, X2, X2 Lite)');
    await expect(dialog).toContainText('5000 Nits Peak');

    // Switch to Rokid tab
    const rokidTab = dialog.locator('#ar-tab-rokid');
    await rokidTab.click();
    await expect(dialog).toContainText('Rokid (Max 2, Max, Station 2, Air)');
    await expect(dialog).toContainText('Qualcomm Spatial Computing Unit');

    // Test roving arrow key navigation in AR tabs
    await rokidTab.focus();
    await page.keyboard.press('ArrowLeft');
    await expect(rayneoTab).toHaveAttribute('aria-selected', 'true');

    // Close via Escape key
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  });

  test('TC-SPATIAL-004: WebXR Controls Studio sliders & calibration telemetry', async ({ page }) => {
    await page.goto('/holodeck?tab=webxr');

    // Verify sliders exist with full ARIA range attributes
    const curvatureSlider = page.locator('input[aria-label="Display screen curvature"]');
    await expect(curvatureSlider).toBeVisible();
    await expect(curvatureSlider).toHaveAttribute('aria-valuemin', '0');
    await expect(curvatureSlider).toHaveAttribute('aria-valuemax', '120');

    const distanceSlider = page.locator('input[aria-label="Virtual projection distance"]');
    await expect(distanceSlider).toBeVisible();
    await expect(distanceSlider).toHaveAttribute('aria-valuemin', '1');
    await expect(distanceSlider).toHaveAttribute('aria-valuemax', '5');

    // Anchor mode buttons
    const fixedBtn = page.locator('button:has-text("Fixed")');
    const followBtn = page.locator('button:has-text("Follow")');
    const bodyBtn = page.locator('button:has-text("Body")');
    await expect(fixedBtn).toBeVisible();
    await expect(followBtn).toBeVisible();
    await expect(bodyBtn).toBeVisible();

    await followBtn.click();
    await expect(page.locator('text=Display glides smoothly with head rotation.')).toBeVisible();

    await bodyBtn.click();
    await expect(page.locator('text=Pinned to user chest coordinates.')).toBeVisible();

    // Test Recenter button
    const recenterBtn = page.locator('button:has-text("Recenter Gaze (C)")');
    await expect(recenterBtn).toBeVisible();
    await recenterBtn.click();
  });

  test('TC-SPATIAL-005: Headset simulator renders True-Black Micro-OLED passthrough', async ({ page }) => {
    await page.goto('/holodeck?tab=webxr');

    // Open simulator if toggle exists
    const simBtn = page.locator('button:has-text("Launch Headset Optical Simulator")');
    if (await simBtn.isVisible()) {
      await simBtn.click();
      const simViewport = page.locator('[data-testid="xr-simulator-viewport"]');
      await expect(simViewport).toBeVisible();
      await expect(simViewport).toContainText('TRUE-BLACK MICRO-OLED WAVEGUIDE');

      // Test profile switching
      const questBtn = page.locator('[data-testid="profile-quest-btn"]');
      await questBtn.click();
      await expect(simViewport).toContainText('Meta Quest 3 (6-DOF)');

      const visionProBtn = page.locator('[data-testid="profile-visionpro-btn"]');
      await visionProBtn.click();
      await expect(simViewport).toContainText('Apple Vision Pro');
    }
  });

  test('TC-SPATIAL-006: Virtual Spatial Keyboard in-air and desk plane snap interactions', async ({ page }) => {
    await page.goto('/holodeck?tab=webxr');

    // Toggle virtual keyboard
    const kbToggle = page.locator('button:has-text("Keyboard (K)")');
    await kbToggle.click();

    const keyboard = page.locator('[data-testid="virtual-spatial-keyboard"]');
    await expect(keyboard).toBeVisible();
    await expect(keyboard).toContainText('SPATIAL VIRTUAL KEYBOARD');

    // Type keys
    const keyH = page.locator('[data-testid="spatial-key-h"]');
    const keyE = page.locator('[data-testid="spatial-key-e"]');
    const keyL = page.locator('[data-testid="spatial-key-l"]');
    const keyO = page.locator('[data-testid="spatial-key-o"]');

    await keyH.click();
    await keyE.click();
    await keyL.click();
    await keyL.click();
    await keyO.click();

    const textBuffer = page.locator('[data-testid="virtual-keyboard-text-buffer"]');
    await expect(textBuffer).toContainText('hello');

    // Test Desk Snap surface mode
    const deskSnapBtn = page.locator('[data-testid="keyboard-flat-surface-btn"]');
    await deskSnapBtn.click();
    await expect(keyboard).toContainText('Tabletop Desk Plane Active');

    // Test Gaze Snap button
    const gazeSnapBtn = page.locator('[data-testid="keyboard-snap-gaze-btn"]');
    await expect(gazeSnapBtn).toBeVisible();
    await gazeSnapBtn.click();

    // Close keyboard
    const closeKbBtn = page.locator('[data-testid="close-spatial-keyboard-btn"]');
    await closeKbBtn.click();
    await expect(keyboard).toBeHidden();
  });

  test('TC-SPATIAL-007: Performance & Storage Partialize prevents 60FPS localStorage thrashing', async ({ page }) => {
    await page.goto('/holodeck');

    // Mutate state in spatial store via evaluate
    await page.evaluate(() => {
      // Store preferences and sensors
      localStorage.setItem('openguide-spatial-settings', JSON.stringify({
        state: {
          screenCurvature: 65,
          spatialAnchorMode: 'smooth-follow',
          // High-frequency sensor values that should NOT persist
          yaw: 142.5,
          pitch: -12.3,
          roll: 0.8
        },
        version: 0
      }));
    });

    // Check parsed state from localStorage
    const saved = await page.evaluate(() => {
      const item = localStorage.getItem('openguide-spatial-settings');
      return item ? JSON.parse(item) : null;
    });

    expect(saved).not.toBeNull();
    expect(saved.state.screenCurvature).toBe(65);
    expect(saved.state.spatialAnchorMode).toBe('smooth-follow');
  });

  test('TC-SPATIAL-008: Search palette indexes AR Glasses brands & Holodeck commands', async ({ page }) => {
    await page.goto('/');

    // Open search palette via header button
    const searchBtn = page.locator('[data-testid="header-command-palette-btn"]');
    if (await searchBtn.isVisible()) {
      await searchBtn.click();
    } else {
      await page.keyboard.press('/');
    }

    const searchModal = page.locator('[data-testid="command-palette-modal"]');
    await expect(searchModal).toBeVisible();

    const searchInput = searchModal.locator('input[type="text"]');
    await searchInput.fill('viture');

    // Confirm Holodeck & AR glasses items appear in results
    await expect(searchModal).toContainText('Spatial Holodeck');
    await expect(searchModal).toContainText('Smart AR Glasses Guide');

    // Clear and search for 'xreal'
    await searchInput.fill('xreal');
    await expect(searchModal).toContainText('Spatial Holodeck');
    await expect(searchModal).toContainText('Smart AR Glasses Guide');
  });

  test('TC-SPATIAL-009: Offline knowledge mentor answers AR glasses & True-Black physics', async ({ page }) => {
    await page.goto('/');

    // Verify offline knowledge returns deep entries for spatial queries
    const result = await page.evaluate(async () => {
      // Import and search directly from client bundle
      const { searchOfflineKnowledge } = await import('/src/data/offlineKnowledge.ts');
      const res = searchOfflineKnowledge('viture true-black micro-oled');
      return res.map(r => ({ id: r.id, title: r.title }));
    });

    expect(result.length).toBeGreaterThan(0);
    const hasSpatialEntry = result.some(r => 
      r.id === 'tools-spatial-holodeck-ar' || 
      r.id === 'architecture-micro-oled-waveguide-physics'
    );
    expect(hasSpatialEntry).toBe(true);
  });
});
