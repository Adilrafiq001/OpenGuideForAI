import { test, expect } from '@playwright/test';

test.describe('Forward Deployed AI Engineering Blueprint Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      try {
        localStorage.setItem('og_onboarding_completed', 'true');
      } catch {}
    });

    page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text();
        if (!text.includes('favicon') && !text.includes('chrome-extension')) {
          console.error('[Browser Error]:', text);
        }
      }
    });
  });

  test('01. Forward AI header pill opens modal and renders Systems Role Matrix', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    // Open Tracks & Curriculum dropdown first, then click Forward Deployed AI Engineering
    const tracksMenu = page.locator('#nav-tracks-menu');
    await expect(tracksMenu).toBeVisible({ timeout: 10000 });
    await tracksMenu.click();

    const forwardBtn = page.locator('[data-testid="header-forward-engineer-btn"]').first();
    await expect(forwardBtn).toBeVisible({ timeout: 5000 });
    await forwardBtn.click();

    // Verify modal is open
    const modal = page.locator('div[role="dialog"][aria-labelledby="forward-engineer-title"]');
    await expect(modal).toBeVisible({ timeout: 5000 });

    // Verify Title & Production Standard badge
    await expect(modal.locator('#forward-engineer-title')).toHaveText('Forward Deployed AI Engineering');
    await expect(modal.getByText('Production Standard • 0.001% Rigor')).toBeVisible();

    // Verify all 6 dimensions in Matrix
    const dimensions = [
      'Core Mission',
      'Agent Governance',
      'IDE & Workflow',
      'Compute Cost',
      'Security & Secrets',
      'Failure Metric'
    ];
    for (const dim of dimensions) {
      await expect(modal.getByText(dim, { exact: true })).toBeVisible();
    }

    // Verify 4 column headers
    await expect(modal.getByText('Naive Vibe Coder', { exact: true })).toBeVisible();
    await expect(modal.getByText('Traditional SWE', { exact: true })).toBeVisible();
    await expect(modal.getByText('Deep AI Engineer', { exact: true })).toBeVisible();
    await expect(modal.getByText('Forward AI Engineer', { exact: true })).toBeVisible();

    // Close modal via close button
    const closeBtn = modal.locator('button[aria-label="Close Forward Engineer Blueprint Modal"]');
    await expect(closeBtn).toBeVisible();
    await closeBtn.click();
    await expect(modal).not.toBeVisible();
  });

  test('02. All 6 Blueprint tabs cycle cleanly and render domain-specific content', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    // Open via Tracks & Curriculum dropdown
    const tracksMenu = page.locator('#nav-tracks-menu');
    await expect(tracksMenu).toBeVisible({ timeout: 10000 });
    await tracksMenu.click();

    const forwardBtn = page.locator('[data-testid="header-forward-engineer-btn"]').first();
    await expect(forwardBtn).toBeVisible({ timeout: 5000 });
    await forwardBtn.click();

    const modal = page.locator('div[role="dialog"][aria-labelledby="forward-engineer-title"]');
    await expect(modal).toBeVisible({ timeout: 5000 });

    // Tab 2: Agentic IDEs
    const ideTab = modal.getByRole('button', { name: /2\. Agentic IDEs/i });
    await expect(ideTab).toBeVisible();
    await ideTab.click();
    await expect(modal.getByText('Google Antigravity IDE')).toBeVisible();
    await expect(modal.getByText('Anthropic Claude Code')).toBeVisible();
    await expect(modal.getByText('OpenAI Codex & Cursor')).toBeVisible();

    // Tab 3: $0 Sovereign Stack
    const stackTab = modal.getByRole('button', { name: /3\. \$0 Sovereign Stack/i });
    await expect(stackTab).toBeVisible();
    await stackTab.click();
    await expect(modal.getByText('Cloudflare Pages / GitHub Pages')).toBeVisible();
    await expect(modal.getByText('Neon Serverless Postgres')).toBeVisible();
    await expect(modal.getByText('CPython WebAssembly (Pyodide v0.26)')).toBeVisible();

    // Tab 4: Secret Hygiene & .env
    const secretTab = modal.getByRole('button', { name: /4\. Secret Hygiene & \.env/i });
    await expect(secretTab).toBeVisible();
    await secretTab.click();
    await expect(modal.getByText('DO: Professional Secret Hygiene')).toBeVisible();
    await expect(modal.getByText("DON'T: Critical Production Vulnerabilities")).toBeVisible();
    await expect(modal.getByText('Standard .env.example Template')).toBeVisible();

    // Tab 5: Governance & Docs
    const govTab = modal.getByRole('button', { name: /5\. Governance & Docs/i });
    await expect(govTab).toBeVisible();
    await govTab.click();
    await expect(modal.getByText('AGENTS.md', { exact: true })).toBeVisible();
    await expect(modal.getByText('ARCHITECTURE.md', { exact: true })).toBeVisible();
    await expect(modal.getByText('CHANGELOG.md', { exact: true })).toBeVisible();

    // Tab 6: Real Case Studies
    const casesTab = modal.getByRole('button', { name: /6\. Real Case Studies/i });
    await expect(casesTab).toBeVisible();
    await casesTab.click();
    await expect(modal.getByText('Case Study 1: OpenGuide AI Studio')).toBeVisible();
    await expect(modal.getByText('Case Study 2: Model Context Protocol (MCP) Connector Server')).toBeVisible();

    // Tab 7: Knowledge Bank
    const kbTab = modal.getByRole('button', { name: /7\. Knowledge Bank/i });
    await expect(kbTab).toBeVisible();
    await kbTab.click();
    await expect(modal.getByText(/28 of 28 Topics Loaded/i)).toBeVisible();
    await expect(modal.getByText('FDE Core Systems Discipline & Operational Mandate')).toBeVisible();

    // Press Escape to close modal
    await page.keyboard.press('Escape');
    await expect(modal).not.toBeVisible();
  });

  test('03. Command Palette indexes and triggers Forward AI Blueprint modal', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    // Trigger Command Palette via header search button or shortcut
    const searchBtn = page.locator('[data-testid="header-command-palette-btn"]').first();
    await expect(searchBtn).toBeVisible({ timeout: 5000 });
    await searchBtn.click();

    const paletteInput = page.locator('[data-testid="command-palette-input"]').first();
    await expect(paletteInput).toBeVisible({ timeout: 5000 });

    // Type query
    await paletteInput.fill('forward');
    await page.waitForTimeout(300);

    const fdeResult = page.locator('button:has-text("Forward Deployed AI Engineering Blueprint")').first();
    await expect(fdeResult).toBeVisible();
    await fdeResult.click();

    // Confirm Forward Engineer modal opens
    const modal = page.locator('div[role="dialog"][aria-labelledby="forward-engineer-title"]');
    await expect(modal).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(modal).not.toBeVisible();
  });

  test('04. FDE Knowledge Bank searches and filters operational topics seamlessly', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    // Open via Tracks & Curriculum dropdown
    const tracksMenu = page.locator('#nav-tracks-menu');
    await expect(tracksMenu).toBeVisible({ timeout: 10000 });
    await tracksMenu.click();

    const forwardBtn = page.locator('[data-testid="header-forward-engineer-btn"]').first();
    await expect(forwardBtn).toBeVisible({ timeout: 5000 });
    await forwardBtn.click();

    const modal = page.locator('div[role="dialog"][aria-labelledby="forward-engineer-title"]');
    await expect(modal).toBeVisible({ timeout: 5000 });

    // Open Tab 7: Knowledge Bank
    const kbTab = modal.getByRole('button', { name: /7\. Knowledge Bank/i });
    await expect(kbTab).toBeVisible();
    await kbTab.click();

    // Verify search input
    const searchInput = modal.getByPlaceholder(/Search 28 operational FDE knowledge topics/i);
    await expect(searchInput).toBeVisible();

    // Category filtering: Click "FastMCP & Tools" pill
    const fastmcpPill = modal.getByRole('button', { name: 'FastMCP & Tools', exact: true });
    await expect(fastmcpPill).toBeVisible();
    await fastmcpPill.click();

    await expect(modal.getByText('FastMCP & Model Context Protocol Sandboxed Tool Architecture')).toBeVisible();

    // Switch back to All Topics before searching
    const allPill = modal.getByRole('button', { name: 'All Topics', exact: true });
    await expect(allPill).toBeVisible();
    await allPill.click();

    // Search query: type "WASM"
    await searchInput.fill('WASM');
    await page.waitForTimeout(200);

    await expect(modal.getByText('Air-Gapped Sovereign Deployment & On-Device CPython WASM')).toBeVisible();

    // Verify Copy button works and reflects "Copied!" feedback
    const copyBtn = modal.locator('button:has-text("Copy")').first();
    await expect(copyBtn).toBeVisible();
    await copyBtn.click();
    await expect(modal.getByText('Copied!').first()).toBeVisible();

    // Press Escape to exit
    await page.keyboard.press('Escape');
    await expect(modal).not.toBeVisible();
  });
});
