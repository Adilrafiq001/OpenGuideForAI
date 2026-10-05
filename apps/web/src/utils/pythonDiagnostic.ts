export interface PythonDiagnostic {
  type: string;
  line?: number;
  friendlyExplanation: string;
  actionableTip: string;
}

function extractInnermostLineNumber(err: string): number | undefined {
  const allMatches = [...err.matchAll(/line (\d+)/gi)];
  if (allMatches.length > 0) {
    const lastMatch = allMatches[allMatches.length - 1];
    return parseInt(lastMatch[1], 10);
  }
  return undefined;
}

/**
 * Pedagogical Socratic Diagnostic Engine
 * 
 * Analyzes Python runtime tracebacks, compiler syntax errors, and student code patterns
 * to provide actionable mental models and first-principles debugging hints across Tracks 0-4.
 */
export function diagnosePythonError(errorMessage: string, code?: string, lessonId?: string): PythonDiagnostic | null {
  if (!errorMessage) return null;

  const normalizedCode = code || '';
  const innermostLine = extractInnermostLineNumber(errorMessage);

  // --------------------------------------------------------------------------
  // 1. AST / CODE-PATTERN PEDAGOGICAL TRAPS (Interception before generic traceback)
  // --------------------------------------------------------------------------

  // Trap: Function defined without explicit return value (defaults to None in Python)
  if (
    /def\s+\w+\s*\(/.test(normalizedCode) &&
    !/\breturn\s+[^\s#\n]/.test(normalizedCode) &&
    (errorMessage.includes('AssertionError') || errorMessage.includes("'NoneType' object"))
  ) {
    return {
      type: 'Socratic Architecture Lens: Missing Return Statement',
      line: innermostLine,
      friendlyExplanation: 'Python functions return None by default if no explicit return value is specified.',
      actionableTip: 'Ensure your function body ends with "return <result>" passing the computed object back to the caller.'
    };
  }

  // Trap: String and Integer concatenation mismatch
  if (
    errorMessage.includes('can only concatenate str (not "int") to str') ||
    errorMessage.includes("unsupported operand type(s) for +: 'int' and 'str'") ||
    errorMessage.includes("unsupported operand type(s) for +: 'str' and 'int'")
  ) {
    return {
      type: 'Type Mismatch: String & Number Concatenation',
      line: innermostLine,
      friendlyExplanation: 'Python is strongly typed and will not implicitly convert numbers to strings when using the + operator.',
      actionableTip: 'Explicitly convert the number to text using str(val) or format with an f-string: f"{prefix}{val}".'
    };
  }

  // Trap: List assignment index out of range
  if (errorMessage.includes('list assignment index out of range')) {
    return {
      type: 'List Assignment Out of Bounds',
      line: innermostLine,
      friendlyExplanation: 'You tried to assign to an index that does not exist yet (e.g. list[i] = val on an unallocated list).',
      actionableTip: 'Use list.append(val) to append items sequentially, or initialize the list with default elements: [0] * size.'
    };
  }

  // --------------------------------------------------------------------------
  // 2. DOMAIN-SPECIFIC CONCEPTUAL TRAPS (TRACKS 0 THROUGH 4)
  // --------------------------------------------------------------------------

  // TRACK 1: Vector Spaces & High-Dimensional Geometry
  if (lessonId?.startsWith('1.') || /vector|cosine|dot_product|euclidean/i.test(normalizedCode)) {
    // Missing square root in Euclidean norm / Cosine denominator
    if (
      (lessonId?.startsWith('1.1') || /cosine_similarity|vector_norm/i.test(normalizedCode)) &&
      !/math\.sqrt|\*\*\s*0\.5/.test(normalizedCode) &&
      (errorMessage.includes('AssertionError') || errorMessage.includes('ZeroDivisionError'))
    ) {
      return {
        type: 'Socratic Vector Lens: Missing Magnitude Square Root',
        line: innermostLine,
        friendlyExplanation: 'Euclidean vector magnitude ||v|| is the square root of the sum of squared components: sqrt(sum(x**2)).',
        actionableTip: 'Import math and apply math.sqrt(...) (or ** 0.5) to the sum of squared elements before computing cosine similarity.'
      };
    }

    // Zero-division in vector normalization
    if (errorMessage.includes('ZeroDivisionError')) {
      return {
        type: 'Socratic Vector Lens: Zero-Division Singularity',
        line: innermostLine,
        friendlyExplanation: 'Computing cosine similarity or normalizing an all-zero vector divides by a magnitude of 0.0.',
        actionableTip: 'Add an epsilon smoothing factor to the denominator: e.g. norm_a * norm_b + 1e-9.'
      };
    }

    // Matrix multiplication dimension mismatch
    if (
      (lessonId?.startsWith('1.2') || /matmul|matrix_multiply/i.test(normalizedCode)) &&
      (errorMessage.includes('IndexError') || errorMessage.includes('AssertionError')) &&
      !/len\(\w+\[0\]\)/.test(normalizedCode)
    ) {
      return {
        type: 'Socratic Linear Algebra Lens: Matrix Dimension Invariant',
        line: innermostLine,
        friendlyExplanation: 'Matrix multiplication (A @ B) requires the number of columns in A to match the number of rows in B.',
        actionableTip: 'Check your loop bounds: row iterations use len(A), column iterations use len(B[0]), and inner dot-product uses len(B).'
      };
    }

    // Uncentered PCA / Covariance
    if (
      (lessonId?.startsWith('1.3') || /pca|covariance/i.test(normalizedCode)) &&
      !/mean|avg/i.test(normalizedCode) &&
      errorMessage.includes('AssertionError')
    ) {
      return {
        type: 'Socratic Geometry Lens: Uncentered Covariance Matrix',
        line: innermostLine,
        friendlyExplanation: 'Covariance measures dispersion relative to the center of mass. Without subtracting feature means, covariance estimates are biased.',
        actionableTip: 'Compute the mean of each column and subtract it from data points before computing outer products.'
      };
    }
  }

  // TRACK 2: LLM Core & Tokenization / Retrieval
  if (lessonId?.startsWith('2.') || /token|bpe|sliding_window|prompt|jsonrpc/i.test(normalizedCode)) {
    // Sliding window stride <= 0
    if (
      (lessonId === '2.2.1' || /sliding_window|chunk_text/i.test(normalizedCode)) &&
      (errorMessage.includes('must not be zero') ||
       errorMessage.includes('AssertionError') ||
       /stride\s*=\s*0|stride\s*=\s*chunk_size\s*-\s*overlap|overlap\s*>=\s*chunk/i.test(normalizedCode))
    ) {
      if (
        errorMessage.includes('must not be zero') ||
        /stride\s*=\s*0/.test(normalizedCode) ||
        (normalizedCode.includes('overlap') && !/max\(1,/.test(normalizedCode))
      ) {
        return {
          type: 'Socratic RAG Lens: Sliding Window Stride Invariant',
          line: innermostLine,
          friendlyExplanation: 'A sliding window stride must be strictly greater than 0; otherwise the pointer never advances, causing an infinite loop.',
          actionableTip: 'Define stride = chunk_size - overlap, and enforce max(1, stride) so the pointer advances monotonically.'
        };
      }
    }

    // Untrusted input delimiters in prompts
    if (
      (lessonId === '2.2.2' || /sandbox_prompt|sanitize_prompt/i.test(normalizedCode)) &&
      !/<untrusted|<input|<user_data/i.test(normalizedCode) &&
      errorMessage.includes('AssertionError')
    ) {
      return {
        type: 'Socratic Prompt Lens: Untrusted Input Delimitation',
        line: innermostLine,
        friendlyExplanation: 'Robust prompt security requires wrapping user-supplied text in explicit structural tags (like <untrusted_input>...</untrusted_input>).',
        actionableTip: 'Wrap the user_input string inside structural XML/markdown delimiter tags (such as <untrusted_input>...</untrusted_input>) so the LLM distinguishes system instructions from user payload.'
      };
    }

    // JSON-RPC 2.0 error codes
    if (
      (lessonId === '2.3.1' || /jsonrpc|tool_call/i.test(normalizedCode)) &&
      (!normalizedCode.includes('-32601') || !normalizedCode.includes('2.0')) &&
      errorMessage.includes('AssertionError')
    ) {
      return {
        type: 'Socratic Tool Lens: JSON-RPC 2.0 Protocol Compliance',
        line: innermostLine,
        friendlyExplanation: 'JSON-RPC 2.0 requires exact protocol fields: "jsonrpc": "2.0", and error code -32601 specifically indicates "Method not found".',
        actionableTip: 'Ensure your error response dict includes {"jsonrpc": "2.0", "error": {"code": -32601, "message": "Method not found"}, "id": req_id}.'
      };
    }
  }

  // TRACK 3: Fine-Tuning, Alignment & Evaluation
  if (lessonId?.startsWith('3.') || /eval|pii|lora|scrub/i.test(normalizedCode)) {
    // Exact match normalization
    if (
      (lessonId === '3.1.2' || /exact_match|evaluate_qa/i.test(normalizedCode)) &&
      !/\.strip\(\)/.test(normalizedCode) &&
      errorMessage.includes('AssertionError')
    ) {
      return {
        type: 'Socratic Eval Lens: Normalization Pre-Processing',
        line: innermostLine,
        friendlyExplanation: 'Exact-match evaluation fails when strings have trailing whitespace, newlines, or case differences.',
        actionableTip: 'Apply prediction.strip().lower() == ground_truth.strip().lower() to ensure robust normalized string comparison.'
      };
    }

    // PII Masking / Regex boundary
    if (
      (lessonId === '3.2.1' || /mask_pii|scrub_pii/i.test(normalizedCode)) &&
      !/re\.sub/i.test(normalizedCode) &&
      errorMessage.includes('AssertionError')
    ) {
      return {
        type: 'Socratic Alignment Lens: Regex Pattern Boundary',
        line: innermostLine,
        friendlyExplanation: 'PII anonymization requires regular expression substitution using word boundaries to avoid partial word collisions.',
        actionableTip: 'Use re.sub(pattern, "[REDACTED]", text) with calibrated regex patterns for emails, SSNs, or credit card numbers.'
      };
    }

    // LoRA alpha / r scaling factor
    if (
      (lessonId === '3.3.1' || /lora|low_rank/i.test(normalizedCode)) &&
      !/alpha\s*\/\s*r|alpha\s*\/\s*rank|scaling/i.test(normalizedCode) &&
      errorMessage.includes('AssertionError')
    ) {
      return {
        type: 'Socratic Fine-Tuning Lens: LoRA Scaling Factor (alpha / r)',
        line: innermostLine,
        friendlyExplanation: 'In LoRA, the adapter delta (B @ A) is scaled by a constant factor of (alpha / r) to maintain activation variance across rank changes.',
        actionableTip: 'Multiply the low-rank delta by (self.lora_alpha / self.r) before adding it to the frozen base weight projection: W_base + (alpha / r) * (B @ A).'
      };
    }
  }

  // TRACK 4: Transformer Architecture from Scratch
  if (lessonId?.startsWith('4.') || /attention|causal_mask|transformer|multi_head/i.test(normalizedCode)) {
    // Key matrix transposition (Q @ K^T)
    if (
      (lessonId === '4.1.2' || /scaled_dot_product_attention|attention/i.test(normalizedCode)) &&
      !/\.T|transpose|permute|T\b/.test(normalizedCode) &&
      errorMessage.includes('AssertionError')
    ) {
      return {
        type: 'Socratic Transformer Lens: Key Matrix Transposition (Q @ K^T)',
        line: innermostLine,
        friendlyExplanation: 'Attention computes alignment between queries of shape (seq_len, d_k) and keys of shape (seq_len, d_k). You must transpose K to shape (d_k, seq_len) to compute Q @ K^T.',
        actionableTip: 'Transpose the K matrix (or transpose its last two dimensions) before multiplying with Q: scores = Q @ K.T.'
      };
    }

    // Missing sqrt(d_k) scaling
    if (
      (lessonId === '4.1.2' || /scaled_dot_product_attention|attention/i.test(normalizedCode)) &&
      !/sqrt|d_k\s*\*\*\s*0\.5/.test(normalizedCode) &&
      errorMessage.includes('AssertionError')
    ) {
      return {
        type: 'Socratic Transformer Lens: Attention Variance Scaling (1 / sqrt(d_k))',
        line: innermostLine,
        friendlyExplanation: 'Without scaling by sqrt(d_k), large embedding dimensions cause dot product magnitudes to grow exponentially, driving softmax into regions with vanishing gradients.',
        actionableTip: 'Divide the dot product scores by math.sqrt(d_k) before taking the softmax.'
      };
    }

    // Causal masking with 0 instead of -inf
    if (
      (lessonId === '4.1.3' || /causal_mask|mask/i.test(normalizedCode)) &&
      !/-1e9|-inf|float\('-inf'\)/i.test(normalizedCode) &&
      errorMessage.includes('AssertionError')
    ) {
      return {
        type: 'Socratic Transformer Lens: Causal Masking Invariant (-inf vs 0)',
        line: innermostLine,
        friendlyExplanation: 'Setting masked attention logits to 0 does not prevent attention: softmax(0) produces a positive non-zero probability (e^0 = 1).',
        actionableTip: 'Set upper-triangular masked positions to -1e9 or float("-inf") so that softmax(logit) produces exactly 0.0 probability for future tokens.'
      };
    }

    // Multi-head attention splitting
    if (
      (lessonId === '4.2.1' || /multi_head|mha/i.test(normalizedCode)) &&
      !/d_model\s*\/\/\s*num_heads|head_dim/i.test(normalizedCode) &&
      errorMessage.includes('AssertionError')
    ) {
      return {
        type: 'Socratic Transformer Lens: Multi-Head Projection Invariant',
        line: innermostLine,
        friendlyExplanation: 'Multi-Head Attention projects d_model into num_heads subspaces of dimension d_k = d_model // num_heads.',
        actionableTip: 'Ensure head_dim = d_model // num_heads and assert that num_heads * head_dim == d_model.'
      };
    }
  }

  // --------------------------------------------------------------------------
  // 3. CORE PYTHON COMPILER & RUNTIME EXCEPTIONS
  // --------------------------------------------------------------------------

  // IndentationError: unexpected indent / unindent does not match
  if (errorMessage.includes('IndentationError')) {
    return {
      type: 'Indentation Error',
      line: innermostLine,
      friendlyExplanation: 'Python structures code blocks using whitespace indentation instead of curly brackets.',
      actionableTip: 'Ensure lines inside your function, loop, or conditional statement are indented with exactly 4 spaces (or 1 tab).'
    };
  }

  // SyntaxError: invalid syntax / unclosed string
  if (errorMessage.includes('SyntaxError')) {
    const isUnclosedString = errorMessage.includes('unterminated string') || errorMessage.includes('EOL while scanning');
    return {
      type: 'Syntax Error',
      line: innermostLine,
      friendlyExplanation: isUnclosedString 
        ? 'A quotation mark was left open without a matching closing quotation mark.' 
        : 'Python encountered characters it did not expect or a missing colon/parenthesis.',
      actionableTip: isUnclosedString
        ? 'Check for unmatched single (\') or double (") quotes on this line.'
        : 'Verify that every opening parenthesis "(" has a matching ")", and that lines starting with def, if, for, or while end with a colon (:).'
    };
  }

  // NameError: name 'x' is not defined
  if (errorMessage.includes('NameError')) {
    const nameMatch = errorMessage.match(/name '(\w+)' is not defined/);
    const varName = nameMatch ? nameMatch[1] : 'variable';
    return {
      type: 'Name Error (Undefined Identifier)',
      line: innermostLine,
      friendlyExplanation: `Python does not know what '${varName}' is yet.`,
      actionableTip: `Did you declare '${varName} = ...' earlier, or is there a small spelling / case mismatch?`
    };
  }

  // IndexError: list index out of range
  if (errorMessage.includes('IndexError')) {
    return {
      type: 'Index Error (Out of Bounds)',
      line: innermostLine,
      friendlyExplanation: 'You asked Python for an item at a list position that does not exist.',
      actionableTip: 'Remember Python lists use 0-based indexing. For a list of 3 items, valid indices are 0, 1, and 2. Use len(my_list) to check size.'
    };
  }

  // KeyError: key not found in dictionary
  if (errorMessage.includes('KeyError')) {
    const keyMatch = errorMessage.match(/KeyError:\s*(.+)/);
    const key = keyMatch ? keyMatch[1] : 'key';
    return {
      type: 'Dictionary Key Error',
      line: innermostLine,
      friendlyExplanation: `The dictionary does not contain the key ${key}.`,
      actionableTip: 'Check the exact dictionary keys or use dict.get(key, default) to safely handle missing keys.'
    };
  }

  // TypeError
  if (errorMessage.includes('TypeError')) {
    return {
      type: 'Type Mismatch Error',
      line: innermostLine,
      friendlyExplanation: 'An operation was attempted on incompatible data types (e.g. adding text to a number, or calling a non-function).',
      actionableTip: 'Check data types with type(x). Use str(x) to convert to text, or int(x) / float(x) to convert to numbers.'
    };
  }

  // ZeroDivisionError
  if (errorMessage.includes('ZeroDivisionError')) {
    return {
      type: 'Zero Division Error',
      line: innermostLine,
      friendlyExplanation: 'A mathematical division or modulo by zero was attempted.',
      actionableTip: 'Add an epsilon guard (e.g. denominator + 1e-8) or check if the divisor is 0 before dividing.'
    };
  }

  // AssertionError (Autograder / Invariant Check Failed)
  if (errorMessage.includes('AssertionError')) {
    const hint = errorMessage.split('AssertionError:')[1]?.trim();
    return {
      type: 'First Principles Verification Failed',
      line: innermostLine,
      friendlyExplanation: 'Your code compiled and executed, but the mathematical output did not satisfy the lab invariants.',
      actionableTip: hint || 'Compare your terminal output with the "Expected Console Target" card above.'
    };
  }

  return null;
}
