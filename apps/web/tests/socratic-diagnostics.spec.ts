import { test, expect } from '@playwright/test';
import { diagnosePythonError } from '../src/utils/pythonDiagnostic';

test.describe('Phase F0: Pedagogical Socratic Diagnostic Engine (Anti-Tautological Suite)', () => {

  test('01. catches missing return statement in function definitions (lesson-0-1-3)', () => {
    const code = `def compute_dot_product(a, b):\n    total = sum(x * y for x, y in zip(a, b))\n`;
    const diag = diagnosePythonError('AssertionError: expected 14, got None', code, 'lesson-0-1-3');
    expect(diag).not.toBeNull();
    expect(diag?.type).toBe('Socratic Architecture Lens: Missing Return Statement');
    expect(diag?.actionableTip).toContain('return <result>');
  });

  test('02. catches string and integer concatenation mismatch (lesson-0-1-1)', () => {
    const code = `count = 5\nmsg = "Tokens: " + count`;
    const diag = diagnosePythonError('TypeError: can only concatenate str (not "int") to str', code, 'lesson-0-1-1');
    expect(diag).not.toBeNull();
    expect(diag?.type).toBe('Type Mismatch: String & Number Concatenation');
    expect(diag?.actionableTip).toContain('str(val)');
  });

  test('03. catches list assignment out of bounds (lesson-0-1-2)', () => {
    const code = `items = []\nitems[0] = 42`;
    const diag = diagnosePythonError('IndexError: list assignment index out of range', code, 'lesson-0-1-2');
    expect(diag).not.toBeNull();
    expect(diag?.type).toBe('List Assignment Out of Bounds');
    expect(diag?.actionableTip).toContain('list.append');
  });

  test('04. Track 1: catches missing square root in vector magnitude/cosine similarity (lesson-1-1-2)', () => {
    const code = `def cosine_similarity(a, b):\n    dot = sum(x*y for x,y in zip(a,b))\n    norm_a = sum(x*x for x in a)\n    norm_b = sum(y*y for y in b)\n    return dot / (norm_a * norm_b)`;
    const diag = diagnosePythonError('AssertionError: cosine similarity of identical vectors must be 1.0', code, 'lesson-1-1-2');
    expect(diag).not.toBeNull();
    expect(diag?.type).toBe('Socratic Vector Lens: Missing Magnitude Square Root');
    expect(diag?.actionableTip).toContain('math.sqrt');
  });

  test('05. Track 1: catches zero division in vector normalization (lesson-1-1-2)', () => {
    const code = `def normalize(v):\n    mag = math.sqrt(sum(x*x for x in v))\n    return [x / mag for x in v]`;
    const diag = diagnosePythonError('ZeroDivisionError: float division by zero', code, 'lesson-1-1-2');
    expect(diag).not.toBeNull();
    expect(diag?.type).toBe('Socratic Vector Lens: Zero-Division Singularity');
    expect(diag?.actionableTip).toContain('1e-9');
  });

  test('06. Track 1: catches matrix dimension mismatch (lesson-1-2-1)', () => {
    const code = `def matmul(A, B):\n    return [[sum(A[i][k] * B[k][j] for k in range(len(A))) for j in range(len(B))] for i in range(len(A))]`;
    const diag = diagnosePythonError('IndexError: list index out of range', code, 'lesson-1-2-1');
    expect(diag).not.toBeNull();
    expect(diag?.type).toBe('Socratic Linear Algebra Lens: Matrix Dimension Invariant');
    expect(diag?.actionableTip).toContain('len(B[0])');
  });

  test('07. Track 2: catches sliding window stride <= 0 infinite loop trap (lesson-2-1-1)', () => {
    const code = `def chunk_text(text, chunk_size=100, overlap=100):\n    stride = chunk_size - overlap\n    chunks = []\n    for i in range(0, len(text), stride):\n        chunks.append(text[i:i+chunk_size])\n    return chunks`;
    const diag = diagnosePythonError('ValueError: range() arg 3 must not be zero', code, 'lesson-2-1-1');
    expect(diag).not.toBeNull();
    expect(diag?.type).toBe('Socratic RAG Lens: Sliding Window Stride Invariant');
    expect(diag?.actionableTip).toContain('max(1, stride)');
  });

  test('08. Track 2: catches untrusted input delimiter omission in prompt guardrails (lesson-2-1-2)', () => {
    const code = `def build_prompt(user_text):\n    return f"You are a helpful assistant. Process this: {user_text}"`;
    const diag = diagnosePythonError('AssertionError: prompt must wrap untrusted input in structural tags', code, 'lesson-2-1-2');
    expect(diag).not.toBeNull();
    expect(diag?.type).toBe('Socratic Prompt Lens: Untrusted Input Delimitation');
    expect(diag?.actionableTip).toContain('<untrusted_input>');
  });

  test('09. Track 2: catches missing JSON-RPC 2.0 error code -32601 (lesson-2-2-2)', () => {
    const code = `def dispatch(req):\n    return {"error": "unknown method"}`;
    const diag = diagnosePythonError('AssertionError: method not found must return error code -32601', code, 'lesson-2-2-2');
    expect(diag).not.toBeNull();
    expect(diag?.type).toBe('Socratic Tool Lens: JSON-RPC 2.0 Protocol Compliance');
    expect(diag?.actionableTip).toContain('-32601');
  });

  test('10. Track 3: catches raw string equality without .strip().lower() (lesson-3-1-2)', () => {
    const code = `def eval_exact_match(prediction, target):\n    return prediction == target`;
    const diag = diagnosePythonError('AssertionError: evaluation failed on whitespace variations', code, 'lesson-3-1-2');
    expect(diag).not.toBeNull();
    expect(diag?.type).toBe('Socratic Eval Lens: Normalization Pre-Processing');
    expect(diag?.actionableTip).toContain('.strip().lower()');
  });

  test('11. Track 3: catches missing regex boundary in PII scrubbing (lesson-3-2-2)', () => {
    const code = `def mask_pii(text):\n    return text.replace("email", "[REDACTED]")`;
    const diag = diagnosePythonError('AssertionError: failed to mask email addresses with regex', code, 'lesson-3-2-2');
    expect(diag).not.toBeNull();
    expect(diag?.type).toBe('Socratic Alignment Lens: Regex Pattern Boundary');
    expect(diag?.actionableTip).toContain('re.sub');
  });

  test('12. Track 4: catches missing key transpose (Q @ K^T) in attention (lesson-4-1-1)', () => {
    const code = `def scaled_dot_product_attention(Q, K, V):\n    scores = Q @ K\n    scores = scores / math.sqrt(64)\n    return softmax(scores) @ V`;
    const diag = diagnosePythonError('AssertionError: matrix dimensions incompatible without transposing K', code, 'lesson-4-1-1');
    expect(diag).not.toBeNull();
    expect(diag?.type).toBe('Socratic Transformer Lens: Key Matrix Transposition (Q @ K^T)');
    expect(diag?.actionableTip).toContain('Q @ K.T');
  });

  test('13. Track 4: catches missing sqrt(d_k) variance scaling in attention (lesson-4-1-1)', () => {
    const code = `def scaled_dot_product_attention(Q, K, V):\n    scores = Q @ matrix_transpose(K)\n    return softmax(scores) @ V`;
    const diag = diagnosePythonError('AssertionError: attention scores variance exploded without scaling', code, 'lesson-4-1-1');
    expect(diag).not.toBeNull();
    expect(diag?.type).toBe('Socratic Transformer Lens: Attention Variance Scaling (1 / sqrt(d_k))');
    expect(diag?.actionableTip).toContain('math.sqrt(d_k)');
  });

  test('14. Track 4: catches empty subspace decomposition in multi-head attention (lesson-4-1-2)', () => {
    const code = `def split_heads(X, num_heads):\n    return []\n\ndef concat_heads(heads):\n    return []`;
    const diag = diagnosePythonError('IndexError: list index out of range', code, 'lesson-4-1-2');
    expect(diag).not.toBeNull();
    expect(diag?.type).toBe('Socratic Transformer Lens: Empty Subspace Decomposition');
    expect(diag?.actionableTip).toContain('d_k = d_model // num_heads');
  });

  test('15. standard compiler syntax & indentation errors pass through cleanly', () => {
    const indentDiag = diagnosePythonError('IndentationError: unexpected indent', '', 'lesson-0-1-1');
    expect(indentDiag?.type).toBe('Indentation Error');

    const syntaxDiag = diagnosePythonError('SyntaxError: invalid syntax (line 4)', '', 'lesson-0-1-1');
    expect(syntaxDiag?.type).toBe('Syntax Error');
    expect(syntaxDiag?.line).toBe(4);
  });

  test('16. LIVE BROWSER: Starter code on lesson-4-1-2 triggers Socratic Subspace Decomposition card', async ({ page }) => {
    await page.goto('http://localhost:5173/track/4?module=0&lesson=1');
    await page.waitForLoadState('networkidle');

    // Click Run Code with starter code (split_heads returns [])
    const runBtn = page.locator('button[data-testid="run-code-button"]');
    await expect(runBtn).toBeVisible({ timeout: 15000 });
    await runBtn.click();

    // Verify Syntax Doctor card appears with exact Socratic card title
    const doctorCard = page.locator('[data-testid="syntax-doctor-card"]');
    await expect(doctorCard).toBeVisible({ timeout: 15000 });
    await expect(doctorCard).toContainText('Socratic Transformer Lens: Empty Subspace Decomposition');
    await expect(doctorCard).toContainText('d_k = d_model // num_heads');
  });
});
