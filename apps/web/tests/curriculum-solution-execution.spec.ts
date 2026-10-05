import { test, expect } from '@playwright/test';
import { spawnSync } from 'child_process';
import { track0 } from '../src/data/track0';
import { track1 } from '../src/data/track1';
import { track2 } from '../src/data/track2';
import { track3 } from '../src/data/track3';
import { track4 } from '../src/data/track4';

const allTracks = [track0, track1, track2, track3, track4];

test.describe('Curriculum Rigor & Python Sandbox Execution Audit', () => {

  test('01. All 45 Labs: Solution Code Execution & Assertion Verification', async () => {
    const results: Array<{
      labId: string;
      title: string;
      success: boolean;
      stdout: string;
      stderr: string;
      error?: string;
    }> = [];

    const failures: string[] = [];
    const identicalCodeWarnings: string[] = [];

    for (let tIdx = 0; tIdx < allTracks.length; tIdx++) {
      const track = allTracks[tIdx];
      for (let mIdx = 0; mIdx < track.modules.length; mIdx++) {
        const mod = track.modules[mIdx];
        for (let lIdx = 0; lIdx < mod.lessons.length; lIdx++) {
          const lesson = mod.lessons[lIdx];
          const labRef = `Track ${tIdx}.${mIdx}.${lIdx} [${lesson.id}] "${lesson.title}"`;

          // Verify initialCode vs solutionCode
          if (lesson.initialCode.trim() === lesson.solutionCode?.trim()) {
            identicalCodeWarnings.push(`${labRef}: initialCode is identical to solutionCode (student has no challenge!)`);
          }

          // Build Python execution payload: solutionCode + testCode
          const pyCode = `${lesson.solutionCode || ''}\n\n# --- Test Harness ---\n${lesson.testCode || ''}`;

          const res = spawnSync('python', ['-c', pyCode], {
            encoding: 'utf-8',
            timeout: 10000,
            env: { ...process.env, PYTHONIOENCODING: 'utf-8' },
          });

          if (res.status !== 0 || res.error) {
            const errDetail = res.stderr || res.error?.message || `Exited with status ${res.status}`;
            failures.push(`FAILED ${labRef}:\n${errDetail}`);
            results.push({
              labId: lesson.id,
              title: lesson.title,
              success: false,
              stdout: res.stdout || '',
              stderr: res.stderr || '',
              error: errDetail,
            });
          } else {
            results.push({
              labId: lesson.id,
              title: lesson.title,
              success: true,
              stdout: res.stdout || '',
              stderr: res.stderr || '',
            });
          }
        }
      }
    }

    console.log(`Total labs tested: ${results.length}`);
    console.log(`Passed: ${results.filter(r => r.success).length}`);
    console.log(`Failed: ${failures.length}`);

    if (identicalCodeWarnings.length > 0) {
      console.warn(`\nIdentical Code Warnings (${identicalCodeWarnings.length}):\n${identicalCodeWarnings.join('\n')}`);
    }

    expect(results.length).toBe(45);
    expect(failures, `Curriculum solution execution failures:\n${failures.join('\n\n')}`).toEqual([]);
  });

  test('02. Pedagogical Substance & Anti-Bias Audit: Substance vs Plumbing', async () => {
    const missingProgressiveHints: string[] = [];
    const demeaningTermsFound: string[] = [];
    const shallowIntuitions: string[] = [];
    const missingTestCode: string[] = [];

    allTracks.forEach((track, tIdx) => {
      track.modules.forEach((mod, mIdx) => {
        mod.lessons.forEach((lesson, lIdx) => {
          const ref = `Track ${tIdx}.${mIdx}.${lIdx} [${lesson.id}] "${lesson.title}"`;

          // 1. Check for banned demeaning terms per Zone B profile
          const allText = `${lesson.title} ${lesson.subtitle} ${lesson.firstPrinciplesIntuition} ${lesson.content}`.toLowerCase();
          if (allText.includes('dog') || allText.includes('puppy')) {
            demeaningTermsFound.push(`${ref}: Found banned demeaning term ('dog'/'puppy')`);
          }

          // 2. Check depth of intuition (Phase B standard: >= 250 characters)
          if (!lesson.firstPrinciplesIntuition || lesson.firstPrinciplesIntuition.length < 250) {
            shallowIntuitions.push(`${ref}: Intuition too shallow (${lesson.firstPrinciplesIntuition?.length || 0} chars < 250 chars)`);
          }

          // 3. Check depth of content (Phase B standard: >= 350 characters)
          if (!lesson.content || lesson.content.length < 350) {
            shallowIntuitions.push(`${ref}: Content too shallow (${lesson.content?.length || 0} chars < 350 chars)`);
          }

          // 4. Check for isolated test harness assertions
          if (!lesson.testCode || !lesson.testCode.includes('assert')) {
            missingTestCode.push(`${ref}: Missing or assertion-less testCode`);
          }

          // 5. Check for calibrated 3-tier progressive hints
          if (!lesson.progressiveHints || lesson.progressiveHints.length < 3) {
            missingProgressiveHints.push(`${ref}: Needs 3 progressive hints, has ${lesson.progressiveHints?.length || 0}`);
          }
        });
      });
    });

    console.log(`\n=== CURRICULUM AUDIT BREAKDOWN ===`);
    console.log(`Banned Terms: ${demeaningTermsFound.length}`);
    console.log(`Shallow Content/Intuition: ${shallowIntuitions.length}`);
    console.log(`Missing TestCode: ${missingTestCode.length}`);
    console.log(`Missing 3-Tier Hints: ${missingProgressiveHints.length} / 45`);

    expect(demeaningTermsFound).toEqual([]);
    expect(shallowIntuitions).toEqual([]);
    expect(missingTestCode).toEqual([]);
    expect(missingProgressiveHints).toEqual([]);
  });

  test('03. Starter Code Challenge Audit: initialCode MUST Fail Tests', async () => {
    const preSolvedLabs: string[] = [];

    for (let tIdx = 0; tIdx < allTracks.length; tIdx++) {
      const track = allTracks[tIdx];
      for (let mIdx = 0; mIdx < track.modules.length; mIdx++) {
        const mod = track.modules[mIdx];
        for (let lIdx = 0; lIdx < mod.lessons.length; lIdx++) {
          const lesson = mod.lessons[lIdx];
          const labRef = `Track ${tIdx}.${mIdx}.${lIdx} [${lesson.id}] "${lesson.title}"`;

          // Execute initialCode + testCode
          const pyCode = `${lesson.initialCode || ''}\n\n# --- Test Harness ---\n${lesson.testCode || ''}`;
          const res = spawnSync('python', ['-c', pyCode], {
            encoding: 'utf-8',
            timeout: 10000,
            env: { ...process.env, PYTHONIOENCODING: 'utf-8' },
          });

          // If it exits 0 without error, it's pre-solved!
          if (res.status === 0 && !res.error) {
            preSolvedLabs.push(labRef);
          }
        }
      }
    }

    console.log(`\n=== PRE-SOLVED LABS AUDIT ===`);
    console.log(`Pre-solved labs count: ${preSolvedLabs.length} / 45`);
    if (preSolvedLabs.length > 0) {
      console.log(`List of pre-solved labs:\n${preSolvedLabs.map((l, i) => `  ${i + 1}. ${l}`).join('\n')}`);
    }

    expect(preSolvedLabs, `Starter code should FAIL tests so students have an authentic challenge! Found ${preSolvedLabs.length} pre-solved labs.`).toEqual([]);
  });

});

