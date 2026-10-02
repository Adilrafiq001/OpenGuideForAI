import React, { useEffect, useRef } from 'react';
import { EditorState } from '@codemirror/state';
import { 
  EditorView, 
  keymap, 
  lineNumbers, 
  highlightActiveLineGutter, 
  highlightSpecialChars, 
  drawSelection, 
  dropCursor, 
  rectangularSelection, 
  crosshairCursor, 
  highlightActiveLine 
} from '@codemirror/view';
import { 
  defaultKeymap, 
  history, 
  historyKeymap, 
  indentWithTab 
} from '@codemirror/commands';
import { 
  indentOnInput, 
  syntaxHighlighting, 
  defaultHighlightStyle, 
  bracketMatching 
} from '@codemirror/language';
import { python } from '@codemirror/lang-python';
import { closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete';
import { useSettingsStore } from '../store/useSettingsStore';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  fontSize?: number;
  wordWrap?: boolean;
  readOnly?: boolean;
  className?: string;
  showAccessoryBar?: boolean;
}

const ACCESSORY_KEYS = [
  { label: 'Tab', insert: '    ', title: '4 spaces indentation' },
  { label: ':', insert: ':', title: 'Colon' },
  { label: '(', insert: '()', title: 'Parentheses' },
  { label: ')', insert: ')', title: 'Close parenthesis' },
  { label: '[', insert: '[]', title: 'Square brackets' },
  { label: ']', insert: ']', title: 'Close bracket' },
  { label: '{', insert: '{}', title: 'Curly braces' },
  { label: '}', insert: '}', title: 'Close brace' },
  { label: '=', insert: ' = ', title: 'Assignment operator' },
  { label: '_', insert: '_', title: 'Underscore' },
  { label: '#', insert: '# ', title: 'Comment' },
  { label: '"', insert: '""', title: 'Double quotes' },
  { label: "'", insert: "''", title: 'Single quotes' },
  { label: '.', insert: '.', title: 'Dot' },
  { label: ',', insert: ', ', title: 'Comma' },
  { label: '+', insert: ' + ', title: 'Plus' },
  { label: '-', insert: ' - ', title: 'Minus' },
  { label: '*', insert: ' * ', title: 'Multiply' },
  { label: 'def', insert: 'def ', title: 'Function def' },
  { label: 'return', insert: 'return ', title: 'Return' },
  { label: 'assert', insert: 'assert ', title: 'Assertion' },
];

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  fontSize = 13,
  wordWrap = false,
  readOnly = false,
  className = '',
  showAccessoryBar = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const insertText = (textToInsert: string) => {
    const view = viewRef.current;
    if (!view) return;
    const { from, to } = view.state.selection.main;
    view.dispatch({
      changes: { from, to, insert: textToInsert },
      selection: { 
        anchor: textToInsert.endsWith(')') || textToInsert.endsWith(']') || textToInsert.endsWith('}') || textToInsert === '""' || textToInsert === "''"
          ? from + Math.floor(textToInsert.length / 2)
          : from + textToInsert.length 
      },
      scrollIntoView: true
    });
    view.focus();
  };

  // Track the latest value internally to avoid feedback loops
  const latestValueRef = useRef(value);
  latestValueRef.current = value;
  const { 
    editorFont, 
    fontSize: storeFontSize, 
    wordWrap: storeWordWrap, 
    lineNumbers: storeLineNumbers, 
    tabSize: storeTabSize,
    bracketPairs: storeBracketPairs
  } = useSettingsStore();

  const effectiveFontSize = fontSize || storeFontSize || 14;
  const effectiveWordWrap = wordWrap ?? storeWordWrap ?? true;
  const effectiveTabSize = storeTabSize || 4;

  useEffect(() => {
    if (!containerRef.current) return;

    // OpenGuide Dynamic Theme Integration: binds directly to CSS variables
    const openGuideTheme = EditorView.theme({
      '&': {
        height: '100%',
        backgroundColor: 'transparent',
        color: 'var(--color-text-primary)',
        fontFamily: 'var(--font-code-mono, "JetBrains Mono", monospace) !important',
        fontSize: `${effectiveFontSize}px`
      },
      '.cm-scroller': {
        overflow: 'auto',
        fontFamily: 'inherit !important',
        lineHeight: '1.6'
      },
      '.cm-content, .cm-gutter, .cm-line': {
        fontFamily: 'inherit !important'
      },
      '.cm-content': {
        padding: '12px 0',
        caretColor: 'var(--color-accent)'
      },
      '.cm-cursor, .cm-dropCursor': {
        borderLeftColor: 'var(--color-accent)',
        borderLeftWidth: '2px'
      },
      '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
        backgroundColor: 'var(--color-accent-trans) !important'
      },
      '.cm-gutters': {
        backgroundColor: 'transparent',
        color: 'var(--color-text-secondary)',
        borderRight: '1px solid var(--color-border)',
        paddingRight: '8px',
        paddingLeft: '4px'
      },
      '.cm-activeLineGutter': {
        backgroundColor: 'var(--color-accent-trans)',
        color: 'var(--color-accent)',
        fontWeight: 'bold'
      },
      '.cm-activeLine': {
        backgroundColor: 'var(--color-accent-trans)'
      },
      '.cm-line': {
        paddingLeft: '12px',
        paddingRight: '12px'
      },
      '.cm-matchingBracket': {
        backgroundColor: 'var(--color-accent-trans)',
        color: 'var(--color-accent)',
        outline: '1px solid var(--color-accent)'
      }
    });

    const extensions = [
      ...(storeLineNumbers !== 'off' ? [lineNumbers()] : []),
      EditorState.tabSize.of(effectiveTabSize),
      highlightActiveLineGutter(),
      highlightSpecialChars(),
      history(),
      drawSelection(),
      dropCursor(),
      EditorState.allowMultipleSelections.of(true),
      indentOnInput(),
      syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
      ...(storeBracketPairs ? [bracketMatching(), closeBrackets()] : []),
      rectangularSelection(),
      crosshairCursor(),
      highlightActiveLine(),
      python(),
      openGuideTheme,
      keymap.of([
        indentWithTab,
        ...closeBracketsKeymap,
        ...defaultKeymap,
        ...historyKeymap
      ]),
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          const docString = update.state.doc.toString();
          if (docString !== latestValueRef.current) {
            latestValueRef.current = docString;
            onChangeRef.current(docString);
          }
        }
      })
    ];

    if (effectiveWordWrap) {
      extensions.push(EditorView.lineWrapping);
    }

    if (readOnly) {
      extensions.push(EditorState.readOnly.of(true));
    }

    const state = EditorState.create({
      doc: value,
      extensions
    });

    const view = new EditorView({
      state,
      parent: containerRef.current
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, [effectiveFontSize, editorFont, effectiveWordWrap, readOnly, storeLineNumbers, effectiveTabSize, storeBracketPairs]);

  // Synchronize document if value changes externally (e.g. reset or canonical solution insert)
  useEffect(() => {
    const view = viewRef.current;
    if (view && value !== view.state.doc.toString()) {
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: value }
      });
    }
  }, [value]);

  return (
    <div className={`h-full w-full flex flex-col overflow-hidden ${className}`}>
      {/* Mobile / Touchscreen Virtual Accessory Bar for CodeMirror */}
      {showAccessoryBar && (
        <div 
          data-testid="codemirror-accessory-bar"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-secondary)]/95 border-b border-[var(--color-border)] overflow-x-auto no-scrollbar shrink-0 select-none z-10 touch-pan-x"
          aria-label="Python Virtual Accessory Keyboard Bar"
        >
          <span className="text-[10px] font-mono text-[var(--color-text-secondary)] opacity-60 uppercase tracking-wider shrink-0 mr-1 hidden sm:inline">
            Quick Keys:
          </span>
          {ACCESSORY_KEYS.map((k) => (
            <button
              key={k.label}
              type="button"
              onClick={() => insertText(k.insert)}
              title={k.title}
              className="px-2.5 py-1 rounded-md bg-[var(--color-primary)] hover:bg-[var(--color-accent-trans)] hover:text-[var(--color-accent)] active:bg-[var(--color-accent)] active:text-black border border-[var(--color-border)] text-xs font-mono text-[var(--color-text-primary)] cursor-pointer active:scale-95 transition-all whitespace-nowrap shadow-sm min-h-[34px] min-w-[32px] flex items-center justify-center shrink-0"
            >
              {k.label}
            </button>
          ))}
        </div>
      )}

      {/* CodeMirror 6 Container */}
      <div 
        ref={containerRef} 
        className="flex-1 w-full overflow-hidden custom-scrollbar"
        data-testid="codemirror-editor"
      />

      {/* Screen Reader ARIA Live Region for Diagnostics */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        data-testid="codemirror-a11y-live-region"
      >
        Python CodeMirror Editor active. Press Control Enter to execute Python in WebAssembly worker.
      </div>
    </div>
  );
};
