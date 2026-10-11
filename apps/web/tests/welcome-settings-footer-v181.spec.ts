import { test, expect } from '@playwright/test';

test.describe('Welcome Dialog, Settings, Languages & Footer v1.8.1 Suite', () => {
  test('TC-WSF-001: Announcement Pill "What\'s New" opens ChangelogModal without redirecting to /settings', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
      localStorage.setItem('og_onboarding_completed', 'true');
      sessionStorage.removeItem('og_announcement_dismissed_1.8.1');
    });
    await page.reload();

    // Verify announcement pill is visible
    const whatsNewBtn = page.getByRole('button', { name: "What's New" });
    await expect(whatsNewBtn).toBeVisible({ timeout: 5000 });

    // Click "What's New"
    await whatsNewBtn.click();

    // Verify Changelog Modal is open
    const changelogModal = page.getByRole('dialog', { name: "Platform Changelog & Release Milestones" });
    await expect(changelogModal).toBeVisible();
    await expect(changelogModal.getByText(/v1\.\d+\.\d+ Active/)).toBeVisible();

    // Verify URL did NOT change to /settings
    expect(page.url()).not.toContain('/settings');

    // Close Changelog modal
    const closeBtn = page.getByRole('button', { name: 'Close changelog modal' });
    await closeBtn.click();
    await expect(changelogModal).not.toBeVisible();

    // Confirm 0 console errors
    expect(consoleErrors).toEqual([]);
  });

  test('TC-WSF-002: Welcome Dialog Atmosphere selection provides balanced 4 Dark and 4 Light themes with WCAG AAA badges', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
      localStorage.removeItem('og_onboarding_completed');
    });
    await page.reload();

    const welcomeDialog = page.getByTestId('first-time-setup-modal');
    await expect(welcomeDialog).toBeVisible({ timeout: 5000 });

    // Step 1: Atmosphere & Language
    await expect(welcomeDialog.getByText('Choose Studio Atmosphere')).toBeVisible();

    // Verify Dark Themes (4 options)
    const darkThemes = ['Obsidian', 'Nordic Frost', 'Cyberpunk Neon', 'Claude Warm Dark'];
    for (const name of darkThemes) {
      await expect(welcomeDialog.getByRole('button', { name: new RegExp(name, 'i') })).toBeVisible();
    }

    // Verify Light Themes (4 options)
    const lightThemes = ['Archival Fine Paper', 'E-Ink Papyrus', 'Claude Warm Ivory', 'GitHub Primer Light'];
    for (const name of lightThemes) {
      await expect(welcomeDialog.getByRole('button', { name: new RegExp(name, 'i') })).toBeVisible();
    }

    // Verify WCAG AAA badge is present
    await expect(welcomeDialog.getByText('WCAG AAA').first()).toBeVisible();
  });

  test('TC-WSF-003: Welcome Dialog renders all 12 supported languages with native scripts & codes', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
      localStorage.removeItem('og_onboarding_completed');
    });
    await page.reload();

    const welcomeDialog = page.getByTestId('first-time-setup-modal');
    await expect(welcomeDialog).toBeVisible({ timeout: 5000 });

    // Check language buttons for all 12 languages in Step 1
    const codes = ['en', 'ur', 'ar', 'es', 'zh', 'hi', 'fr', 'de', 'ja', 'pt', 'ru', 'it'];
    for (const code of codes) {
      await expect(welcomeDialog.getByTestId(`welcome-lang-${code}-btn`)).toBeVisible();
    }

    // Verify native script rendering
    await expect(welcomeDialog.getByText('اردو')).toBeVisible();
    await expect(welcomeDialog.getByText('العربية')).toBeVisible();
    await expect(welcomeDialog.getByText('हिन्दी')).toBeVisible();
  });

  test('TC-WSF-004: Welcome Dialog Step 2 prompts for starting pathway and syncs with usePathStore', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
      localStorage.removeItem('og_onboarding_completed');
    });
    await page.reload();

    const welcomeDialog = page.getByTestId('first-time-setup-modal');
    await expect(welcomeDialog).toBeVisible({ timeout: 5000 });

    // Advance to Step 2 using Continue button
    const continueBtn = welcomeDialog.getByRole('button', { name: 'Continue' });
    await continueBtn.click();

    // Verify Step 2 is active
    await expect(welcomeDialog.getByText('Choose Your Starting Pathway')).toBeVisible();

    // Verify Pathway Options: Deep AI Engineer and The Builder Path
    const engineerOption = welcomeDialog.getByRole('radio', { name: /The Deep AI Engineer/i });
    const builderOption = welcomeDialog.getByRole('radio', { name: /The Builder Path/i });
    await expect(engineerOption).toBeVisible();
    await expect(builderOption).toBeVisible();

    // Select The Builder Path
    await builderOption.click();
    await expect(builderOption).toHaveAttribute('aria-checked', 'true');

    // Advance to Step 3
    await continueBtn.click();
    await expect(welcomeDialog.getByText('Install as Native Desktop / Mobile App')).toBeVisible();

    // Advance to Step 4
    await continueBtn.click();
    await expect(welcomeDialog.getByText('Your studio is calibrated and ready')).toBeVisible();

    // Launch Builder Track B0
    const launchBuilderBtn = welcomeDialog.getByText('Jump to Track B0: First AI Project');
    await expect(launchBuilderBtn).toBeVisible();
    await launchBuilderBtn.click();

    // Verify modal dismissed and URL routes to /builder/0/intro
    await expect(welcomeDialog).not.toBeVisible();
    await expect(page).toHaveURL(/.*\/builder\/0\/intro/);
  });

  test('TC-WSF-005: ThemeSettingsModal Preferences includes all 12 languages and radiogroup semantics', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
      localStorage.setItem('og_onboarding_completed', 'true');
    });
    await page.reload();

    // Open Theme Settings modal via header or dock
    const themeBtn = page.locator('button:has-text("Themes and Studio Settings"), button:has-text("Theme Settings")').first();
    await themeBtn.click();

    const settingsDialog = page.getByRole('dialog', { name: 'Workspace Personalization' });
    await expect(settingsDialog).toBeVisible();

    // Click "Editor & Environment" tab
    const prefsTab = settingsDialog.getByRole('button', { name: /Editor & Environment/i });
    await prefsTab.click();
    await expect(prefsTab).toHaveAttribute('aria-pressed', 'true');

    // Verify Studio Language & Script Localization section is visible
    await expect(settingsDialog.getByText('Studio Language & Native Script Localization')).toBeVisible();
    await expect(settingsDialog.getByText('12 Languages', { exact: true })).toBeVisible();

    // Check language buttons in settings
    await expect(settingsDialog.getByTestId('settings-lang-en-btn')).toBeVisible();
    await expect(settingsDialog.getByTestId('settings-lang-ur-btn')).toBeVisible();
    await expect(settingsDialog.getByTestId('settings-lang-ja-btn')).toBeVisible();

    // Verify radiogroup roles for Interface scale, Monospace font, WASM Heap, Compute profiles, and AI provider
    const scaleRadiogroup = settingsDialog.getByRole('radiogroup', { name: 'Interface Scale' });
    await expect(scaleRadiogroup).toBeVisible();
    await expect(scaleRadiogroup.getByRole('radio', { name: 'compact' })).toBeVisible();

    const fontRadiogroup = settingsDialog.getByRole('radiogroup', { name: 'Code Monospace Font' });
    await expect(fontRadiogroup).toBeVisible();

    const wasmRadiogroup = settingsDialog.getByRole('radiogroup', { name: 'WASM Virtual Memory Heap' });
    await expect(wasmRadiogroup).toBeVisible();

    const computeRadiogroup = settingsDialog.getByRole('radiogroup', { name: 'Active Compute and Rendering Profile' });
    await expect(computeRadiogroup).toBeVisible();

    const providerRadiogroup = settingsDialog.getByRole('radiogroup', { name: 'AI Provider' });
    await expect(providerRadiogroup).toBeVisible();

    // Close settings modal
    const closeBtn = settingsDialog.getByTestId('close-theme-modal-btn');
    await closeBtn.click();
    await expect(settingsDialog).not.toBeVisible();
  });

  test('TC-WSF-006: StudioFooter contains Builder Tracks sitemap, email autocomplete, and accessible sponsor links', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
      localStorage.setItem('og_onboarding_completed', 'true');
    });
    await page.reload();

    const footer = page.locator('footer');
    await footer.scrollIntoViewIfNeeded();

    // Verify "The Builder Path" sitemap section
    await expect(footer.getByText('The Builder Path (Tracks B0 – B7)')).toBeVisible();
    await expect(footer.getByRole('button', { name: /Track B0: First AI Project/i })).toBeVisible();

    // Verify newsletter input has autocomplete="email"
    const newsletterInput = footer.locator('input[type="email"]');
    await expect(newsletterInput).toBeVisible();
    await expect(newsletterInput).toHaveAttribute('autocomplete', 'email');

    // Click "Release Notes" button in footer
    const footerChangelogBtn = footer.getByRole('button', { name: 'Release Notes' });
    await footerChangelogBtn.click();

    // Verify Changelog modal opens
    const changelogModal = page.getByRole('dialog', { name: "Platform Changelog & Release Milestones" });
    await expect(changelogModal).toBeVisible();
    await expect(changelogModal.getByText(/v1\.\d+\.\d+ Active/)).toBeVisible();

    // Close Changelog modal
    await changelogModal.getByRole('button', { name: 'Close changelog modal' }).click();
    await expect(changelogModal).not.toBeVisible();
  });

  test('TC-WSF-007: LanguageSelector dropdown supports keyboard arrow navigation & aria-activedescendant', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
      localStorage.setItem('og_onboarding_completed', 'true');
    });
    await page.reload();

    const langBtn = page.getByRole('button', { name: 'Select interface language' });
    await langBtn.click();

    const listbox = page.getByRole('listbox', { name: 'Select Language' });
    await expect(listbox).toBeVisible();

    // Verify listbox has aria-activedescendant
    await expect(listbox).toHaveAttribute('aria-activedescendant', /lang-opt-/);

    // Press ArrowDown to navigate through options
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Escape');
    await expect(listbox).not.toBeVisible();
  });
});
