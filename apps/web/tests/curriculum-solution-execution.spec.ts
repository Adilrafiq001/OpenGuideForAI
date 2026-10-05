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

  test('04. Mutation Testing & Autograder Resilience Audit (Track 0)', async () => {
    const track0Mutants: Record<string, string[]> = {
      'lesson-0-1-1': [
        'message = "Hello, World!"',
        'message = "Hello, World! Running natively in browser"',
        'message = 42'
      ],
      'lesson-0-1-2': [
        'topic = "Vector Embeddings"\naudience = "a beginner"\nprompt = "Explain {topic} in one plain sentence for {audience}."',
        'topic = "Vector Embeddings"\naudience = "a beginner"\nprompt = f"Explain {topic} for {audience}."',
        'topic = "Vector Embeddings"\naudience = "a beginner"\nprompt = "hardcoded wrong"'
      ],
      'lesson-0-1-3': [
        'batch_count = 1000\ntotal_coordinates = batch_count * 2',
        'batch_count = 500\ntotal_coordinates = 1500',
        'batch_count = 1000\ntotal_coordinates = 3001'
      ],
      'lesson-0-2-1': [
        'vector_point = [0.24, -0.89, 0.51]\ndimensions = 3\nmagnitude = sum(vector_point)',
        'vector_point = [0.24, -0.89, 0.51]\ndimensions = 3\nmagnitude = sum(x**2 for x in vector_point)',
        'vector_point = [0.24, 0.89, 0.51]\ndimensions = 3\nmagnitude = 1.053'
      ],
      'lesson-0-2-2': [
        'import json\nmessage = {"role": "assistant", "content": "What is an embedding?"}\njson_string = json.dumps(message)',
        'import json\nmessage = {"role": "user"}\njson_string = json.dumps(message)',
        'message = {"role": "user", "content": "What is an embedding?"}\njson_string = str(message)'
      ],
      'lesson-0-2-3': [
        'import json\nraw_tool_call = \'{"tool": "vector_search", "query": "cosine similarity", "top_k": 3}\'\ncall = json.loads(raw_tool_call)\ntool_name = "search"\nquery = "cosine similarity"\ntop_k = 3\nexecution_signature = f"Calling: {tool_name}(query=\'{query}\', top_k={top_k})"',
        'import json\nraw_tool_call = \'{"tool": "vector_search", "query": "cosine similarity", "top_k": 3}\'\ncall = json.loads(raw_tool_call)\ntool_name = call.get("tool")\nquery = call.get("query")\ntop_k = 5\nexecution_signature = f"Calling: {tool_name}(query=\'{query}\', top_k={top_k})"',
        'import json\nraw_tool_call = \'{"tool": "vector_search", "query": "cosine similarity", "top_k": 3}\'\ncall = json.loads(raw_tool_call)\ntool_name = call.get("tool")\nquery = call.get("query")\ntop_k = call.get("top_k")\nexecution_signature = f"{tool_name}(query={query}, top_k={top_k})"'
      ],
      'lesson-0-3-1': [
        'sentence = "OpenGuide makes AI engineering intuitive"\nwords = sentence.split()\nestimated_tokens = len(words)\nchar_tokens = len(sentence)',
        'sentence = "OpenGuide makes AI engineering intuitive"\nwords = sentence.split()\nestimated_tokens = int(len(words) * 1.33)\nchar_tokens = len(sentence) // 2',
        'sentence = "OpenGuide makes AI engineering intuitive"\nwords = list(sentence)\nestimated_tokens = int(len(words) * 1.33)\nchar_tokens = round(len(sentence) / 4)'
      ],
      'lesson-0-3-2': [
        'conversation = [{"role": "system", "content": "You are a concise AI teacher."}, {"role": "user", "content": "What is cosine similarity?"}]\nformatted_dialogue = [f"[{m[\'role\']}]: {m[\'content\']}" for m in conversation]\nrendered = "\\n".join(formatted_dialogue)',
        'conversation = [{"role": "system", "content": "You are a concise AI teacher."}, {"role": "user", "content": "What is cosine similarity?"}]\nformatted_dialogue = [f"{m[\'role\'].upper()}: {m[\'content\']}" for m in conversation]\nrendered = "\\n".join(formatted_dialogue)',
        'conversation = [{"role": "system", "content": "You are a concise AI teacher."}, {"role": "user", "content": "What is cosine similarity?"}]\nformatted_dialogue = [f"[{m[\'role\'].upper()}]: {m[\'content\']}" for m in conversation]\nrendered = " ".join(formatted_dialogue)'
      ],
      'lesson-0-3-3': [
        'simulate_token_sampling = lambda t: "greedy_argmax"',
        'simulate_token_sampling = lambda t: "balanced_sampling" if t < 0.8 else "high_entropy_creative"',
        'simulate_token_sampling = lambda t: "greedy_argmax" if t <= 0.3 else ("balanced_sampling" if t < 0.8 else "high_entropy_creative")'
      ]
    };

    let totalMutants = 0;
    let killedMutants = 0;
    const survivingMutants: string[] = [];

    track0.modules.forEach(mod => {
      mod.lessons.forEach(lesson => {
        const mutants = track0Mutants[lesson.id] || [];
        mutants.forEach((mutantCode, mIdx) => {
          totalMutants++;
          const pyCode = `${mutantCode}\n\n# --- Test Harness ---\n${lesson.testCode || ''}`;
          const res = spawnSync('python', ['-c', pyCode], {
            encoding: 'utf-8',
            timeout: 10000,
            env: { ...process.env, PYTHONIOENCODING: 'utf-8' },
          });

          if (res.status !== 0 || res.error) {
            killedMutants++;
          } else {
            survivingMutants.push(`[${lesson.id}] Mutant #${mIdx + 1} survived:\n${mutantCode}`);
          }
        });
      });
    });

    console.log(`\n=== MUTATION AUDIT BREAKDOWN ===`);
    console.log(`Total Mutants Tested: ${totalMutants}`);
    console.log(`Killed Mutants: ${killedMutants}`);
    console.log(`Kill Rate: ${((killedMutants / totalMutants) * 100).toFixed(1)}%`);

    expect(survivingMutants, `Mutants survived! Autograder failed to detect flawed code:\n${survivingMutants.join('\n\n')}`).toEqual([]);
    expect(totalMutants).toBe(27);
    expect(killedMutants).toBe(27);
  });

});

