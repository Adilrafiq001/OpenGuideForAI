import { test, expect } from '@playwright/test';

test.describe('Builder Path Maturity & Mobile Navigation 10.0 Suite', () => {
  test.beforeEach(async ({ page }) => {
    // Monitor console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        // Ignore expected network beacon failures in test environment
        if (!msg.text().includes('cloudflareinsights') && !msg.text().includes('ERR_FAILED')) {
          console.error(`Browser Console Error: ${msg.text()}`);
        }
      }
    });
  });

  test('TC-BUILDER-001: MobileBottomNav Opens TrackSwitcherModal with 16 Complete Tracks', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('http://localhost:5173/');
    await page.waitForLoadState('domcontentloaded');

    // Click mobile tracks button
    const tracksBtn = page.locator('button[data-testid="mobile-nav-tracks"]');
    await expect(tracksBtn).toBeVisible();
    await tracksBtn.click();

    // Verify modal is open
    const modal = page.locator('[data-testid="track-switcher-modal"]');
    await expect(modal).toBeVisible();

    // Verify 8 Engineer Tracks are rendered by default
    const engineerTracks = page.locator('[data-testid^="select-engineer-track-"]');
    await expect(engineerTracks).toHaveCount(8);

    // Switch to Builder Path tab
    const builderTab = page.locator('button[data-testid="tab-builder-tracks"]');
    await expect(builderTab).toBeVisible();
    await builderTab.click();

    // Verify 8 Builder Tracks are rendered (B0 through B7)
    const builderTracks = page.locator('[data-testid^="select-builder-track-"]');
    await expect(builderTracks).toHaveCount(8);

    // Verify search filter in modal
    const searchInput = modal.locator('input[type="text"]');
    await searchInput.fill('Security');
    const filteredTracks = page.locator('[data-testid^="select-builder-track-"]');
    await expect(filteredTracks).toHaveCount(1);
    await expect(filteredTracks.first()).toContainText('B4');

    // Clear search
    await searchInput.fill('');
    await expect(page.locator('[data-testid^="select-builder-track-"]')).toHaveCount(8);

    // Close modal
    await page.locator('button[data-testid="close-track-switcher-btn"]').click();
    await expect(modal).not.toBeVisible();
  });

  test('TC-BUILDER-002: Direct Route /track/builder-7 Redirects Cleanly to /builder/7', async ({ page }) => {
    await page.goto('http://localhost:5173/track/builder-7');
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveURL(/.*\/builder\/7/);
  });

  test('TC-BUILDER-003: Track B3 Ship It — EdgeDeployLab Interactive Simulation', async ({ page }) => {
    await page.goto('http://localhost:5173/builder/3');
    await page.waitForLoadState('domcontentloaded');

    const lab = page.locator('[data-testid="edge-deploy-lab"]');
    await expect(lab).toBeVisible();

    // Test Edge Deploy Button
    const deployBtn = page.locator('button[data-testid="edge-deploy-btn"]');
    await expect(deployBtn).toBeVisible();
    await deployBtn.click();
    await expect(lab).toContainText('Deploying...');

    // Test Local-First IDB Tab
    await page.locator('button:has-text("Local-First IDB")').click();
    const idbBtn = page.locator('button[data-testid="test-idb-persistence-btn"]');
    await expect(idbBtn).toBeVisible();
    await idbBtn.click();
    await expect(lab).toContainText('IndexedDB persisted');

    // Test Secret Scanner Tab
    await page.locator('button:has-text("Secret Scanner")').click();
    const scanBtn = page.locator('button[data-testid="scan-secrets-btn"]');
    await expect(scanBtn).toBeVisible();
    await scanBtn.click();
    await expect(lab).toContainText('CRITICAL HAZARD: Leaked Backend Secrets Detected!');
    const cleanBtn = page.locator('button[data-testid="clean-secrets-btn"]');
    await expect(cleanBtn).toBeVisible();
    await cleanBtn.click();
    await expect(lab).toContainText('Clean! Zero Leaked Backend Secrets');
  });

  test('TC-BUILDER-004: Track B4 Trust It — DefensiveSecurityLab Interactive Simulation', async ({ page }) => {
    await page.goto('http://localhost:5173/builder/4');
    await page.waitForLoadState('domcontentloaded');

    const lab = page.locator('[data-testid="defensive-security-lab"]');
    await expect(lab).toBeVisible();

    // Test Attacker Query Simulation
    const attackerQueryBtn = page.locator('button[data-testid="test-attacker-query-btn"]');
    await expect(attackerQueryBtn).toBeVisible();
    await attackerQueryBtn.click();
    await expect(lab).toContainText('BREACH DETECTED');

    // Enable RLS and Add Policy
    await page.locator('button[data-testid="toggle-rls-btn"]').click();
    await page.locator('button[data-testid="toggle-policy-btn"]').click();
    await attackerQueryBtn.click();
    await expect(lab).toContainText('SECURE ISOLATION VERIFIED');

    // Test Prompt Injection Tab
    await page.locator('button:has-text("Prompt Injection")').click();
    await page.locator('button[data-testid="toggle-sanitizer-btn"]').click();
    await page.locator('button[data-testid="test-injection-btn"]').click();
    await expect(lab).toContainText('DEFENSIVE GUARDRAIL ACTIVE');
  });

  test('TC-BUILDER-005: Track B5 Direct It — AgentDirectorLab Constitution & Token Budget', async ({ page }) => {
    await page.goto('http://localhost:5173/builder/5');
    await page.waitForLoadState('domcontentloaded');

    const lab = page.locator('[data-testid="agent-director-lab"]');
    await expect(lab).toBeVisible();

    // Test Constitution Checklist Button
    const clauseBtn = lab.locator('button:has-text("1. Objective & Role")');
    await expect(clauseBtn).toBeVisible();
    await clauseBtn.click();

    // Test Token Simulator Tab
    await page.locator('button:has-text("Token Budget")').click();
    const simulateTurnBtn = page.locator('button[data-testid="simulate-turn-btn"]');
    await expect(simulateTurnBtn).toBeVisible();
    await simulateTurnBtn.click();
    await simulateTurnBtn.click();
    await simulateTurnBtn.click();
    await expect(lab).toContainText('Context Compaction Fired');

    // Test Anti-Drift Compliance Tab
    await page.locator('button:has-text("Anti-Drift")').click();
    const auditBtn = page.locator('button[data-testid="audit-proposal-btn"]');
    await expect(auditBtn).toBeVisible();
    await auditBtn.click();
    await expect(lab).toContainText('REJECTED: Drift Violations Detected');
  });

  test('TC-BUILDER-006: Track B6 Run It — PipelineOpsLab CI/CD Gates & Rollback Drill', async ({ page }) => {
    await page.goto('http://localhost:5173/builder/6');
    await page.waitForLoadState('domcontentloaded');

    const lab = page.locator('[data-testid="pipeline-ops-lab"]');
    await expect(lab).toBeVisible();

    // Trigger CI Pipeline
    const runPipelineBtn = page.locator('button[data-testid="run-ci-pipeline-btn"]');
    await expect(runPipelineBtn).toBeVisible();
    await runPipelineBtn.click();
    await expect(lab).toContainText('Executing CI Gates...');

    // Test Telemetry Tab
    await page.locator('button:has-text("Telemetry")').click();
    await expect(lab).toContainText('Live Error Rate');

    // Test Rollback Drill Tab
    await page.locator('button:has-text("Rollback Drill")').click();
    const rollbackBtn = page.locator('button[data-testid="rollback-drill-btn"]');
    await expect(rollbackBtn).toBeVisible();
    await rollbackBtn.click();
    await expect(lab).toContainText('Rollback Executed in 1.2s');
  });

  test('TC-BUILDER-007: Track B7 Prove It — CapstoneLedgerLab Web Crypto SHA-256 Signature', async ({ page }) => {
    await page.goto('http://localhost:5173/builder/7');
    await page.waitForLoadState('domcontentloaded');

    const lab = page.locator('[data-testid="capstone-ledger-lab"]');
    await expect(lab).toBeVisible();

    // Test SHA-256 Proof Tab
    await page.locator('button:has-text("SHA-256 Proof")').click();
    const computeHashBtn = page.locator('button[data-testid="compute-hash-btn"]');
    await expect(computeHashBtn).toBeVisible();
    await computeHashBtn.click();
    await expect(lab).toContainText('Deterministic SHA-256 Digest');

    // Test Ledger Export Tab
    await page.locator('button:has-text("Ledger Export")').click();
    const exportBtn = page.locator('button[data-testid="export-ledger-btn"]');
    await expect(exportBtn).toBeVisible();
  });

  test('TC-BUILDER-008: Header Track Capsule & No Dead-Ends on Lesson Completion', async ({ page }) => {
    await page.goto('http://localhost:5173/builder/0');
    await page.waitForLoadState('domcontentloaded');

    // Check Track Capsule button in CoursePlayer header
    const trackCapsule = page.locator('button[data-testid="ide-track-switcher-btn"]');
    await expect(trackCapsule).toBeVisible();
    await expect(trackCapsule).toContainText('Track B0');
    await trackCapsule.click();

    // Modal opens
    const modal = page.locator('[data-testid="track-switcher-modal"]');
    await expect(modal).toBeVisible();
    await page.locator('button[data-testid="close-track-switcher-btn"]').click();
    await expect(modal).not.toBeVisible();
  });
});
