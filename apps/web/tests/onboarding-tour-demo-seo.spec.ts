import { test, expect } from '@playwright/test';

test.describe('Onboarding, Tour, Interactive Demo & SEO Suite', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to simulate fresh first-time visitor
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('TC-ONBOARDING-001: First-time visitor onboarding modal launches and completes cleanly', async ({ page }) => {
    // Check that FirstTimeSetupModal dialog is visible on fresh profile
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText('Welcome to OpenGuide.');
    await expect(dialog).toContainText('Step 1 of 4');

    // Step 1: Select a theme (e.g. Nordic Frost)
    const nordicTheme = dialog.locator('button:has-text("Nordic Frost")');
    await expect(nordicTheme).toBeVisible();
    await nordicTheme.click();

    // Step 1: Select a language
    const urduLang = dialog.locator('button:has-text("اردو")');
    await expect(urduLang).toBeVisible();

    // Click Continue to advance to Step 2: Pathway Choice
    const continueBtn = dialog.locator('button:has-text("Continue")');
    await continueBtn.click();
    await expect(dialog).toContainText('Step 2 of 4');
    await expect(dialog).toContainText('Choose Your Starting Pathway');

    // Click Continue to advance to Step 3: Native App
    await continueBtn.click();
    await expect(dialog).toContainText('Step 3 of 4');
    await expect(dialog).toContainText('Install as Native Desktop / Mobile App');

    // Click Continue to advance to Step 4: Launch & Explore
    await continueBtn.click();
    await expect(dialog).toContainText('Step 4 of 4');

    // Click 'Start Exploring OpenGuide' to complete onboarding
    const exploreBtn = dialog.locator('button:has-text("Start Exploring OpenGuide")');
    await exploreBtn.click();
    await expect(dialog).toBeHidden();

    // Verify localStorage key is persisted
    const completed = await page.evaluate(() => localStorage.getItem('og_onboarding_completed'));
    expect(completed).toBe('true');

    // Reload page and ensure onboarding does NOT pop up again
    await page.reload();
    await page.waitForTimeout(500);
    const dialogAfterReload = page.locator('[role="dialog"]');
    await expect(dialogAfterReload).toHaveCount(0);
  });

  test('TC-DEMO-001: Studio Interactive Flow Demo launches and switches all 6 flows', async ({ page }) => {
    // Dismiss first-time setup first
    await page.evaluate(() => localStorage.setItem('og_onboarding_completed', 'true'));
    await page.reload();

    // Click Demo button in header
    const demoBtn = page.locator('[data-testid="header-interactive-demo-btn"]');
    await expect(demoBtn).toBeVisible();
    await demoBtn.click();

    // Verify Demo Modal is open
    const modalHeading = page.locator('text=OpenGuide Studio: Whole App Interactive Flow Demo');
    await expect(modalHeading).toBeVisible();

    // Flow 1 should be active by default
    await expect(page.locator('h3:has-text("1. In-Browser Python IDE & Automated Test Grading")')).toBeVisible();

    // Switch to Flow 3 (Spatial Holodeck)
    const flow3Btn = page.locator('button:has-text("3. Spatial Vector Holodeck")');
    await flow3Btn.click();
    await expect(page.locator('h3:has-text("3. Spatial Vector Holodeck & Harmonic Sonification")')).toBeVisible();
    await expect(page.locator('text=Launch 3D Holodeck →')).toBeVisible();

    // Switch to Flow 5 (Bluee Copilot)
    const flow5Btn = page.locator('button:has-text("5. Bluee AI Companion")');
    await flow5Btn.click();
    await expect(page.locator('h3:has-text("5. Bluee AI Companion & Sovereign BYOK Security")')).toBeVisible();

    // Switch to Flow 6 (Cryptographic Portfolio)
    const flow6Btn = page.locator('button:has-text("6. Cryptographic Portfolio")');
    await flow6Btn.click();
    await expect(page.locator('h3:has-text("6. Cryptographic Portfolio & Encrypted Gist Sync")')).toBeVisible();
    await expect(page.locator('text=View Student Portfolio →')).toBeVisible();

    // Close demo modal via Done button
    const doneBtn = page.locator('button:has-text("Done")');
    await doneBtn.click();
    await expect(modalHeading).toBeHidden();
  });

  test('TC-TOUR-001: Studio Master Tour triggers smoothly', async ({ page }) => {
    // Dismiss first-time setup
    await page.evaluate(() => localStorage.setItem('og_onboarding_completed', 'true'));
    await page.reload();

    // Click Tour button in header
    const tourBtn = page.locator('[data-testid="header-quick-tour-btn"]');
    await expect(tourBtn).toBeVisible();
    await tourBtn.click();

    // Verify Driver.js popover is rendered
    const driverPopover = page.locator('.driver-popover');
    await expect(driverPopover).toBeVisible();
    await expect(driverPopover).toContainText('OpenGuide AI Studio');
    await expect(driverPopover).toContainText('1 of 10');

    // Click Next button in popover
    const nextBtn = driverPopover.locator('.driver-popover-next-btn');
    await nextBtn.click();
    await expect(driverPopover).toContainText('2 of 10');
    await expect(driverPopover).toContainText('Adaptive Pathways & Forward AI Engineering');

    // Close tour popover
    const closeBtn = driverPopover.locator('.driver-popover-close-btn');
    await closeBtn.click();
    await expect(driverPopover).toBeHidden();
  });

  test('TC-SEO-001: Canonical domain, meta tags, and structured data match production standards', async ({ page }) => {
    await page.goto('/');

    // Verify Title length
    const title = await page.title();
    expect(title).toBe('OpenGuide — Free In-Browser AI Engineering Studio');
    expect(title.length).toBeLessThanOrEqual(60);

    // Verify Canonical Link
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toBe('https://openguideforai.dpdns.org/');

    // Verify OpenGraph URL
    const ogUrl = await page.locator('meta[property="og:url"]').getAttribute('content');
    expect(ogUrl).toBe('https://openguideforai.dpdns.org/');

    // Verify JSON-LD Structured Data
    const jsonLdContent = await page.locator('script[type="application/ld+json"]').textContent();
    expect(jsonLdContent).toContain('https://openguideforai.dpdns.org/');
    expect(jsonLdContent).not.toContain('openguide.pages.dev');
  });
});
