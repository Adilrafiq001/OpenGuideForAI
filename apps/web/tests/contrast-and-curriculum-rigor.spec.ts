import { test, expect } from '@playwright/test';
import { THEMES_DATA } from '../src/data/themesData';
import { track0 } from '../src/data/track0';
import { track1 } from '../src/data/track1';
import { track2 } from '../src/data/track2';
import { track3 } from '../src/data/track3';
import { track4 } from '../src/data/track4';

/**
 * Standard WCAG 2.2 Relative Luminance Formula
 */
function getLuminance(hexColor: string): number {
  const cleanHex = hexColor.replace('#', '').trim();
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  const toLinear = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

/**
 * Standard WCAG 2.2 Contrast Ratio: (L1 + 0.05) / (L2 + 0.05)
 */
function getContrastRatio(hex1: string, hex2: string): number {
  const lum1 = getLuminance(hex1);
  const lum2 = getLuminance(hex2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

test.describe('OpenGuide 9.8 Production Rigor & Quality Gate', () => {

  test('01. WCAG 2.2 AAA Contrast Rigor: All 24 Themes Achieve >= 7.0:1 Text Contrast', async () => {
    expect(THEMES_DATA.length).toBe(24);

    const lightThemes = THEMES_DATA.filter(t => t.mode === 'light');
    const darkThemes = THEMES_DATA.filter(t => t.mode === 'dark');
    expect(lightThemes.length).toBe(12);
    expect(darkThemes.length).toBe(12);

    const failures: string[] = [];

    for (const theme of THEMES_DATA) {
      // Check Primary Text against background and surface
      const tpOnBg = getContrastRatio(theme.textPrimary, theme.bg);
      const tpOnSurface = getContrastRatio(theme.textPrimary, theme.surface);

      if (tpOnBg < 7.0) {
        failures.push(`Theme [${theme.id}] textPrimary (${theme.textPrimary}) on bg (${theme.bg}) = ${tpOnBg.toFixed(2)}:1 (< 7.0:1 AAA)`);
      }
      if (tpOnSurface < 7.0) {
        failures.push(`Theme [${theme.id}] textPrimary (${theme.textPrimary}) on surface (${theme.surface}) = ${tpOnSurface.toFixed(2)}:1 (< 7.0:1 AAA)`);
      }

      // Check Secondary Text against background and surface
      const tsOnBg = getContrastRatio(theme.textSecondary, theme.bg);
      const tsOnSurface = getContrastRatio(theme.textSecondary, theme.surface);

      if (tsOnBg < 7.0) {
        failures.push(`Theme [${theme.id}] textSecondary (${theme.textSecondary}) on bg (${theme.bg}) = ${tsOnBg.toFixed(2)}:1 (< 7.0:1 AAA)`);
      }
      if (tsOnSurface < 7.0) {
        failures.push(`Theme [${theme.id}] textSecondary (${theme.textSecondary}) on surface (${theme.surface}) = ${tsOnSurface.toFixed(2)}:1 (< 7.0:1 AAA)`);
      }
    }

    expect(failures, `WCAG AAA contrast violations found:\n${failures.join('\n')}`).toEqual([]);
  });

  test('02. Curriculum Completeness: Exactly 45 Labs Across Tracks 0-4 With Mathematical Rigor', async () => {
    const allTracks = [track0, track1, track2, track3, track4];
    expect(allTracks.length).toBe(5);

    let totalLessons = 0;
    const missingElements: string[] = [];

    allTracks.forEach((track, tIdx) => {
      expect(track.modules.length).toBe(3);
      track.modules.forEach((mod, mIdx) => {
        expect(mod.lessons.length).toBe(3);
        mod.lessons.forEach((lesson, lIdx) => {
          totalLessons++;
          const ref = `Track ${tIdx}.${mIdx}.${lIdx} (${lesson.id})`;

          if (!lesson.title || lesson.title.trim().length === 0) {
            missingElements.push(`${ref}: Missing title`);
          }
          if (!lesson.firstPrinciplesIntuition || lesson.firstPrinciplesIntuition.trim().length < 50) {
            missingElements.push(`${ref}: firstPrinciplesIntuition too short or missing (<50 chars)`);
          }
          if (!lesson.content || lesson.content.trim().length < 50) {
            missingElements.push(`${ref}: content too short or missing (<50 chars)`);
          }
          if (!lesson.initialCode || lesson.initialCode.trim().length === 0) {
            missingElements.push(`${ref}: Missing initialCode`);
          }
          if (!lesson.solutionCode || lesson.solutionCode.trim().length === 0) {
            missingElements.push(`${ref}: Missing solutionCode`);
          }
          if (!lesson.expectedOutput || lesson.expectedOutput.trim().length === 0) {
            missingElements.push(`${ref}: Missing expectedOutput`);
          }
          if (!lesson.hint && (!lesson.progressiveHints || lesson.progressiveHints.length === 0)) {
            missingElements.push(`${ref}: Missing hints`);
          }
        });
      });
    });

    expect(totalLessons).toBe(45);
    expect(missingElements, `Curriculum schema deficiencies:\n${missingElements.join('\n')}`).toEqual([]);
  });

  test('03. Portfolio Page: Social Share Intents (Twitter & LinkedIn) and Local Export', async ({ page }) => {
    await page.goto('/portfolio');
    await page.waitForLoadState('domcontentloaded');

    // Confirm core credentials and export buttons
    await expect(page.locator('header').getByText('OpenGuide.')).toBeVisible();
    await expect(page.locator('button:has-text("Export Ledger (.json)")')).toBeVisible();

    // Verify share controls are present
    const twitterShareBtn = page.locator('[data-testid="share-twitter-btn"]');
    const linkedinShareBtn = page.locator('[data-testid="share-linkedin-btn"]');
    await expect(twitterShareBtn).toBeVisible();
    await expect(linkedinShareBtn).toBeVisible();
  });

  test('04. CoursePlayer: Track-Scoped Lesson Counter & Hierarchical Drawer Numbering', async ({ page }) => {
    await page.goto('/track/1');
    await page.waitForLoadState('domcontentloaded');

    // Verify module counter is scoped to track 1 total lessons (9) and does not leak global counts (never 39/9)
    const modBtn = page.locator('button').filter({ hasText: /^Modules \(/ });
    await expect(modBtn).toBeVisible();
    const btnText = await modBtn.textContent();
    expect(btnText).toMatch(/^Modules \(([0-9]|1[0-9])\/9\)$/);
    expect(btnText).not.toContain('39/9');

    // Open modules drawer and verify hierarchical numbering
    await modBtn.click();
    await expect(page.locator('button:has-text("1.1.1 The Vector as an Arrow in Semantic Space")')).toBeVisible();
    await expect(page.locator('button:has-text("1.2.1 Why Angle Trumps Distance in Text")')).toBeVisible();
    await expect(page.locator('button:has-text("1.3.1 Building an In-Memory Vector Store")')).toBeVisible();
  });

  test('05. TrackBriefing: Bespoke Mission Directives Across Tracks 0-4', async ({ page }) => {
    const directives: string[] = [];

    for (const trackNum of [0, 1, 2, 3, 4]) {
      await page.goto(`/track/${trackNum}/intro`);
      await page.waitForLoadState('domcontentloaded');

      const directiveHeading = page.locator('h2:has-text("MISSION DIRECTIVE 00")');
      await expect(directiveHeading).toBeVisible();

      // Read text of the objective card
      const objectiveText = await page.locator('main .lg\\:col-span-2 p').first().textContent();
      expect(objectiveText).toBeTruthy();
      directives.push(objectiveText!.trim());
    }

    // Confirm all 5 directives are unique and bespoke
    const uniqueDirectives = new Set(directives);
    expect(uniqueDirectives.size).toBe(5);
  });
});
