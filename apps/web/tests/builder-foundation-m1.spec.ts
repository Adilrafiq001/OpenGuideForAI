import { test, expect } from '@playwright/test';

test.describe('Builder Path Milestone 1 — Foundation, Fork & Hero Suite', () => {
  test.beforeEach(async ({ page }) => {
    // Clear and set onboarding as completed to isolate pathway verification
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
      localStorage.setItem('og_onboarding_completed', 'true');
    });
    await page.reload();
  });

  test('TC-BUILDER-M1-001: Hero displays dual-path title and dual CTAs', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto('/');

    // 1. Verify display headline: "/ Zero To AI Engineer & Builder."
    const heroTitle = page.locator('h1');
    await expect(heroTitle).toBeVisible();
    await expect(heroTitle).toContainText('/Zero To');
    await expect(heroTitle).toContainText('AI Engineer & Builder.');

    // 2. Verify dual high-agency CTAs are present
    const builderCta = page.locator('[data-testid="hero-start-as-builder-btn"]');
    const engineerCta = page.locator('[data-testid="hero-deep-ai-engineer-btn"]');
    await expect(builderCta).toBeVisible();
    await expect(engineerCta).toBeVisible();

    await expect(builderCta).toContainText('Start as Builder');
    await expect(engineerCta).toContainText('Deep AI Engineer');

    // 3. Verify 30-second path guide link
    const guideLink = page.locator('[data-testid="hero-guide-toggle-btn"]');
    await expect(guideLink).toBeVisible();

    expect(errors.filter(e => !e.includes('favicon'))).toEqual([]);
  });

  test('TC-BUILDER-M1-002: Onboarding Fork modal opens, persists preference, and routes cleanly', async ({ page }) => {
    await page.goto('/');

    // Click 30-second guide link in hero to trigger modal
    const guideLink = page.locator('[data-testid="hero-guide-toggle-btn"]');
    await expect(guideLink).toBeVisible();
    await guideLink.click();

    // Verify modal dialog opens
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText('What Brings You Here Today?');

    // Select The Builder Path
    const startAsBuilderOption = dialog.locator('button:has-text("The Builder Path")');
    await expect(startAsBuilderOption).toBeVisible();
    await startAsBuilderOption.click();

    // Verify modal closes and routes to /builder/0/intro
    await expect(page).toHaveURL(/\/builder\/0\/intro/);

    // Verify localStorage persistence
    const savedPath = await page.evaluate(() => localStorage.getItem('openguide:path-preference'));
    expect(savedPath).toBe('builder');
  });

  test('TC-BUILDER-M1-003: Header Path Switcher toggles and Tracks menu displays dual paths', async ({ page }) => {
    await page.goto('/');

    // Header path switcher pill should be visible
    const pathSwitcher = page.locator('[data-testid="header-path-switcher-btn"]');
    await expect(pathSwitcher).toBeVisible();

    // Click Tracks menu button in header
    const tracksMenuBtn = page.locator('#nav-tracks-menu');
    await expect(tracksMenuBtn).toBeVisible();
    await tracksMenuBtn.click();

    // Dropdown menu should show dual-path tabs
    const builderTab = page.locator('[data-testid="tracks-tab-builder"]');
    const engineerTab = page.locator('[data-testid="tracks-tab-engineer"]');
    await expect(builderTab).toBeVisible();
    await expect(engineerTab).toBeVisible();

    // Switch to Builder tab
    await builderTab.click();
    const header = page.locator('header');
    await expect(header.getByText('B0: Say It')).toBeVisible();
    await expect(header.getByText('B7: Prove It')).toBeVisible();

    // Switch to Engineer tab
    await engineerTab.click();
    await expect(header.getByText('Track 0: Absolute Zero')).toBeVisible();
    await expect(header.getByText('Track 7: Generative Diffusion')).toBeVisible();
  });

  test('TC-BUILDER-M1-004: Route /builder/0/intro renders Track B0 briefing with modules B0.1-B0.3', async ({ page }) => {
    await page.goto('/builder/0/intro');

    // Title and badge
    await expect(page.locator('h1')).toContainText('Track B0: Say It');
    const badge = page.locator('[data-testid="track-badge"]');
    await expect(badge).toBeVisible();
    await expect(badge).toContainText('SAY IT');

    // Modules
    await expect(page.locator('text=Module B0.1: What Software Really Is')).toBeVisible();
    await expect(page.locator('text=Module B0.2: Your First Working Screen')).toBeVisible();
    await expect(page.locator('text=Module B0.3: Reading the Result')).toBeVisible();

    // Launch Code Engine button
    const launchBtn = page.locator('button:has-text("INITIALIZE WORKSPACE NOW")').first();
    await expect(launchBtn).toBeVisible();
    await launchBtn.click();

    // Verify navigation to /builder/0/engine
    await expect(page).toHaveURL(/\/builder\/0\/engine/);
  });

  test('TC-BUILDER-M1-005: Route /builder redirects to /builder/0/intro', async ({ page }) => {
    await page.goto('/builder');
    await expect(page).toHaveURL(/\/builder\/0\/intro/);
  });

  test('TC-BUILDER-M1-006: Mobile viewport (375px) has zero horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Verify no horizontal overflow
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasHorizontalScroll).toBe(false);

    // Open mobile drawer
    const drawerBtn = page.locator('button[aria-label="Open navigation menu"]');
    if (await drawerBtn.isVisible()) {
      await drawerBtn.click();
      const drawer = page.locator('#mobile-nav-drawer');
      await expect(drawer).toBeVisible();
      await expect(drawer).toContainText('PATHWAY FOCUS');
    }
  });
});
