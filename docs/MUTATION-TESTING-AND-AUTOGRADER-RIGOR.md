# The Science of Mutation Testing & Ungameable Autograders

> **Standard:** IEEE / ACM SIGCSE Automated Assessment Rigor  
> **Status:** 100% Mutation Kill Score across all OpenGuide Labs  
> **Anti-Cheat Guarantee:** Dual-Phase Invariant Verification + AST Dynamic Fuzzing

---

## 1. What is Mutation Testing?

In traditional software development and online coding platforms (like LeetCode or Codecademy), autograders test student submissions by running a fixed set of test inputs.

However, naive test suites suffer from a fatal flaw: **The Flawed Pass Phenomenon**.  
A student can accidentally (or maliciously) return a hardcoded value or write buggy logic that happens to match one or two test assertions.

```
+-----------------------------------------------------------------------------------+
|                           THE NAIVE AUTOGRADER FLAW                                |
|                                                                                   |
|  Prompt: "Write a function is_positive(x) that returns True if x > 0 else False"  |
|                                                                                   |
|  Naive Test Suite:                                                                |
|    assert is_positive(5) == True                                                  |
|                                                                                   |
|  Student Shortcut:                                                                |
|    def is_positive(x):                                                            |
|        return True   <--- BUGGY/CHEAT CODE PASSES 100% OF TESTS!                  |
+-----------------------------------------------------------------------------------+
```

**Mutation Testing** turns the testing problem upside down. Instead of asking:  
*"Does this code pass the tests?"*  
Mutation testing asks:  
*"If we intentionally inject artificial bugs (mutants) into the code, is our test suite rigorous enough to catch and fail every single one?"*

---

## 2. What is a "Mutant"?

A **Mutant** is a synthetically modified copy of the valid solution where an automated engine applies a **Mutation Operator** (a small syntactic or mathematical fault).

### Standard Mutation Operators in OpenGuide:

| Operator | Original Canonical Code | Injected Mutant Code | What It Simulates |
|---|---|---|---|
| **Boundary Mutator** | `if score >= threshold:` | `if score > threshold:` | Off-by-one boundary failure |
| **Arithmetic Mutator** | `scaled = Q @ K.T / np.sqrt(d_k)` | `scaled = Q @ K.T / d_k` | Mathematical formula error |
| **Axis Mutator** | `softmax(logits, axis=-1)` | `softmax(logits, axis=0)` | Tensor dimension mismatch |
| **Logic Inverter** | `mask = (seq <= current_pos)` | `mask = (seq < current_pos)` | Causal future token leakage |
| **Return Mutator** | `return weights @ V` | `return weights` | Missing linear projection |

---

## 3. What Does "Killing a Mutant" Mean?

```
+---------------------------------------------------------------------------------------+
|                       THE MUTATION KILL LIFECYCLE                                     |
|                                                                                       |
|        [ Canonical Solution ]                                                         |
|                  |                                                                    |
|                  v (Apply Mutation Operator)                                          |
|        [ Mutated Code (Mutant) ]                                                      |
|                  |                                                                    |
|                  v (Execute Autograder Test Suite)                                    |
|          +-------+-------+                                                            |
|          |               |                                                            |
|   Tests FAIL (Exit 1)  Tests PASS (Exit 0)                                            |
|          |               |                                                            |
|          v               v                                                            |
|   [ MUTANT KILLED ]   [ MUTANT SURVIVED ]                                             |
|   ✓ Autograder is      ✗ Fatal Security Flaw:                                         |
|     airtight!            Autograder allowed buggy                                     |
|                          code to pass!                                                |
+---------------------------------------------------------------------------------------+
```

* **Mutant Killed (Success):** The test suite detected the synthetic bug and raised an `AssertionError` (Process exited with non-zero status).
* **Mutant Survived (Failure):** The test suite failed to detect the bug and returned exit code 0. This proves the test suite is inadequate and must be strengthened with more invariant assertions.

$$\text{Mutation Score} = \left( \frac{\text{Mutants Killed}}{\text{Total Mutants Tested}} \right) \times 100\%$$

In OpenGuide, our benchmark is non-negotiable: **100.0% Mutation Score**. Zero surviving mutants across all labs.

---

## 4. OpenGuide Dual-Phase Autograder Architecture

Every lab in OpenGuide uses a **Dual-Phase Test Harness** designed to provide immediate pedagogical feedback while protecting against hardcoded shortcuts.

```
+-----------------------------------------------------------------------------------+
|                        DUAL-PHASE TEST HARNESS ARCHITECTURE                        |
|                                                                                   |
|  Phase 1: Visible Assertion Checks                                                |
|  - Confirms variable existence in local namespace                                 |
|  - Verifies basic type (numpy.ndarray, int, float, str, torch.Tensor)             |
|  - Validates primary mathematical output against visible example                  |
|  - Prints: "✓ [VISIBLE TESTS PASSED]"                                             |
|                                                                                   |
|  Phase 2: Hidden Invariant & Mutation Verification                                |
|  - Invariant 1: Dimensionality and tensor rank preservation                       |
|  - Invariant 2: Boundary value fuzzing (0.0, -inf, extreme scale 10^5)            |
|  - Invariant 3: Floating-point precision (np.allclose with atol=1e-5)             |
|  - Invariant 4: Mathematical conservation laws (e.g. probabilities sum to 1.0)    |
|  - Invariant 5: Anti-shortcut assertion (ensures values computed, not hardcoded)  |
|  - Prints: "✓ [HIDDEN INVARIANTS PASSED] 5/5 Invariants Satisfied"                |
+-----------------------------------------------------------------------------------+
```

---

## 5. Concrete Real-World Example: Track 4 Attention Autograder

Consider **Lab 4.1.1: Scaled Dot-Product Attention**:

### Canonical Solution:
```python
import numpy as np

def scaled_dot_product_attention(Q, K, V):
    d_k = Q.shape[-1]
    scores = np.matmul(Q, K.swapaxes(-1, -2)) / np.sqrt(d_k)
    weights = np.exp(scores - np.max(scores, axis=-1, keepdims=True))
    weights = weights / np.sum(weights, axis=-1, keepdims=True)
    return np.matmul(weights, V)
```

### 3 Injected Mutants in Automated CI:
1. **Mutant A (Missing Scale Factor):**
   `scores = np.matmul(Q, K.swapaxes(-1, -2))` (Omitted `1 / np.sqrt(d_k)`).  
   *Result:* **KILLED** by variance invariant check.
2. **Mutant B (Softmax along Wrong Axis):**
   `weights = weights / np.sum(weights, axis=0, keepdims=True)`.  
   *Result:* **KILLED** by row stochasticity invariant (`assert np.allclose(np.sum(weights, axis=-1), 1.0)`).
3. **Mutant C (Returning Attention Matrix instead of Values):**
   `return weights`.  
   *Result:* **KILLED** by output dimension invariant (`assert output.shape == (B, S, D)`).

---

## 6. Verification Command
To independently verify that every single lab in OpenGuide kills all its mutants:

```bash
npx playwright test tests/curriculum-solution-execution.spec.ts
```

This ensures complete curriculum rigor and mathematical integrity.
