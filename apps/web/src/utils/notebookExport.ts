/**
 * notebookExport.ts - Official Jupyter Notebook (.ipynb) & Python (.py) Serializer
 * Exports interactive browser labs into official format conforming to nbformat 4.5.
 * Zero external dependencies.
 */

export function generateJupyterNotebook(
  title: string,
  markdownTheory: string,
  studentCode: string,
  testCode?: string
): string {
  const notebook = {
    cells: [
      {
        cell_type: 'markdown',
        metadata: {},
        source: [
          `# ${title}\n`,
          `*Exported from OpenGuide AI Studio (https://openguideforai.dpdns.org/)*\n\n`,
          ...markdownTheory.split('\n').map((line, idx, arr) => idx < arr.length - 1 ? `${line}\n` : line)
        ]
      },
      {
        cell_type: 'code',
        execution_count: null,
        metadata: {},
        outputs: [],
        source: studentCode.split('\n').map((line, idx, arr) => idx < arr.length - 1 ? `${line}\n` : line)
      }
    ],
    metadata: {
      language_info: {
        name: 'python',
        version: '3.12',
        mimetype: 'text/x-python',
        codemirror_mode: {
          name: 'ipython',
          version: 3
        },
        pygments_lexer: 'ipython3'
      },
      orig_nbformat: 4
    },
    nbformat: 4,
    nbformat_minor: 5
  };

  if (testCode) {
    notebook.cells.push({
      cell_type: 'code',
      execution_count: null,
      metadata: {},
      outputs: [],
      source: [
        "# ============================================================\n",
        "# Automated First Principles Test Verification\n",
        "# ============================================================\n",
        ...testCode.split('\n').map((line, idx, arr) => idx < arr.length - 1 ? `${line}\n` : line)
      ]
    });
  }

  return JSON.stringify(notebook, null, 2);
}

export function generatePythonScript(
  title: string,
  studentCode: string,
  testCode?: string
): string {
  const header = [
    `# ============================================================`,
    `# ${title}`,
    `# OpenGuide AI Studio — Local Proof of Work`,
    `# https://openguideforai.dpdns.org/`,
    `# ============================================================\n\n`
  ].join('\n');

  const testHarness = testCode
    ? `\n\n# ============================================================\n# Automated Test Verification\n# ============================================================\n${testCode}`
    : '';

  return `${header}${studentCode}${testHarness}\n`;
}

export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
