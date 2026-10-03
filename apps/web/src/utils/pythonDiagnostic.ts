export interface PythonDiagnostic {
  type: string;
  line?: number;
  friendlyExplanation: string;
  actionableTip: string;
}

export function diagnosePythonError(errorMessage: string, _code?: string): PythonDiagnostic | null {
  if (!errorMessage) return null;

  // IndentationError: unexpected indent / unindent does not match
  if (errorMessage.includes('IndentationError')) {
    const lineMatch = errorMessage.match(/line (\d+)/i);
    const line = lineMatch ? parseInt(lineMatch[1], 10) : undefined;
    return {
      type: 'Indentation Error',
      line,
      friendlyExplanation: 'Python structures code blocks using whitespace indentation instead of curly brackets.',
      actionableTip: 'Ensure lines inside your function, loop, or conditional statement are indented with exactly 4 spaces (or 1 tab).'
    };
  }

  // SyntaxError: invalid syntax / unclosed string
  if (errorMessage.includes('SyntaxError')) {
    const lineMatch = errorMessage.match(/line (\d+)/i);
    const line = lineMatch ? parseInt(lineMatch[1], 10) : undefined;
    const isUnclosedString = errorMessage.includes('unterminated string') || errorMessage.includes('EOL while scanning');
    return {
      type: 'Syntax Error',
      line,
      friendlyExplanation: isUnclosedString 
        ? 'A quotation mark was left open without a matching closing quotation mark.' 
        : "Python encountered characters it did not expect or a missing colon/parenthesis.",
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
      friendlyExplanation: `Python does not know what '${varName}' is yet.`,
      actionableTip: `Did you declare '${varName} = ...' earlier, or is there a small spelling / case mismatch?`
    };
  }

  // IndexError: list index out of range
  if (errorMessage.includes('IndexError')) {
    return {
      type: 'Index Error (Out of Bounds)',
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
      friendlyExplanation: `The dictionary does not contain the key ${key}.`,
      actionableTip: 'Check the exact dictionary keys or use dict.get(key, default) to safely handle missing keys.'
    };
  }

  // TypeError
  if (errorMessage.includes('TypeError')) {
    return {
      type: 'Type Mismatch Error',
      friendlyExplanation: 'An operation was attempted on incompatible data types (e.g. adding text to a number, or calling a non-function).',
      actionableTip: 'Check data types with type(x). Use str(x) to convert to text, or int(x) / float(x) to convert to numbers.'
    };
  }

  // ZeroDivisionError
  if (errorMessage.includes('ZeroDivisionError')) {
    return {
      type: 'Zero Division Error',
      friendlyExplanation: 'A mathematical division or modulo by zero was attempted.',
      actionableTip: 'Add an epsilon guard (e.g. denominator + 1e-8) or check if the divisor is 0 before dividing.'
    };
  }

  // AssertionError
  if (errorMessage.includes('AssertionError')) {
    const hint = errorMessage.split('AssertionError:')[1]?.trim();
    return {
      type: 'First Principles Verification Failed',
      friendlyExplanation: 'Your code compiled and executed, but the mathematical output did not satisfy the lab invariants.',
      actionableTip: hint || 'Compare your terminal output with the "Expected Console Target" card above.'
    };
  }

  return null;
}
