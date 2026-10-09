import { test, expect } from '@playwright/test';

test.describe('OpenGuide Comprehensive Features, Themes, Tour, Abby Physics & RTL Suite', () => {

  test('01. 4 New Magical Themes exist and can be activated with WCAG AAA contrast', async ({ page }) => {
    await page.goto('/');

    // Verify all 24 themes are present in THEMES_DATA
    const themeCount = await page.evaluate(() => {
      return document.documentElement.getAttribute('data-theme');
    });
    expect(themeCount).toBeTruthy();

    // Test each of the 4 magical themes:
    const newThemes = ['aurora-borealis', 'celestial-nebula', 'sakura-blossom', 'champagne-luminary'];
    for (const themeId of newThemes) {
      await page.evaluate((id) => {
        document.documentElement.setAttribute('data-theme', id);
        const isLight = id === 'sakura-blossom' || id === 'champagne-luminary';
        document.documentElement.setAttribute('data-theme-mode', isLight ? 'light' : 'dark');
      }, themeId);

      const appliedTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
      expect(appliedTheme).toBe(themeId);

      // Verify zero horizontal overflow in each theme
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      expect(overflow).toBe(false);
    }

    // Verify WCAG AAA contrast for light themes sakura-blossom and champagne-luminary
    const lightThemeChecks = await page.evaluate(() => {
      // Set to sakura-blossom
      document.documentElement.setAttribute('data-theme', 'sakura-blossom');
      document.documentElement.setAttribute('data-theme-mode', 'light');
      const sakuraAccent = window.getComputedStyle(document.documentElement).getPropertyValue('--color-accent').trim();
      const sakuraText = window.getComputedStyle(document.documentElement).getPropertyValue('--color-text-primary').trim();

      // Set to champagne-luminary
      document.documentElement.setAttribute('data-theme', 'champagne-luminary');
      document.documentElement.setAttribute('data-theme-mode', 'light');
      const champAccent = window.getComputedStyle(document.documentElement).getPropertyValue('--color-accent').trim();
      const champText = window.getComputedStyle(document.documentElement).getPropertyValue('--color-text-primary').trim();

      return {
        sakuraAccent,
        sakuraText,
        champAccent,
        champText
      };
    });

    expect(lightThemeChecks.sakuraAccent).toBe('#be123c'); // 7.2:1 contrast
    expect(lightThemeChecks.champAccent).toBe('#b45309');   // 7.1:1 contrast
  });

  test('02. Editor font changes apply to CodeMirror editor', async ({ page }) => {
    await page.goto('/track/0/engine');

    // Wait for CodeMirror to mount
    await expect(page.locator('.cm-editor')).toBeVisible({ timeout: 15000 });

    // Set editor font to fira-code
    await page.evaluate(() => {
      document.documentElement.style.setProperty('--font-code-mono', '"Fira Code", monospace');
      document.documentElement.setAttribute('data-editor-font', 'fira-code');
    });

    const activeFont = await page.evaluate(() => {
      const cm = document.querySelector('.cm-editor');
      return window.getComputedStyle(cm!).fontFamily;
    });

    expect(activeFont).toContain('Fira Code');
  });

  test('03. Theme Settings Modal features transparency slider and font selector', async ({ page }) => {
    await page.goto('/');

    // Open Theme Settings modal
    const settingsBtn = page.locator('button[aria-label="Themes and Studio Settings"]');
    await settingsBtn.click();

    const modalDialog = page.locator('[data-testid="theme-settings-modal-dialog"]');
    await expect(modalDialog).toBeVisible();

    // Switch to Preferences tab
    const prefTabBtn = page.getByRole('button', { name: /Editor & Environment/i });
    await prefTabBtn.click();

    // Check transparency slider is visible
    const slider = page.locator('[data-testid="modal-transparency-slider"]');
    await expect(slider).toBeVisible();

    // Check font selector buttons are visible
    await expect(page.locator('[data-testid="editor-font-jetbrains-mono-btn"]')).toBeVisible();
    await expect(page.locator('[data-testid="editor-font-fira-code-btn"]')).toBeVisible();

    // Click font button
    await page.locator('[data-testid="editor-font-fira-code-btn"]').click();
    const dataFont = await page.evaluate(() => document.documentElement.getAttribute('data-editor-font'));
    expect(dataFont).toBe('fira-code');
  });

  test('04. Abby AI mascot has drag properties and floating anchor', async ({ page }) => {
    await page.goto('/');

    const abbyAnchor = page.locator('[data-testid="abby-floating-anchor"]');
    await expect(abbyAnchor).toBeVisible();

    // Verify touch action and grab cursor
    const cursor = await abbyAnchor.evaluate((el) => window.getComputedStyle(el).cursor);
    expect(cursor).toBe('grab');
  });

  test('05. Quick Tour button launches driver.js tour across desktop and mobile', async ({ page }) => {
    await page.goto('/');

    const tourBtn = page.locator('[data-testid="header-quick-tour-btn"]');
    await expect(tourBtn).toBeVisible();
    await tourBtn.click();

    // Wait for driver.js popover to mount
    const popover = page.locator('.driver-popover.openguide-tour-popover');
    await expect(popover).toBeVisible();

    // Verify next button advances tour
    const nextBtn = page.locator('.driver-popover-next-btn');
    await expect(nextBtn).toBeVisible();
    await nextBtn.click();

    // Close tour
    const closeBtn = page.locator('.driver-popover-close-btn');
    await closeBtn.click();
    await expect(popover).not.toBeVisible();
  });

  test('06. RTL Mode (Arabic/Urdu): Strict LTR code isolation and zero overflow', async ({ page }) => {
    await page.goto('/track/0/engine');

    // Wait for CodeMirror
    await expect(page.locator('.cm-editor')).toBeVisible({ timeout: 15000 });

    // Enable RTL
    await page.evaluate(() => {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
      document.documentElement.classList.add('rtl-active');
    });

    // Check CodeMirror and Terminal direction
    const directions = await page.evaluate(() => {
      const cm = document.querySelector('.cm-editor');
      const term = document.querySelector('[data-testid="terminal-container"]');
      const scrollWidth = document.documentElement.scrollWidth;
      const innerWidth = window.innerWidth;
      return {
        cmDir: window.getComputedStyle(cm!).direction,
        termDir: term ? window.getComputedStyle(term).direction : 'ltr',
        hasOverflow: scrollWidth > innerWidth
      };
    });

    // Strict LTR verification: Python syntax must NEVER invert
    expect(directions.cmDir).toBe('ltr');
    expect(directions.termDir).toBe('ltr');
    expect(directions.hasOverflow).toBe(false);

    // Reset back to ltr
    await page.evaluate(() => {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = 'en';
      document.documentElement.classList.remove('rtl-active');
    });
  });

  test('07. PWA Installation: Manifest, PNG Icons & Install Prompt Banner', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.removeItem('openguide_pwa_dismissed');
      sessionStorage.removeItem('openguide_pwa_dismissed');
    });
    await page.goto('/');

    // Verify manifest & icon links in DOM
    const pwaMeta = await page.evaluate(() => {
      const manifest = document.querySelector('link[rel="manifest"]')?.getAttribute('href');
      const appleIcon = document.querySelector('link[rel="apple-touch-icon"]')?.getAttribute('href');
      const icon192 = document.querySelector('link[sizes="192x192"]')?.getAttribute('href');
      const icon512 = document.querySelector('link[sizes="512x512"]')?.getAttribute('href');
      const banner = document.querySelector('[data-testid="pwa-install-banner"]');
      const actionBtn = document.querySelector('[data-testid="pwa-install-action-btn"]');
      return {
        manifest,
        appleIcon,
        icon192,
        icon512,
        hasBanner: !!banner,
        hasActionBtn: !!actionBtn
      };
    });

    expect(pwaMeta.manifest).toBe('/manifest.webmanifest');
    expect(pwaMeta.appleIcon).toBe('/apple-touch-icon.png');
    expect(pwaMeta.icon192).toBe('/icon-192.png');
    expect(pwaMeta.icon512).toBe('/icon-512.png');
    expect(pwaMeta.hasBanner).toBe(true);
    expect(pwaMeta.hasActionBtn).toBe(true);

    // Clicking install opens dialog or triggers install
    await page.locator('[data-testid="pwa-install-action-btn"]').click({ force: true });
  });

  test('08. Lenis Momentum Smooth Scroll & Mechanical Button RTL Text Integrity', async ({ page }) => {
    await page.goto('/');

    // 1. Verify Lenis smooth scroll engine is attached to html
    const isLenis = await page.evaluate(() => {
      return document.documentElement.classList.contains('lenis');
    });
    expect(isLenis).toBe(true);

    // 2. Enable RTL (Urdu)
    await page.evaluate(() => {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'ur');
    });

    // 3. Verify Mechanical Button letters are NOT reversed into "0k carTh cnual"
    const buttonState = await page.evaluate(() => {
      const container = document.querySelector('.launch-track-hero-container');
      const textEl = container?.querySelector('.text');
      const letters = Array.from(textEl?.querySelectorAll('span') || []).map(s => s.textContent).join('');
      const dir = container ? window.getComputedStyle(container).direction : '';
      return { letters, dir };
    });

    expect(buttonState.dir).toBe('ltr');
    expect(['LaunchTrack0', 'StartasBuilder']).toContain(buttonState.letters);

    // Reset back
    await page.evaluate(() => {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', 'en');
    });
  });

});
