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

});

