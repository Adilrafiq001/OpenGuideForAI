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

  test('05. Mutation Testing & Autograder Resilience Audit (Track 1)', async () => {
    const track1Mutants: Record<string, string[]> = {
      'lesson-1-1-1': [
        // Mutant 1: Coordinate addition instead of subtraction (queen + king)
        'king = [0.90, 0.20]\nqueen = [0.85, 0.25]\ndelta = [round(queen[0] + king[0], 4), round(queen[1] + king[1], 4)]\nsquared_distance = 0.005',
        // Mutant 2: Reversed subtraction (king - queen instead of queen - king)
        'king = [0.90, 0.20]\nqueen = [0.85, 0.25]\ndelta = [round(king[0] - queen[0], 4), round(king[1] - queen[1], 4)]\nsquared_distance = round(delta[0]**2 + delta[1]**2, 5)',
        // Mutant 3: Manhattan distance squared instead of Euclidean (delta[0] + delta[1])**2
        'king = [0.90, 0.20]\nqueen = [0.85, 0.25]\ndelta = [round(queen[0] - king[0], 4), round(queen[1] - king[1], 4)]\nsquared_distance = round((delta[0] + delta[1])**2, 5)'
      ],
      'lesson-1-1-2': [
        // Mutant 1: Coordinate sum instead of Euclidean norm (v[0] + v[1])
        'import math\nv = [3.0, 4.0]\nmag = v[0] + v[1]\nunit_v = [0.6, 0.8]',
        // Mutant 2: L1 normalization (sum of absolute values) instead of L2
        'import math\nv = [3.0, 4.0]\nmag = abs(v[0]) + abs(v[1])\nunit_v = [round(x / mag, 2) for x in v]',
        // Mutant 3: Negated vector direction
        'import math\nv = [3.0, 4.0]\nmag = math.sqrt(v[0]**2 + v[1]**2)\nunit_v = [round(-x / mag, 2) for x in v]'
      ],
      'lesson-1-1-3': [
        // Mutant 1: Sum of pairs instead of product of pairs in dot product
        'a = [1, 2, 3]\nb = [4, 5, 6]\ndot = sum(x + y for x, y in zip(a, b))',
        // Mutant 2: Product of sums instead of sum of products
        'a = [1, 2, 3]\nb = [4, 5, 6]\ndot = sum(a) * sum(b)',
        // Mutant 3: Euclidean distance instead of dot product
        'import math\na = [1, 2, 3]\nb = [4, 5, 6]\ndot = sum((x - y)**2 for x, y in zip(a, b))'
      ],
      'lesson-1-2-1': [
        // Mutant 1: Hardcoded cosine_sim returning constant 1.0
        'import math\nshort_doc = [1.0, 2.0]\nlong_doc = [10.0, 20.0]\ndef cosine_sim(v1, v2): return 1.0\nsim = cosine_sim(short_doc, long_doc)',
        // Mutant 2: Dot product without magnitude normalization
        'import math\nshort_doc = [1.0, 2.0]\nlong_doc = [10.0, 20.0]\ndef cosine_sim(v1, v2): return sum(a*b for a,b in zip(v1, v2))\nsim = cosine_sim(short_doc, long_doc)',
        // Mutant 3: Cosine distance (1 - sim) instead of similarity
        'import math\nshort_doc = [1.0, 2.0]\nlong_doc = [10.0, 20.0]\ndef cosine_sim(v1, v2):\n    d = sum(a*b for a,b in zip(v1,v2))\n    m1 = math.sqrt(sum(a*a for a in v1))\n    m2 = math.sqrt(sum(b*b for b in v2))\n    return 1.0 - (d / (m1*m2))\nsim = cosine_sim(short_doc, long_doc)'
      ],
      'lesson-1-2-2': [
        // Mutant 1: Hardcoded scores list
        'import math\ndef cosine_similarity(v1, v2): return 0.998\nquery = [0.8, 0.6]\ncandidates = [[0.85, 0.55], [0.10, 0.90], [-0.70, 0.70]]\nscores = [0.998, 0.685, -0.141]',
        // Mutant 2: Reverse order scoring (candidate 3 first)
        'import math\ndef cosine_similarity(v1, v2):\n    d = sum(a*b for a,b in zip(v1,v2))\n    m1 = math.sqrt(sum(a*a for a in v1))\n    m2 = math.sqrt(sum(b*b for b in v2))\n    return d / (m1*m2)\nquery = [0.8, 0.6]\ncandidates = [[0.85, 0.55], [0.10, 0.90], [-0.70, 0.70]]\nscores = [round(cosine_similarity(query, doc), 3) for doc in reversed(candidates)]',
        // Mutant 3: Euclidean distance ranking instead of cosine similarity
        'import math\ndef cosine_similarity(v1, v2):\n    return -math.sqrt(sum((a-b)**2 for a,b in zip(v1, v2)))\nquery = [0.8, 0.6]\ncandidates = [[0.85, 0.55], [0.10, 0.90], [-0.70, 0.70]]\nscores = [round(cosine_similarity(query, doc), 3) for doc in candidates]'
      ],
      'lesson-1-2-3': [
        // Mutant 1: Squared differences instead of absolute differences for Manhattan
        'import math\np = [1, 2]\nq = [4, 6]\nmanhattan = float(sum((a - b)**2 for a, b in zip(p, q)))\neuclidean = 5.0\ncos_dist = 0.0077',
        // Mutant 2: Euclidean squared instead of Euclidean
        'import math\np = [1, 2]\nq = [4, 6]\nmanhattan = float(sum(abs(a - b) for a, b in zip(p, q)))\neuclidean = float(sum((a - b)**2 for a, b in zip(p, q)))\ndot = sum(a * b for a, b in zip(p, q))\nmag_p = math.sqrt(sum(a*a for a in p))\nmag_q = math.sqrt(sum(b*b for b in q))\ncos_dist = round(1.0 - (dot / (mag_p * mag_q)), 4)',
        // Mutant 3: Cosine similarity instead of cosine distance
        'import math\np = [1, 2]\nq = [4, 6]\nmanhattan = float(sum(abs(a - b) for a, b in zip(p, q)))\neuclidean = float(math.sqrt(sum((a - b)**2 for a, b in zip(p, q))))\ndot = sum(a * b for a, b in zip(p, q))\nmag_p = math.sqrt(sum(a*a for a in p))\nmag_q = math.sqrt(sum(b*b for b in q))\ncos_dist = round(dot / (mag_p * mag_q), 4)'
      ],
      'lesson-1-3-1': [
        // Mutant 1: Class-level shared documents list (mutable state bug)
        'class SimpleVectorStore:\n    documents = []\n    def __init__(self): pass\n    def add(self, doc_id, text, vector):\n        self.documents.append({"id": doc_id, "text": text, "vector": vector})\n    def count(self):\n        return len(self.documents)\nstore = SimpleVectorStore()\nstore.add("doc1", "Intro", [0.9, 0.1, 0.4])\nstore.add("doc2", "French", [-0.2, 0.8, 0.1])',
        // Mutant 2: Missing vector in stored document dictionary
        'class SimpleVectorStore:\n    def __init__(self):\n        self.documents = []\n    def add(self, doc_id, text, vector):\n        self.documents.append({"id": doc_id, "text": text})\n    def count(self):\n        return len(self.documents)\nstore = SimpleVectorStore()\nstore.add("doc1", "Intro", [0.9, 0.1, 0.4])\nstore.add("doc2", "French", [-0.2, 0.8, 0.1])',
        // Mutant 3: Always returning count = 2
        'class SimpleVectorStore:\n    def __init__(self):\n        self.documents = []\n    def add(self, doc_id, text, vector):\n        self.documents.append({"id": doc_id, "text": text, "vector": vector})\n    def count(self):\n        return 2\nstore = SimpleVectorStore()\nstore.add("doc1", "Intro", [0.9, 0.1, 0.4])\nstore.add("doc2", "French", [-0.2, 0.8, 0.1])'
      ],
      'lesson-1-3-2': [
        // Mutant 1: Hardcoded top_2 list
        'import math\ndef cosine_sim(v1, v2): return 1.0\ndocuments = [{"id": "doc1", "text": "t1", "vector": [1,0]}]\nscored_docs = [(1.0, {"id": "doc1"})]\ntop_2 = [(0.92, {"id": "doc1", "text": "AI"}), (0.85, {"id": "doc3", "text": "ML"})]',
        // Mutant 2: Ascending sort instead of descending (retrieving worst docs)
        'import math\ndef cosine_sim(v1, v2):\n    d = sum(a*b for a,b in zip(v1,v2))\n    m1 = math.sqrt(sum(a*a for a in v1))\n    m2 = math.sqrt(sum(b*b for b in v2))\n    return d / (m1*m2)\nquery_vector = [0.82, 0.15, 0.38]\ndocuments = [\n    {"id": "doc1", "text": "Transformers", "vector": [0.90, 0.10, 0.40]},\n    {"id": "doc2", "text": "Gardening", "vector": [-0.55, 0.81, 0.12]},\n    {"id": "doc3", "text": "Backprop", "vector": [0.75, 0.20, 0.50]}\n]\nscored_docs = [(cosine_sim(query_vector, doc["vector"]), doc) for doc in documents]\nscored_docs.sort(key=lambda x: x[0], reverse=False)\ntop_2 = scored_docs[:2]',
        // Mutant 3: Unsorted slice [:2] (first 2 regardless of score)
        'import math\ndef cosine_sim(v1, v2):\n    d = sum(a*b for a,b in zip(v1,v2))\n    m1 = math.sqrt(sum(a*a for a in v1))\n    m2 = math.sqrt(sum(b*b for b in v2))\n    return d / (m1*m2)\nquery_vector = [0.82, 0.15, 0.38]\ndocuments = [\n    {"id": "doc1", "text": "Transformers", "vector": [0.90, 0.10, 0.40]},\n    {"id": "doc2", "text": "Gardening", "vector": [-0.55, 0.81, 0.12]},\n    {"id": "doc3", "text": "Backprop", "vector": [0.75, 0.20, 0.50]}\n]\nscored_docs = [(cosine_sim(query_vector, doc["vector"]), doc) for doc in documents]\ntop_2 = scored_docs[:2]'
      ],
      'lesson-1-3-3': [
        // Mutant 1: Hardcoded search output
        'class SemanticSearchEngine:\n    def __init__(self): self.documents = []\n    def add_document(self, id, text, vector): pass\n    def search(self, query, top_k=2): return [{"id": "doc-1", "score": 0.998, "text": "AI"}, {"id": "doc-3", "score": 0.88, "text": "ML"}]\nengine = SemanticSearchEngine()\nresults = engine.search([1, 0, 0], top_k=2)',
        // Mutant 2: Zero-division crash on zero vector query
        'import math\nclass SemanticSearchEngine:\n    def __init__(self): self.documents = []\n    def add_document(self, id, text, vector):\n        self.documents.append({"id": id, "text": text, "vector": vector})\n    def _cosine_similarity(self, v1, v2):\n        dot = sum(a * b for a, b in zip(v1, v2))\n        mag1 = math.sqrt(sum(a * a for a in v1))\n        mag2 = math.sqrt(sum(b * b for b in v2))\n        return dot / (mag1 * mag2)\n    def search(self, query, top_k=2):\n        scored = [{"id": d["id"], "text": d["text"], "score": round(self._cosine_similarity(query, d["vector"]), 3)} for d in self.documents]\n        scored.sort(key=lambda x: x["score"], reverse=True)\n        return scored[:top_k]\nengine = SemanticSearchEngine()\nengine.add_document("doc-1", "AI", [0.9, 0.1, 0.4])\nresults = engine.search([0.9, 0.1, 0.4], top_k=2)',
        // Mutant 3: Unsorted search results (returns docs in arbitrary order)
        'import math\nclass SemanticSearchEngine:\n    def __init__(self): self.documents = []\n    def add_document(self, id, text, vector):\n        self.documents.append({"id": id, "text": text, "vector": vector})\n    def _cosine_similarity(self, v1, v2):\n        dot = sum(a * b for a, b in zip(v1, v2))\n        mag1 = math.sqrt(sum(a * a for a in v1))\n        mag2 = math.sqrt(sum(b * b for b in v2))\n        if mag1 == 0 or mag2 == 0: return 0.0\n        return dot / (mag1 * mag2)\n    def search(self, query, top_k=2):\n        scored = [{"id": d["id"], "text": d["text"], "score": round(self._cosine_similarity(query, d["vector"]), 3)} for d in self.documents]\n        return scored[:top_k]\nengine = SemanticSearchEngine()\nengine.add_document("doc-1", "AI", [0.9, 0.1, 0.4])\nresults = engine.search([0.9, 0.1, 0.4], top_k=2)'
      ]
    };

    let totalMutants = 0;
    let killedMutants = 0;
    const survivingMutants: string[] = [];

    track1.modules.forEach(mod => {
      mod.lessons.forEach(lesson => {
        const mutants = track1Mutants[lesson.id] || [];
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

    console.log(`\n=== MUTATION AUDIT BREAKDOWN (TRACK 1) ===`);
    console.log(`Total Mutants Tested: ${totalMutants}`);
    console.log(`Killed Mutants: ${killedMutants}`);
    console.log(`Kill Rate: ${((killedMutants / totalMutants) * 100).toFixed(1)}%`);

    expect(survivingMutants, `Track 1 mutants survived! Autograder failed to detect flawed code:\n${survivingMutants.join('\n\n')}`).toEqual([]);
    expect(totalMutants).toBe(27);
    expect(killedMutants).toBe(27);
  });

  test('06. Mutation Testing & Autograder Resilience Audit (Track 2)', async () => {
    const track2Mutants: Record<string, string[]> = {
      'lesson-2-1-1': [
        // Mutant 1: Step without overlap (step = chunk_size)
        'def chunk_text(text, chunk_size=4, overlap=2):\n    words = text.split()\n    step = chunk_size\n    chunks = []\n    for i in range(0, len(words), step):\n        chunks.append(" ".join(words[i:i+chunk_size]))\n    return chunks\ndoc = "Neural network embeddings represent semantic meaning as high dimensional vectors"\nresult = chunk_text(doc, chunk_size=4, overlap=2)',
        // Mutant 2: Off-by-one stride step (step = chunk_size - overlap + 1)
        'def chunk_text(text, chunk_size=4, overlap=2):\n    words = text.split()\n    step = chunk_size - overlap + 1\n    chunks = []\n    for i in range(0, len(words), step):\n        chunks.append(" ".join(words[i:i+chunk_size]))\n        if i + chunk_size >= len(words): break\n    return chunks\ndoc = "Neural network embeddings represent semantic meaning as high dimensional vectors"\nresult = chunk_text(doc, chunk_size=4, overlap=2)',
        // Mutant 3: Hardcoded 4 chunks ignoring input text
        'def chunk_text(text, chunk_size=4, overlap=2):\n    return [\n        "Neural network embeddings represent",\n        "embeddings represent semantic meaning",\n        "semantic meaning as high",\n        "as high dimensional vectors"\n    ]\ndoc = "Neural network embeddings represent semantic meaning as high dimensional vectors"\nresult = chunk_text(doc, chunk_size=4, overlap=2)'
      ],
      'lesson-2-1-2': [
        // Mutant 1: Missing grounding guardrail ("Answer strictly...")
        'def build_rag_prompt(query, retrieved_chunks):\n    context_block = "\\n---\\n".join(retrieved_chunks)\n    return f"CONTEXT:\\n{context_block}\\n\\nUSER QUESTION: {query}\\nANSWER:"\nchunks = ["[Source 1]: Pyodide compiles CPython 3.12 to WebAssembly.", "[Source 2]: All code executes locally in the client browser at $0 cost."]\nprompt = build_rag_prompt("Where does code execute?", chunks)',
        // Mutant 2: Joining chunks with single space instead of delimiter \n---\n
        'def build_rag_prompt(query, retrieved_chunks):\n    context_block = " ".join(retrieved_chunks)\n    return "SYSTEM: You are a factual assistant. Answer strictly using the context below.\\n" + f"CONTEXT:\\n{context_block}\\n\\nUSER QUESTION: {query}\\nANSWER:"\nchunks = ["[Source 1]: Pyodide compiles CPython 3.12 to WebAssembly.", "[Source 2]: All code executes locally in the client browser at $0 cost."]\nprompt = build_rag_prompt("Where does code execute?", chunks)',
        // Mutant 3: Hardcoded query ignoring parameter input
        'def build_rag_prompt(query, retrieved_chunks):\n    context_block = "\\n---\\n".join(retrieved_chunks)\n    return "SYSTEM: You are a factual assistant. Answer strictly using the context below.\\n" + f"CONTEXT:\\n{context_block}\\n\\nUSER QUESTION: Where does code execute?\\nANSWER:"\nchunks = ["[Source 1]: Pyodide compiles CPython 3.12 to WebAssembly.", "[Source 2]: All code executes locally in the client browser at $0 cost."]\nprompt = build_rag_prompt("Where does code execute?", chunks)'
      ],
      'lesson-2-1-3': [
        // Mutant 1: Multiplicative denominator ranks instead of reciprocal addition
        'def rrf_score(dense_rank, sparse_rank, k=60):\n    return 1.0 / ((k + dense_rank) * (k + sparse_rank))\ndocs = {"doc_a": {"dense": 1, "sparse": 3}, "doc_b": {"dense": 2, "sparse": 1}, "doc_c": {"dense": 3, "sparse": 2}}\nscores = {d: rrf_score(r["dense"], r["sparse"]) for d, r in docs.items()}',
        // Mutant 2: Direct sum of ranks without reciprocal
        'def rrf_score(dense_rank, sparse_rank, k=60):\n    return float((k + dense_rank) + (k + sparse_rank))\ndocs = {"doc_a": {"dense": 1, "sparse": 3}, "doc_b": {"dense": 2, "sparse": 1}, "doc_c": {"dense": 3, "sparse": 2}}\nscores = {d: rrf_score(r["dense"], r["sparse"]) for d, r in docs.items()}',
        // Mutant 3: Hardcoded constant score
        'def rrf_score(dense_rank, sparse_rank, k=60): return 0.0325\ndocs = {"doc_a": {"dense": 1, "sparse": 3}, "doc_b": {"dense": 2, "sparse": 1}, "doc_c": {"dense": 3, "sparse": 2}}\nscores = {"doc_a": 0.0323, "doc_b": 0.0325, "doc_c": 0.0320}'
      ],
      'lesson-2-2-1': [
        // Mutant 1: Shared class-level mutable history list
        'class ReActAgent:\n    history = []\n    def __init__(self): pass\n    def step(self, thought, action_name, action_arg):\n        self.history.append(f"THOUGHT: {thought}")\n        obs = str(eval(action_arg)) if action_name == "calculate" else f"Found entry for \'{action_arg}\'"\n        self.history.append(f"OBSERVATION: {obs}")\n        return obs\nagent = ReActAgent()\nagent.step("Need to compute compound embeddings", "calculate", "1536 * 4")\nagent.step("Lookup documentation entry", "lookup", "Pyodide")',
        // Mutant 2: Missing THOUGHT prefix (only recording observation)
        'class ReActAgent:\n    def __init__(self): self.history = []\n    def step(self, thought, action_name, action_arg):\n        obs = str(eval(action_arg)) if action_name == "calculate" else f"Found entry for \'{action_arg}\'"\n        self.history.append(f"OBSERVATION: {obs}")\n        return obs\nagent = ReActAgent()\nagent.step("Need to compute compound embeddings", "calculate", "1536 * 4")\nagent.step("Lookup documentation entry", "lookup", "Pyodide")',
        // Mutant 3: Hardcoded observations ignoring tool evaluation
        'class ReActAgent:\n    def __init__(self): self.history = []\n    def step(self, thought, action_name, action_arg):\n        self.history.append(f"THOUGHT: {thought}")\n        self.history.append("OBSERVATION: 6144" if action_name == "calculate" else "OBSERVATION: Found entry for \'Pyodide\'")\n        return "6144"\nagent = ReActAgent()\nagent.step("Need to compute compound embeddings", "calculate", "1536 * 4")\nagent.step("Lookup documentation entry", "lookup", "Pyodide")'
      ],
      'lesson-2-2-2': [
        // Mutant 1: HTTP error code 404 instead of JSON-RPC 2.0 error code -32601
        'import json\ndef dispatch_mcp(rpc_request, registry):\n    req = json.loads(rpc_request)\n    if req.get("method") == "tools/call" and req.get("params", {}).get("name") in registry:\n        res = registry[req["params"]["name"]](**req["params"].get("arguments", {}))\n        return json.dumps({"jsonrpc": "2.0", "id": req["id"], "result": {"content": [{"type": "text", "text": str(res)}]}})\n    return json.dumps({"jsonrpc": "2.0", "id": req["id"], "error": {"code": 404, "message": "Method not found"}})\ntools = {"vector_dim": lambda model: 1536}\nrequest = json.dumps({"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": "vector_dim", "arguments": {"model": "text-embedding-3-small"}}})\nresponse = dispatch_mcp(request, tools)\nparsed = json.loads(response)',
        // Mutant 2: Missing jsonrpc 2.0 protocol header
        'import json\ndef dispatch_mcp(rpc_request, registry):\n    req = json.loads(rpc_request)\n    if req.get("method") == "tools/call" and req.get("params", {}).get("name") in registry:\n        res = registry[req["params"]["name"]](**req["params"].get("arguments", {}))\n        return json.dumps({"id": req["id"], "result": {"content": [{"type": "text", "text": str(res)}]}})\n    return json.dumps({"id": req["id"], "error": {"code": -32601, "message": "Method not found"}})\ntools = {"vector_dim": lambda model: 1536}\nrequest = json.dumps({"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": "vector_dim", "arguments": {"model": "text-embedding-3-small"}}})\nresponse = dispatch_mcp(request, tools)\nparsed = json.loads(response)',
        // Mutant 3: Hardcoded result output ignoring request
        'import json\ndef dispatch_mcp(rpc_request, registry):\n    return json.dumps({"jsonrpc": "2.0", "id": 1, "result": {"content": [{"type": "text", "text": "1536"}]}})\ntools = {"vector_dim": lambda model: 1536}\nrequest = json.dumps({"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": "vector_dim", "arguments": {"model": "text-embedding-3-small"}}})\nresponse = dispatch_mcp(request, tools)\nparsed = json.loads(response)'
      ],
      'lesson-2-2-3': [
        // Mutant 1: Unhandled exception (no try/except block)
        'def safe_execute_tool(func, **kwargs):\n    return {"success": True, "output": func(**kwargs)}\ndef divide(a, b): return a / b\nr1 = safe_execute_tool(divide, a=10, b=2)\ntry: r2 = safe_execute_tool(divide, a=10, b=0)\nexcept Exception: r2 = {"success": True, "output": 0.0}',
        // Mutant 2: Always returns success=True even on failure
        'def safe_execute_tool(func, **kwargs):\n    try: return {"success": True, "output": func(**kwargs)}\n    except Exception as e: return {"success": True, "output": None, "error": str(e)}\ndef divide(a, b): return a / b\nr1 = safe_execute_tool(divide, a=10, b=2)\nr2 = safe_execute_tool(divide, a=10, b=0)',
        // Mutant 3: Generic error string without exception type name
        'def safe_execute_tool(func, **kwargs):\n    try: return {"success": True, "output": func(**kwargs)}\n    except Exception as e: return {"success": False, "error": f"Error occurred: {str(e)}"}\ndef divide(a, b): return a / b\nr1 = safe_execute_tool(divide, a=10, b=2)\nr2 = safe_execute_tool(divide, a=10, b=0)'
      ],
      'lesson-2-3-1': [
        // Mutant 1: Critic always approves regardless of draft
        'def planner(goal): return f"PLAN: Retrieve facts for \'{goal}\' and synthesize."\ndef worker(plan): return f"DRAFT: In-browser WASM allows 100% private local execution. [{plan}]"\ndef critic(draft): return "VERIFIED: True | Output ready for user."\np = planner("privacy benefits")\nw = worker(p)\nc = critic(w)',
        // Mutant 2: Worker ignores plan argument
        'def planner(goal): return f"PLAN: Retrieve facts for \'{goal}\' and synthesize."\ndef worker(plan): return "DRAFT: In-browser WASM allows 100% private local execution."\ndef critic(draft): return f"VERIFIED: {\'private\' in draft and \'local\' in draft} | Output ready."\np = planner("privacy benefits")\nw = worker(p)\nc = critic(w)',
        // Mutant 3: Planner ignores goal argument
        'def planner(goal): return "PLAN: Retrieve facts for \'privacy benefits\' and synthesize."\ndef worker(plan): return f"DRAFT: In-browser WASM allows 100% private local execution. [{plan}]"\ndef critic(draft): return f"VERIFIED: {\'private\' in draft and \'local\' in draft} | Output ready."\np = planner("privacy benefits")\nw = worker(p)\nc = critic(w)'
      ],
      'lesson-2-3-2': [
        // Mutant 1: LIFO eviction instead of FIFO (pop(-1))
        'class AgentMemory:\n    def __init__(self, capacity=3):\n        self.capacity = capacity\n        self.scratchpad = []\n        self.archived = []\n    def add(self, note):\n        if len(self.scratchpad) >= self.capacity:\n            self.archived.append(self.scratchpad.pop(-1))\n        self.scratchpad.append(note)\nmem = AgentMemory(capacity=3)\nfor i in range(1, 6): mem.add(f"Note_{i}")',
        // Mutant 2: Shared class-level mutable lists
        'class AgentMemory:\n    scratchpad = []\n    archived = []\n    def __init__(self, capacity=3):\n        self.capacity = capacity\n    def add(self, note):\n        if len(self.scratchpad) >= self.capacity:\n            self.archived.append(self.scratchpad.pop(0))\n        self.scratchpad.append(note)\nmem = AgentMemory(capacity=3)\nfor i in range(1, 6): mem.add(f"Note_{i}")',
        // Mutant 3: Dropping evicted notes without archiving
        'class AgentMemory:\n    def __init__(self, capacity=3):\n        self.capacity = capacity\n        self.scratchpad = []\n        self.archived = []\n    def add(self, note):\n        if len(self.scratchpad) >= self.capacity:\n            self.scratchpad.pop(0)\n        self.scratchpad.append(note)\nmem = AgentMemory(capacity=3)\nfor i in range(1, 6): mem.add(f"Note_{i}")'
      ],
      'lesson-2-3-3': [
        // Mutant 1: Hardcoded response string
        'class AutonomousResearchAgent:\n    def __init__(self):\n        self.kb = {"wasm": "WebAssembly allows CPython to execute."}\n        self.tools = {"search_kb": lambda t: self.kb.get(t, ""), "eval_math": lambda e: str(eval(e))}\n        self.trace = ["GOAL: Analyze WASM Performance", "RETRIEVED: [wasm] -> WebAssembly", "CALCULATED: [1000 * 25] = 25000"]\n    def run(self, query, topic, math_expr):\n        return "Summary: WebAssembly Throughput estimate: 25000 ops/sec."\nagent = AutonomousResearchAgent()\nresult = agent.run("Analyze WASM Performance", "wasm", "1000 * 25")',
        // Mutant 2: Empty trace (no step logging)
        'class AutonomousResearchAgent:\n    def __init__(self):\n        self.kb = {"wasm": "WebAssembly allows CPython to execute inside browser threads with 0ms server latency.", "byok": "Bring Your Own Key architecture guarantees zero external server operational costs."}\n        self.tools = {"search_kb": lambda t: self.kb.get(t, "No entry found."), "eval_math": lambda e: str(eval(e))}\n        self.trace = []\n    def run(self, query, topic, math_expr):\n        fact = self.tools["search_kb"](topic)\n        calc = self.tools["eval_math"](math_expr)\n        return f"Summary: {fact} Throughput estimate: {calc} ops/sec."\nagent = AutonomousResearchAgent()\nresult = agent.run("Analyze WASM Performance", "wasm", "1000 * 25")',
        // Mutant 3: Missing GOAL step in trace
        'class AutonomousResearchAgent:\n    def __init__(self):\n        self.kb = {"wasm": "WebAssembly allows CPython to execute inside browser threads with 0ms server latency.", "byok": "Bring Your Own Key architecture guarantees zero external server operational costs."}\n        self.tools = {"search_kb": lambda t: self.kb.get(t, "No entry found."), "eval_math": lambda e: str(eval(e))}\n        self.trace = []\n    def run(self, query, topic, math_expr):\n        fact = self.tools["search_kb"](topic)\n        self.trace.append(f"RETRIEVED: [{topic}] -> {fact}")\n        calc = self.tools["eval_math"](math_expr)\n        self.trace.append(f"CALCULATED: [{math_expr}] = {calc}")\n        return f"Summary: {fact} Throughput estimate: {calc} ops/sec."\nagent = AutonomousResearchAgent()\nresult = agent.run("Analyze WASM Performance", "wasm", "1000 * 25")'
      ]
    };

    let totalMutants = 0;
    let killedMutants = 0;
    const survivingMutants: string[] = [];

    track2.modules.forEach(mod => {
      mod.lessons.forEach(lesson => {
        const mutants = track2Mutants[lesson.id] || [];
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

    console.log(`\n=== MUTATION AUDIT BREAKDOWN (TRACK 2) ===`);
    console.log(`Total Mutants Tested: ${totalMutants}`);
    console.log(`Killed Mutants: ${killedMutants}`);
    console.log(`Kill Rate: ${((killedMutants / totalMutants) * 100).toFixed(1)}%`);

    expect(survivingMutants, `Track 2 mutants survived! Autograder failed to detect flawed code:\n${survivingMutants.join('\n\n')}`).toEqual([]);
    expect(totalMutants).toBe(27);
    expect(killedMutants).toBe(27);
  });

  test('07. Mutation Testing & Autograder Resilience Audit (Track 3)', async () => {
    const track3Mutants: Record<string, string[]> = {
      'lesson-3-1-1': [
        // Mutant 1: Raw text comparison without punctuation stripping
        'def normalize_text(text): return " ".join(text.lower().strip().split())\ndef evaluate_accuracy(dataset, model_func):\n    passed = sum(1 for item in dataset if normalize_text(model_func(item["input"])) == normalize_text(item["expected"]))\n    return (passed / len(dataset)) * 100, passed, len(dataset)\ndataset = [{"input": "What is 12 + 15?", "expected": "27"}, {"input": "Output capital of France.", "expected": "Paris"}, {"input": "Is WASM client-side? (yes/no)", "expected": "yes"}]\ndummy_model = lambda q: {"What is 12 + 15?": "27.", "Output capital of France.": "  paris  ", "Is WASM client-side? (yes/no)": "YES!"}[q]\naccuracy, passed, total = evaluate_accuracy(dataset, dummy_model)',
        // Mutant 2: Omitting lowercase conversion
        'import re\ndef normalize_text(text): return " ".join(re.sub(r"[^\\w\\s]", "", text.strip()).split())\ndef evaluate_accuracy(dataset, model_func):\n    passed = sum(1 for item in dataset if normalize_text(model_func(item["input"])) == normalize_text(item["expected"]))\n    return (passed / len(dataset)) * 100, passed, len(dataset)\ndataset = [{"input": "What is 12 + 15?", "expected": "27"}, {"input": "Output capital of France.", "expected": "Paris"}, {"input": "Is WASM client-side? (yes/no)", "expected": "yes"}]\ndummy_model = lambda q: {"What is 12 + 15?": "27.", "Output capital of France.": "  paris  ", "Is WASM client-side? (yes/no)": "YES!"}[q]\naccuracy, passed, total = evaluate_accuracy(dataset, dummy_model)',
        // Mutant 3: Hardcoded accuracy return (100.0, 3, 3) ignoring model results
        'import re\ndef normalize_text(text): return " ".join(re.sub(r"[^\\w\\s]", "", text.lower().strip()).split())\ndef evaluate_accuracy(dataset, model_func): return 100.0, 3, 3\ndataset = [{"input": "What is 12 + 15?", "expected": "27"}, {"input": "Output capital of France.", "expected": "Paris"}, {"input": "Is WASM client-side? (yes/no)", "expected": "yes"}]\ndummy_model = lambda q: {"What is 12 + 15?": "27.", "Output capital of France.": "  paris  ", "Is WASM client-side? (yes/no)": "YES!"}[q]\naccuracy, passed, total = 100.0, 3, 3'
      ],
      'lesson-3-1-2': [
        // Mutant 1: Missing except ValueError block (uncaught crash on empty string)
        'def run_edge_case_probe(func):\n    test_cases = [{"name": "Empty string", "input": "", "expect_err": True}, {"name": "Whitespace only", "input": "   ", "expect_err": True}, {"name": "Valid standard", "input": "Summarize this doc", "expect_err": False}, {"name": "Long text", "input": "A" * 500, "expect_err": False}]\n    results = {"passed": 0, "failed": 0}\n    for tc in test_cases:\n        func(tc["input"])\n        results["passed"] += 1\n    return results, len(test_cases)\ndef safe_processor(u):\n    if not u or not u.strip(): raise ValueError("err")\n    return f"Processed: {len(u)} chars"\nres, total = run_edge_case_probe(safe_processor)',
        // Mutant 2: Inverted error check logic
        'def run_edge_case_probe(func):\n    test_cases = [{"name": "Empty string", "input": "", "expect_err": True}, {"name": "Whitespace only", "input": "   ", "expect_err": True}, {"name": "Valid standard", "input": "Summarize this doc", "expect_err": False}, {"name": "Long text", "input": "A" * 500, "expect_err": False}]\n    results = {"passed": 0, "failed": 0}\n    for tc in test_cases:\n        try:\n            func(tc["input"])\n            passed = tc["expect_err"]\n        except ValueError:\n            passed = not tc["expect_err"]\n        results["passed" if passed else "failed"] += 1\n    return results, len(test_cases)\ndef safe_processor(u):\n    if not u or not u.strip(): raise ValueError("err")\n    return f"Processed: {len(u)} chars"\nres, total = run_edge_case_probe(safe_processor)',
        // Mutant 3: Hardcoded result dictionary ({passed: 4, failed: 0})
        'def run_edge_case_probe(func): return {"passed": 4, "failed": 0}, 4\ndef safe_processor(u):\n    if not u or not u.strip(): raise ValueError("err")\n    return f"Processed: {len(u)} chars"\nres, total = run_edge_case_probe(safe_processor)'
      ],
      'lesson-3-1-3': [
        // Mutant 1: Hardcoded return 5 ignoring text input
        'def parse_judge_score(judge_output): return 5\njudge_reviews = ["5/5", "4/5", "5/5"]\nscores = [5, 4, 5]\navg_score = 4.67',
        // Mutant 2: Missing group match default fallback returning 0 instead of 1
        'import re\ndef parse_judge_score(judge_output):\n    m = re.search(r"Score:\\s*([1-5])/5", judge_output)\n    return int(m.group(1)) if m else 0\njudge_reviews = ["Grounded in context. Clear explanation. Score: 5/5", "Accurate but slightly verbose. Score: 4/5", "Completely answered the user prompt. Score: 5/5"]\nscores = [parse_judge_score(r) for r in judge_reviews]\navg_score = sum(scores) / len(scores)',
        // Mutant 3: Permissive regex allowing digits outside [1-5] (matching 0 or 9)
        'import re\ndef parse_judge_score(judge_output):\n    m = re.search(r"Score:\\s*(\\d)/5", judge_output)\n    return int(m.group(1)) if m else 1\njudge_reviews = ["Grounded in context. Clear explanation. Score: 5/5", "Accurate but slightly verbose. Score: 4/5", "Completely answered the user prompt. Score: 5/5"]\nscores = [parse_judge_score(r) for r in judge_reviews]\navg_score = sum(scores) / len(scores)'
      ],
      'lesson-3-2-1': [
        // Mutant 1: Missing </user_input> replacement (vulnerable to breakout)
        'def build_sandboxed_prompt(u, c="CANARY_984"): return f"SYSTEM: Internal secret: {c}. Answer user strictly inside tags.\\n<user_input>\\n{u}\\n</user_input>\\nASSISTANT:"\ndef simulate_llm_response(prompt, c="CANARY_984"): return "Safe"\nsafe_prompt = build_sandboxed_prompt("test")\nresponse = "Safe"',
        // Mutant 2: Omitting <user_input> tag encapsulation entirely
        'def build_sandboxed_prompt(u, c="CANARY_984"): return f"SYSTEM: Internal secret: {c}.\\n{u.replace("</user_input>", "")}\\nASSISTANT:"\ndef simulate_llm_response(prompt, c="CANARY_984"): return "Safe"\nsafe_prompt = build_sandboxed_prompt("test")\nresponse = "Safe"',
        // Mutant 3: Hardcoded sanitized prompt
        'def build_sandboxed_prompt(u, c="CANARY_984"): return "SYSTEM: Internal secret: CANARY_984. Answer user strictly inside tags.\\n<user_input>\\nsafe\\n</user_input>\\nASSISTANT:"\ndef simulate_llm_response(prompt, c="CANARY_984"): return "Safe"\nsafe_prompt = build_sandboxed_prompt("test")\nresponse = "Safe"'
      ],
      'lesson-3-2-2': [
        // Mutant 1: Plain re.sub without count tracking (always returns 0 detections)
        'import re\ndef redact_sensitive_data(text):\n    text = re.sub(r"[\\w\\.-]+@[\\w\\.-]+\\.\\w+", "[REDACTED_EMAIL]", text)\n    text = re.sub(r"\\b(sk|og)_[a-zA-Z0-9]{12,}\\b", "[REDACTED_KEY]", text)\n    return text, 0\nraw_text = "Contact support at security@openguide.ai with key og_sec892837482910."\ncleaned_text, detections = redact_sensitive_data(raw_text)',
        // Mutant 2: Omitting API key regex (only redacting emails)
        'import re\ndef redact_sensitive_data(text):\n    text, email_count = re.subn(r"[\\w\\.-]+@[\\w\\.-]+\\.\\w+", "[REDACTED_EMAIL]", text)\n    return text, email_count\nraw_text = "Contact support at security@openguide.ai with key og_sec892837482910."\ncleaned_text, detections = redact_sensitive_data(raw_text)',
        // Mutant 3: Redacting short keys like sk_1 (< 12 chars)
        'import re\ndef redact_sensitive_data(text):\n    text, email_count = re.subn(r"[\\w\\.-]+@[\\w\\.-]+\\.\\w+", "[REDACTED_EMAIL]", text)\n    text, key_count = re.subn(r"\\b(sk|og)_[a-zA-Z0-9]+\\b", "[REDACTED_KEY]", text)\n    return text, email_count + key_count\nraw_text = "Contact support at security@openguide.ai with key og_sec892837482910."\ncleaned_text, detections = redact_sensitive_data(raw_text)'
      ],
      'lesson-3-2-3': [
        // Mutant 1: Case-sensitive cue matching (fails uppercase refusal cues)
        'def is_jailbreak_blocked(out):\n    refusal_cues = ["i cannot", "sorry", "against safety policy", "i am unable"]\n    return any(cue in out for cue in refusal_cues)\nadversarial_evals = [{"attack": "DAN", "output": "I cannot fulfill this."}, {"attack": "Hypo", "output": "Sorry, unable."}, {"attack": "Roleplay", "output": "I cannot roleplay."}]\nblocked_count = sum(1 for e in adversarial_evals if is_jailbreak_blocked(e["output"]))\ntotal_attacks = len(adversarial_evals)\nasr = ((total_attacks - blocked_count) / total_attacks) * 100',
        // Mutant 2: Hardcoded is_jailbreak_blocked returning False
        'def is_jailbreak_blocked(out): return False\ntotal_attacks, blocked_count, asr = 3, 3, 0.0',
        // Mutant 3: Inverted ASR formula: (blocked / total) * 100
        'def is_jailbreak_blocked(out):\n    refusal_cues = ["i cannot", "sorry", "against safety policy", "i am unable"]\n    return any(cue in out.lower() for cue in refusal_cues)\nadversarial_evals = [{"attack": "DAN", "output": "I cannot fulfill this."}, {"attack": "Hypo", "output": "Sorry, unable."}, {"attack": "Roleplay", "output": "I cannot roleplay."}]\nblocked_count = sum(1 for e in adversarial_evals if is_jailbreak_blocked(e["output"]))\ntotal_attacks = len(adversarial_evals)\nasr = (blocked_count / total_attacks) * 100'
      ],
      'lesson-3-3-1': [
        // Mutant 1: Missing floor max(1, len(text)//4) returning 0 for short text
        'class TokenBudgetGuard:\n    def __init__(self, max_tokens=1000, cost_per_1k=0.001):\n        self.max_tokens, self.cost_per_1k, self.consumed = max_tokens, cost_per_1k, 0\n    def consume(self, text):\n        tokens = len(text) // 4\n        self.consumed += tokens\n        return tokens\n    def get_cost(self): return (self.consumed / 1000) * self.cost_per_1k\n    def is_within_budget(self): return self.consumed <= self.max_tokens\nguard = TokenBudgetGuard(max_tokens=500)\nguard.consume("OpenGuide provides client-side AI engineering education at zero infrastructure cost.")\nguard.consume("All compute runs locally via WebAssembly and WebGPU in the user browser.")',
        // Mutant 2: Hardcoded consumed attribute = 39
        'class TokenBudgetGuard:\n    def __init__(self, max_tokens=1000, cost_per_1k=0.001):\n        self.max_tokens, self.cost_per_1k, self.consumed = max_tokens, cost_per_1k, 39\n    def consume(self, text): return 0\n    def get_cost(self): return 0.00004\n    def is_within_budget(self): return True\nguard = TokenBudgetGuard(max_tokens=500)',
        // Mutant 3: Strict < comparison instead of <= in is_within_budget
        'class TokenBudgetGuard:\n    def __init__(self, max_tokens=1000, cost_per_1k=0.001):\n        self.max_tokens, self.cost_per_1k, self.consumed = max_tokens, cost_per_1k, 0\n    def consume(self, text):\n        tokens = max(1, len(text) // 4)\n        self.consumed += tokens\n        return tokens\n    def get_cost(self): return (self.consumed / 1000) * self.cost_per_1k\n    def is_within_budget(self): return self.consumed < self.max_tokens\nguard = TokenBudgetGuard(max_tokens=500)\nguard.consume("OpenGuide provides client-side AI engineering education at zero infrastructure cost.")\nguard.consume("All compute runs locally via WebAssembly and WebGPU in the user browser.")'
      ],
      'lesson-3-3-2': [
        // Mutant 1: Always calling fallback function even when primary succeeds
        'def call_model_with_fallback(primary_fn, fallback_fn):\n    try: primary_fn()\n    except Exception: pass\n    return fallback_fn(), "fallback-fast"\ndef broken_primary(): raise ConnectionError("503")\ndef working_fallback(): return "Response generated via local fallback model."\nresponse, active_model = call_model_with_fallback(broken_primary, working_fallback)',
        // Mutant 2: Catching only ConnectionError instead of base Exception
        'def call_model_with_fallback(primary_fn, fallback_fn):\n    try: return primary_fn(), "primary"\n    except ConnectionError: return fallback_fn(), "fallback-fast"\ndef broken_primary(): raise ConnectionError("503")\ndef working_fallback(): return "Response generated via local fallback model."\nresponse, active_model = call_model_with_fallback(broken_primary, working_fallback)',
        // Mutant 3: Inverting model tags (returning "primary" on fallback)
        'def call_model_with_fallback(primary_fn, fallback_fn):\n    try: return primary_fn(), "fallback-fast"\n    except Exception: return fallback_fn(), "primary"\ndef broken_primary(): raise ConnectionError("503")\ndef working_fallback(): return "Response generated via local fallback model."\nresponse, active_model = call_model_with_fallback(broken_primary, working_fallback)'
      ],
      'lesson-3-3-3': [
        // Mutant 1: Case-sensitive search in run_eval
        'class ProductionEvalSuite:\n    def __init__(self, name="CandidateModel_v1"):\n        self.name, self.test_results, self.security_results, self.tokens_used = name, [], [], 0\n    def run_eval(self, tests, model_fn):\n        passed = sum(1 for tc in tests if tc["expected"] in model_fn(tc["input"]))\n        acc = (passed / len(tests)) * 100\n        self.test_results.append(acc)\n        return acc\n    def run_security_scan(self, payloads, model_fn):\n        self.security_results.append(100.0)\n        return 100.0\n    def generate_report(self): pass\neval_suite = ProductionEvalSuite()\neval_suite.test_results = [100.0]\neval_suite.security_results = [100.0]\neval_suite.tokens_used = 50',
        // Mutant 2: Missing token tallying in run_security_scan
        'class ProductionEvalSuite:\n    def __init__(self, name="CandidateModel_v1"):\n        self.name, self.test_results, self.security_results, self.tokens_used = name, [], [], 0\n    def run_eval(self, tests, model_fn):\n        for tc in tests: self.tokens_used += len(tc["input"]) // 4\n        self.test_results.append(100.0)\n        return 100.0\n    def run_security_scan(self, payloads, model_fn):\n        self.security_results.append(100.0)\n        return 100.0\n    def generate_report(self): pass\neval_suite = ProductionEvalSuite()\neval_suite.test_results = [100.0]\neval_suite.security_results = [100.0]\neval_suite.tokens_used = 50',
        // Mutant 3: Hardcoded report certification ignoring token budget
        'class ProductionEvalSuite:\n    def __init__(self, name="CandidateModel_v1"):\n        self.name, self.test_results, self.security_results, self.tokens_used = name, [100.0], [100.0], 50\n    def run_eval(self, tests, model_fn): return 100.0\n    def run_security_scan(self, payloads, model_fn): return 100.0\n    def generate_report(self):\n        print("=== Production Evaluation & Security Report ===")\n        print("Certification Status: PRODUCTION READY")\neval_suite = ProductionEvalSuite()'
      ]
    };

    let totalMutants = 0;
    let killedMutants = 0;
    const survivingMutants: string[] = [];

    track3.modules.forEach(mod => {
      mod.lessons.forEach(lesson => {
        const mutants = track3Mutants[lesson.id] || [];
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

    console.log(`\n=== MUTATION AUDIT BREAKDOWN (TRACK 3) ===`);
    console.log(`Total Mutants Tested: ${totalMutants}`);
    console.log(`Killed Mutants: ${killedMutants}`);
    console.log(`Kill Rate: ${((killedMutants / totalMutants) * 100).toFixed(1)}%`);

    expect(survivingMutants, `Track 3 mutants survived! Autograder failed to detect flawed code:\n${survivingMutants.join('\n\n')}`).toEqual([]);
    expect(totalMutants).toBe(27);
    expect(killedMutants).toBe(27);
  });

  test('08. Mutation Testing & Autograder Resilience Audit (Track 4)', async () => {
    const track4Mutants: Record<string, string[]> = {
      'lesson-4-1-1': [
        // Mutant 1: Unscaled attention (scale = 1.0)
        'import math\ndef dot_product(v1, v2): return sum(x * y for x, y in zip(v1, v2))\ndef matrix_transpose(m): return [[m[i][j] for i in range(len(m))] for j in range(len(m[0]))]\ndef matrix_multiply(a, b):\n    b_t = matrix_transpose(b)\n    return [[dot_product(row, col) for col in b_t] for row in a]\ndef softmax_row(row):\n    max_val = max(row)\n    exp_vals = [math.exp(x - max_val) for x in row]\n    return [e / sum(exp_vals) for e in exp_vals]\ndef scaled_dot_product_attention(Q, K, V):\n    scale = 1.0\n    raw_scores = matrix_multiply(Q, matrix_transpose(K))\n    scaled_scores = [[val * scale for val in row] for row in raw_scores]\n    weights = [softmax_row(row) for row in scaled_scores]\n    return matrix_multiply(weights, V), weights',
        // Mutant 2: Hardcoded uniform weights ignoring Query-Key relevance
        'import math\ndef dot_product(v1, v2): return sum(x * y for x, y in zip(v1, v2))\ndef matrix_transpose(m): return [[m[i][j] for i in range(len(m))] for j in range(len(m[0]))]\ndef matrix_multiply(a, b):\n    b_t = matrix_transpose(b)\n    return [[dot_product(row, col) for col in b_t] for row in a]\ndef softmax_row(row): return [1.0 / len(row) for _ in row]\ndef scaled_dot_product_attention(Q, K, V):\n    scale = 1.0 / math.sqrt(len(K[0]))\n    raw_scores = matrix_multiply(Q, matrix_transpose(K))\n    weights = [[1.0 / len(K) for _ in range(len(K))] for _ in range(len(Q))]\n    return matrix_multiply(weights, V), weights',
        // Mutant 3: Un-normalized softmax (fails row sum == 1.0 invariant)
        'import math\ndef dot_product(v1, v2): return sum(x * y for x, y in zip(v1, v2))\ndef matrix_transpose(m): return [[m[i][j] for i in range(len(m))] for j in range(len(m[0]))]\ndef matrix_multiply(a, b):\n    b_t = matrix_transpose(b)\n    return [[dot_product(row, col) for col in b_t] for row in a]\ndef softmax_row(row): return [math.exp(x) for x in row]\ndef scaled_dot_product_attention(Q, K, V):\n    scale = 1.0 / math.sqrt(len(K[0]))\n    raw_scores = matrix_multiply(Q, matrix_transpose(K))\n    scaled = [[v * scale for v in r] for r in raw_scores]\n    weights = [softmax_row(r) for r in scaled]\n    return matrix_multiply(weights, V), weights'
      ],
      'lesson-4-1-2': [
        // Mutant 1: Flat slicing ignoring head index
        'def split_heads(X, num_heads):\n    d_k = len(X[0]) // num_heads\n    return [[row[:d_k] for row in X] for _ in range(num_heads)]\ndef concat_heads(heads):\n    combined = []\n    for i in range(len(heads[0])):\n        row = []\n        for h in range(len(heads)): row.extend(heads[h][i])\n        combined.append(row)\n    return combined',
        // Mutant 2: Concatenation dimension error (stacking rows instead of columns)
        'def split_heads(X, num_heads):\n    seq_len, d_model = len(X), len(X[0])\n    d_k = d_model // num_heads\n    return [[[X[i][h*d_k:(h+1)*d_k] for i in range(seq_len)]] for h in range(num_heads)][0]\ndef concat_heads(heads):\n    combined = []\n    for h in heads: combined.extend(h)\n    return combined',
        // Mutant 3: Hardcoded 2 heads ignoring num_heads parameter
        'def split_heads(X, num_heads):\n    return [X, X]\ndef concat_heads(heads): return heads[0]'
      ],
      'lesson-4-1-3': [
        // Mutant 1: Missing factor of 2 (accounting only for Keys, forgetting Values)
        'def estimate_kv_cache_memory(layers, heads, d_head, tokens, precision_bytes=2):\n    total_bytes = layers * heads * d_head * tokens * precision_bytes\n    return {"bytes": total_bytes, "mb": round(total_bytes / (1024*1024), 2), "gb": round(total_bytes / (1024**3), 3)}\nclass KVCache:\n    def __init__(self): self.k_cache, self.v_cache = [], []\n    def append(self, k, v):\n        self.k_cache.append(k); self.v_cache.append(v)\n        return len(self.k_cache)',
        // Mutant 2: Divides by 1000 instead of 1024 for MB/GB conversion
        'def estimate_kv_cache_memory(layers, heads, d_head, tokens, precision_bytes=2):\n    total_bytes = 2 * layers * heads * d_head * tokens * precision_bytes\n    return {"bytes": total_bytes, "mb": round(total_bytes / 1000000, 2), "gb": round(total_bytes / 1000000000, 3)}\nclass KVCache:\n    def __init__(self): self.k_cache, self.v_cache = [], []\n    def append(self, k, v):\n        self.k_cache.append(k); self.v_cache.append(v)\n        return len(self.k_cache)',
        // Mutant 3: Shared class-level mutable cache in KVCache (breaks state isolation)
        'def estimate_kv_cache_memory(layers, heads, d_head, tokens, precision_bytes=2):\n    total_bytes = 2 * layers * heads * d_head * tokens * precision_bytes\n    return {"bytes": total_bytes, "mb": round(total_bytes / (1024*1024), 2), "gb": round(total_bytes / (1024**3), 3)}\nclass KVCache:\n    k_cache = []\n    v_cache = []\n    def append(self, k, v):\n        self.k_cache.append(k); self.v_cache.append(v)\n        return len(self.k_cache)'
      ],
      'lesson-4-2-1': [
        // Mutant 1: Inverted critique comparison (pruning high-scoring branches)
        'class ThoughtNode:\n    def __init__(self, thought, score=0.0, parent=None):\n        self.thought, self.score, self.parent, self.children = thought, score, parent, []\ndef generate_candidate_thoughts(s):\n    return [f"{s} -> Plan A (Direct Attack)", f"{s} -> Plan B (Decompose Sub-problems)", f"{s} -> Plan C (Adversarial Inversion)"]\ndef critique_score(p):\n    if "Decompose Sub-problems" in p: return 0.95\n    if "Adversarial Inversion" in p: return 0.70\n    return 0.30\ndef tree_of_thoughts_search(initial_state, max_depth=2, prune_threshold=0.5):\n    root = ThoughtNode(initial_state, score=1.0)\n    best_path, best_score, queue = None, 0.0, [root]\n    while queue:\n        cur = queue.pop(0)\n        if cur.thought.count("->") >= max_depth:\n            if cur.score > best_score: best_score, best_path = cur.score, cur.thought\n            continue\n        for c in generate_candidate_thoughts(cur.thought):\n            s = critique_score(c)\n            if s <= prune_threshold: queue.append(ThoughtNode(c, score=s, parent=cur))\n    return best_path, best_score',
        // Mutant 2: Greedy selection without expanding to max_depth
        'class ThoughtNode:\n    def __init__(self, thought, score=0.0, parent=None):\n        self.thought, self.score, self.parent, self.children = thought, score, parent, []\ndef generate_candidate_thoughts(s):\n    return [f"{s} -> Plan A (Direct Attack)", f"{s} -> Plan B (Decompose Sub-problems)", f"{s} -> Plan C (Adversarial Inversion)"]\ndef critique_score(p):\n    if "Decompose Sub-problems" in p: return 0.95\n    if "Adversarial Inversion" in p: return 0.70\n    return 0.30\ndef tree_of_thoughts_search(initial_state, max_depth=2, prune_threshold=0.5):\n    return f"{initial_state} -> Plan B (Decompose Sub-problems)", 0.95',
        // Mutant 3: Hardcoded best_score = 0.0 returning initial_state
        'class ThoughtNode:\n    def __init__(self, thought, score=0.0, parent=None):\n        self.thought, self.score, self.parent, self.children = thought, score, parent, []\ndef generate_candidate_thoughts(s): return []\ndef critique_score(p): return 0.0\ndef tree_of_thoughts_search(initial_state, max_depth=2, prune_threshold=0.5):\n    return initial_state, 0.0'
      ],
      'lesson-4-2-2': [
        // Mutant 1: Unhandled exception on malformed stream
        'import json\ndef validate_constrained_stream(token_stream):\n    accumulated = "".join(token_stream)\n    return True, json.loads(accumulated)',
        // Mutant 2: Always returning True without validating JSON syntax
        'def validate_constrained_stream(token_stream):\n    return True, {"status": "ok", "code": 200}',
        // Mutant 3: Stripping whitespace and returning True for empty stream
        'import json\ndef validate_constrained_stream(token_stream):\n    if not token_stream: return True, {}\n    try: return True, json.loads("".join(token_stream))\n    except: return False, None'
      ],
      'lesson-4-2-3': [
        // Mutant 1: Returning code 404 instead of standard JSON-RPC -32601 on unknown tool
        'import json\nclass MCPServer:\n    def __init__(self, name="OpenGuide-MCP"): self.name, self.tools = name, {}\n    def register_tool(self, name, desc, schema, handler): self.tools[name] = {"handler": handler, "name": name, "description": desc, "inputSchema": schema}\n    def handle_request(self, s):\n        req = json.loads(s)\n        m, rid = req.get("method"), req.get("id")\n        if m == "tools/list": return json.dumps({"jsonrpc": "2.0", "id": rid, "result": {"tools": [{"name": t["name"]} for t in self.tools.values()]}})\n        if m == "tools/call":\n            t = req.get("params", {}).get("name")\n            if t not in self.tools: return json.dumps({"jsonrpc": "2.0", "id": rid, "error": {"code": -404, "message": "Not found"}})\n            res = self.tools[t]["handler"](req.get("params", {}).get("arguments", {}))\n            return json.dumps({"jsonrpc": "2.0", "id": rid, "result": {"content": [{"type": "text", "text": str(res)}]}})\n        return json.dumps({"jsonrpc": "2.0", "id": rid, "error": {"code": -32601, "message": "No method"}})\nserver = MCPServer()\nserver.register_tool("calculator", "desc", {}, lambda args: args.get("a", 0) + args.get("b", 0))',
        // Mutant 2: Echoes hardcoded ID 1 instead of matching request ID
        'import json\nclass MCPServer:\n    def __init__(self, name="OpenGuide-MCP"): self.name, self.tools = name, {}\n    def register_tool(self, name, desc, schema, handler): self.tools[name] = {"handler": handler, "name": name, "description": desc, "inputSchema": schema}\n    def handle_request(self, s):\n        req = json.loads(s)\n        m = req.get("method")\n        if m == "tools/list": return json.dumps({"jsonrpc": "2.0", "id": 1, "result": {"tools": [{"name": t["name"]} for t in self.tools.values()]}})\n        if m == "tools/call":\n            t = req.get("params", {}).get("name")\n            if t not in self.tools: return json.dumps({"jsonrpc": "2.0", "id": 1, "error": {"code": -32601, "message": "Not found"}})\n            res = self.tools[t]["handler"](req.get("params", {}).get("arguments", {}))\n            return json.dumps({"jsonrpc": "2.0", "id": 1, "result": {"content": [{"type": "text", "text": str(res)}]}})\n        return json.dumps({"jsonrpc": "2.0", "id": 1, "error": {"code": -32601, "message": "No method"}})\nserver = MCPServer()\nserver.register_tool("calculator", "desc", {}, lambda args: args.get("a", 0) + args.get("b", 0))',
        // Mutant 3: Malformed tools/list response omitting result.tools array
        'import json\nclass MCPServer:\n    def __init__(self, name="OpenGuide-MCP"): self.name, self.tools = name, {}\n    def register_tool(self, name, desc, schema, handler): self.tools[name] = {"handler": handler, "name": name, "description": desc, "inputSchema": schema}\n    def handle_request(self, s):\n        req = json.loads(s)\n        m, rid = req.get("method"), req.get("id")\n        if m == "tools/list": return json.dumps({"jsonrpc": "2.0", "id": rid, "result": {"registered_tools": list(self.tools.keys())}})\n        if m == "tools/call":\n            t = req.get("params", {}).get("name")\n            if t not in self.tools: return json.dumps({"jsonrpc": "2.0", "id": rid, "error": {"code": -32601, "message": "Not found"}})\n            res = self.tools[t]["handler"](req.get("params", {}).get("arguments", {}))\n            return json.dumps({"jsonrpc": "2.0", "id": rid, "result": {"content": [{"type": "text", "text": str(res)}]}})\n        return json.dumps({"jsonrpc": "2.0", "id": rid, "error": {"code": -32601, "message": "No method"}})\nserver = MCPServer()\nserver.register_tool("calculator", "desc", {}, lambda args: args.get("a", 0) + args.get("b", 0))'
      ],
      'lesson-4-3-1': [
        // Mutant 1: Scale factor computed with 128.0 instead of 127.0
        'def quantize_int8(weights):\n    flat = [abs(w) for row in weights for w in row] if isinstance(weights[0], list) else [abs(w) for w in weights]\n    max_val = max(flat)\n    scale = max_val / 128.0 if max_val != 0 else 1.0\n    def q_val(x): return max(-128, min(127, round(x / scale)))\n    quantized = [[q_val(x) for x in row] for row in weights] if isinstance(weights[0], list) else [q_val(x) for x in weights]\n    return quantized, scale\ndef dequantize_int8(quantized, scale):\n    return [[q * scale for q in row] for row in quantized] if isinstance(quantized[0], list) else [q * scale for q in quantized]\ndef compute_mse(o, r):\n    fo = [x for row in o for x in row] if isinstance(o[0], list) else o\n    fr = [x for row in r for x in row] if isinstance(r[0], list) else r\n    return sum((a - b)**2 for a, b in zip(fo, fr)) / len(fo)',
        // Mutant 2: Unsigned 8-bit scale factor (255.0) causing INT8 overflow
        'def quantize_int8(weights):\n    flat = [abs(w) for row in weights for w in row] if isinstance(weights[0], list) else [abs(w) for w in weights]\n    max_val = max(flat)\n    scale = max_val / 255.0 if max_val != 0 else 1.0\n    def q_val(x): return max(-128, min(127, round(x / scale)))\n    quantized = [[q_val(x) for x in row] for row in weights] if isinstance(weights[0], list) else [q_val(x) for x in weights]\n    return quantized, scale\ndef dequantize_int8(quantized, scale):\n    return [[q * scale for q in row] for row in quantized] if isinstance(quantized[0], list) else [q * scale for q in quantized]\ndef compute_mse(o, r):\n    fo = [x for row in o for x in row] if isinstance(o[0], list) else o\n    fr = [x for row in r for x in row] if isinstance(r[0], list) else r\n    return sum((a - b)**2 for a, b in zip(fo, fr)) / len(fo)',
        // Mutant 3: Dequantization divides by scale instead of multiplying
        'def quantize_int8(weights):\n    flat = [abs(w) for row in weights for w in row] if isinstance(weights[0], list) else [abs(w) for w in weights]\n    max_val = max(flat)\n    scale = max_val / 127.0 if max_val != 0 else 1.0\n    def q_val(x): return max(-128, min(127, round(x / scale)))\n    quantized = [[q_val(x) for x in row] for row in weights] if isinstance(weights[0], list) else [q_val(x) for x in weights]\n    return quantized, scale\ndef dequantize_int8(quantized, scale):\n    return [[q / scale for q in row] for row in quantized] if isinstance(quantized[0], list) else [q / scale for q in quantized]\ndef compute_mse(o, r):\n    fo = [x for row in o for x in row] if isinstance(o[0], list) else o\n    fr = [x for row in r for x in row] if isinstance(r[0], list) else r\n    return sum((a - b)**2 for a, b in zip(fo, fr)) / len(fo)'
      ],
      'lesson-4-3-2': [
        // Mutant 1: Inverted loss difference (rewarding losing response over winning)
        'import math\ndef sigmoid(x): return 1.0 / (1.0 + math.exp(-x)) if x >= 0 else math.exp(x) / (1.0 + math.exp(x))\ndef compute_dpo_loss(pi_w, pi_l, ref_w, ref_l, beta=0.1):\n    logits = beta * ((pi_l - ref_l) - (pi_w - ref_w))\n    return -math.log(max(sigmoid(logits), 1e-12)), logits',
        // Mutant 2: Missing beta hyperparameter scaling
        'import math\ndef sigmoid(x): return 1.0 / (1.0 + math.exp(-x)) if x >= 0 else math.exp(x) / (1.0 + math.exp(x))\ndef compute_dpo_loss(pi_w, pi_l, ref_w, ref_l, beta=0.1):\n    logits = (pi_w - ref_w) - (pi_l - ref_l)\n    return -math.log(max(sigmoid(logits), 1e-12)), logits',
        // Mutant 3: Returns scalar float instead of (loss, logits) 2-tuple
        'import math\ndef sigmoid(x): return 1.0 / (1.0 + math.exp(-x)) if x >= 0 else math.exp(x) / (1.0 + math.exp(x))\ndef compute_dpo_loss(pi_w, pi_l, ref_w, ref_l, beta=0.1):\n    logits = beta * ((pi_w - ref_w) - (pi_l - ref_l))\n    return -math.log(max(sigmoid(logits), 1e-12))'
      ],
      'lesson-4-3-3': [
        // Mutant 1: Agent does not increment kv_memory_tokens across reasoning steps
        'import json\nclass AutonomousReasoningEngine:\n    def __init__(self, agent_name="OpenGuide-Apex"): self.agent_name, self.kv_memory_tokens, self.tools, self.audit_log = agent_name, 0, {}, []\n    def register_mcp_tool(self, name, handler): self.tools[name] = handler\n    def execute_reasoning_cycle(self, goal):\n        self.audit_log.append(f"[GOAL] Initialized: {goal}")\n        for step in ["Step 1: Inspect", "Step 2: Dispatch MCP tool calculation", "Step 3: Verify"]:\n            self.audit_log.append(f"[THOUGHT] {step}")\n            if "tool calculation" in step and "calc" in self.tools:\n                out = self.tools["calc"]({"x": 21, "multiplier": 2})\n                self.audit_log.append(f"[MCP CALL] calc -> {out}")\n        certified = True\n        self.audit_log.append(f"[VERDICT] Certified: {certified}")\n        return {"agent": self.agent_name, "goal": goal, "certified": certified, "kv_tokens_consumed": 0, "log": self.audit_log}',
        // Mutant 2: Missing [GOAL] Initialized: log prefix
        'import json\nclass AutonomousReasoningEngine:\n    def __init__(self, agent_name="OpenGuide-Apex"): self.agent_name, self.kv_memory_tokens, self.tools, self.audit_log = agent_name, 0, {}, []\n    def register_mcp_tool(self, name, handler): self.tools[name] = handler\n    def execute_reasoning_cycle(self, goal):\n        self.audit_log.append(f"Starting Goal: {goal}")\n        for step in ["Step 1: Inspect", "Step 2: Dispatch MCP tool calculation", "Step 3: Verify"]:\n            self.audit_log.append(f"[THOUGHT] {step}")\n            if "tool calculation" in step and "calc" in self.tools:\n                out = self.tools["calc"]({"x": 21, "multiplier": 2})\n                self.audit_log.append(f"[MCP CALL] calc -> {out}")\n            self.kv_memory_tokens += 128\n        certified = True\n        self.audit_log.append(f"[VERDICT] Certified: {certified}")\n        return {"agent": self.agent_name, "goal": goal, "certified": certified, "kv_tokens_consumed": self.kv_memory_tokens, "log": self.audit_log}',
        // Mutant 3: Unconditional certification even when tools are missing
        'import json\nclass AutonomousReasoningEngine:\n    def __init__(self, agent_name="OpenGuide-Apex"): self.agent_name, self.kv_memory_tokens, self.tools, self.audit_log = agent_name, 0, {}, []\n    def register_mcp_tool(self, name, handler): self.tools[name] = handler\n    def execute_reasoning_cycle(self, goal):\n        self.audit_log.append(f"[GOAL] Initialized: {goal}")\n        for step in ["Step 1: Inspect", "Step 2: Dispatch MCP tool calculation", "Step 3: Verify"]:\n            self.audit_log.append(f"[THOUGHT] {step}")\n            if "tool calculation" in step and "calc" in self.tools:\n                out = self.tools["calc"]({"x": 21, "multiplier": 2})\n                self.audit_log.append(f"[MCP CALL] calc -> {out}")\n            self.kv_memory_tokens += 128\n        certified = True\n        self.audit_log.append(f"[VERDICT] Certified: {certified}")\n        return {"agent": self.agent_name, "goal": goal, "certified": True, "kv_tokens_consumed": self.kv_memory_tokens, "log": self.audit_log}'
      ]
    };

    let totalMutants = 0;
    let killedMutants = 0;
    const survivingMutants: string[] = [];

    track4.modules.forEach(mod => {
      mod.lessons.forEach(lesson => {
        const mutants = track4Mutants[lesson.id] || [];
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

    console.log(`\n=== MUTATION AUDIT BREAKDOWN (TRACK 4) ===`);
    console.log(`Total Mutants Tested: ${totalMutants}`);
    console.log(`Killed Mutants: ${killedMutants}`);
    console.log(`Kill Rate: ${((killedMutants / totalMutants) * 100).toFixed(1)}%`);

    expect(survivingMutants, `Track 4 mutants survived! Autograder failed to detect flawed code:\n${survivingMutants.join('\n\n')}`).toEqual([]);
    expect(totalMutants).toBe(27);
    expect(killedMutants).toBe(27);
  });

});


