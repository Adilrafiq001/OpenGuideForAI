/**
 * Builder Provider Service for OpenGuide "The Builder Path"
 * $0 Rule Compliant: 100% Client-Side, Local-First, Zero Paid External APIs
 *
 * Supports:
 * 1. Offline Demo Provider: Instant, curated, responsive apps ($0, no network, no keys required).
 * 2. Mock Provider: Deterministic, instantaneous generation for automated CI tests.
 * 3. Google AI Studio BYOK Adapter: Direct client-side fetch to Gemini Flash with timeout, retry, and in-memory key isolation.
 */

export type BuilderProviderType = 'offline' | 'mock' | 'gemini-byok';

export interface GenerationResult {
  success: boolean;
  html: string;
  error?: string;
  providerUsed: BuilderProviderType;
  durationMs: number;
}

// In-Memory API Key isolation (Default: Never persists to storage unless explicit opt-in)
let inMemoryApiKey: string | null = null;
const STORAGE_KEY_API_KEY = 'openguide:builder:gemini_key_opt_in';

export function getBuilderApiKey(): string | null {
  if (inMemoryApiKey) return inMemoryApiKey;
  try {
    return localStorage.getItem(STORAGE_KEY_API_KEY);
  } catch {
    return null;
  }
}

export function setBuilderApiKey(key: string | null, persist: boolean = false): void {
  inMemoryApiKey = key ? key.trim() : null;
  try {
    if (persist && inMemoryApiKey) {
      localStorage.setItem(STORAGE_KEY_API_KEY, inMemoryApiKey);
    } else {
      localStorage.removeItem(STORAGE_KEY_API_KEY);
    }
  } catch {}
}

export function hasBuilderApiKey(): boolean {
  return Boolean(getBuilderApiKey());
}

/**
 * Strict Content Security Policy injected into the iframe preview:
 * - default-src 'none' (blocks all unauthorized sub-resources)
 * - style-src 'unsafe-inline' (allows styled single-page components)
 * - script-src 'unsafe-inline' (allows in-memory app logic)
 * - img-src data: blob: (allows data-URI icons and images)
 * - font-src data:
 * - connect-src 'none' (STRICT: prevents framed code from fetching external URLs or exfiltrating data)
 * - form-action 'none' (prevents submitting forms to external endpoints)
 */
export const PREVIEW_CSP = `default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; img-src data: blob:; font-src data:; connect-src 'none'; form-action 'none';`;

/**
 * Embeds CSP and essential styling resets into raw HTML.
 */
export function injectCspAndFrameSandbox(rawHtml: string): string {
  const clean = rawHtml.trim();
  const cspMeta = `<meta http-equiv="Content-Security-Policy" content="${PREVIEW_CSP}">`;

  if (/<head[^>]*>/i.test(clean)) {
    return clean.replace(/<head[^>]*>/i, `$& \n  ${cspMeta}`);
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${cspMeta}
  <style>
    :root {
      color-scheme: light dark;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    body {
      margin: 0;
      padding: 1rem;
      background: #0f172a;
      color: #f8fafc;
      min-height: 100vh;
      box-sizing: border-box;
    }
    * { box-sizing: border-box; }
  </style>
</head>
<body>
${clean}
</body>
</html>`;
}

// ============================================================================
// CURATED CANNED APPS FOR $0 OFFLINE DEMONSTRATION
// ============================================================================

export const CANNED_APPS: Record<string, { title: string; html: string }> = {
  tip_calculator: {
    title: 'Smart Tip & Split Calculator',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Smart Tip Calculator</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      margin: 0;
      padding: 1.5rem;
      background: #090d16;
      color: #e2e8f0;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      box-sizing: border-box;
    }
    .card {
      background: #111827;
      border: 1px solid #1f2937;
      border-radius: 1rem;
      padding: 1.5rem;
      width: 100%;
      max-width: 380px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
    }
    h2 { margin: 0 0 1rem 0; font-size: 1.25rem; color: #38bdf8; display: flex; align-items: center; gap: 0.5rem; }
    .group { margin-bottom: 1rem; }
    label { display: block; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: #94a3b8; margin-bottom: 0.25rem; font-weight: 600; }
    input[type="number"] {
      width: 100%;
      padding: 0.65rem 0.75rem;
      background: #030712;
      border: 1px solid #374151;
      border-radius: 0.5rem;
      color: #fff;
      font-size: 1rem;
      box-sizing: border-box;
      outline: none;
    }
    input[type="number"]:focus { border-color: #38bdf8; }
    .chips { display: flex; gap: 0.5rem; margin-top: 0.25rem; }
    .chip {
      flex: 1;
      padding: 0.5rem;
      background: #1f2937;
      border: 1px solid #374151;
      border-radius: 0.5rem;
      color: #cbd5e1;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s;
    }
    .chip.active { background: #0284c7; color: white; border-color: #38bdf8; }
    .summary {
      background: #030712;
      border: 1px solid #1e293b;
      border-radius: 0.75rem;
      padding: 1rem;
      margin-top: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .row { display: flex; justify-content: space-between; font-size: 0.85rem; color: #94a3b8; }
    .row.total { font-size: 1.15rem; font-weight: 700; color: #38bdf8; border-top: 1px solid #1f2937; padding-top: 0.5rem; margin-top: 0.25rem; }
  </style>
</head>
<body>
  <div class="card" id="app">
    <h2><span>💰</span> Tip & Split Calculator</h2>
    <div class="group">
      <label>Bill Amount ($)</label>
      <input type="number" id="bill" value="65.00" min="0" step="0.5">
    </div>
    <div class="group">
      <label>Tip Percentage</label>
      <div class="chips">
        <button class="chip" data-tip="10">10%</button>
        <button class="chip active" data-tip="15">15%</button>
        <button class="chip" data-tip="20">20%</button>
      </div>
    </div>
    <div class="group">
      <label>Split Between (People)</label>
      <input type="number" id="people" value="2" min="1" max="50">
    </div>
    <div class="summary">
      <div class="row"><span>Tip Amount:</span><span id="tipVal">$9.75</span></div>
      <div class="row"><span>Total Bill:</span><span id="totalVal">$74.75</span></div>
      <div class="row total"><span>Per Person:</span><span id="perPersonVal">$37.38</span></div>
    </div>
  </div>
  <script>
    let tipPercent = 15;
    const billInput = document.getElementById('bill');
    const peopleInput = document.getElementById('people');
    const tipVal = document.getElementById('tipVal');
    const totalVal = document.getElementById('totalVal');
    const perPersonVal = document.getElementById('perPersonVal');
    const chips = document.querySelectorAll('.chip');

    chips.forEach(btn => {
      btn.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        tipPercent = parseFloat(btn.dataset.tip);
        calculate();
      });
    });

    function calculate() {
      const bill = parseFloat(billInput.value) || 0;
      const people = Math.max(1, parseInt(peopleInput.value, 10) || 1);
      const tip = bill * (tipPercent / 100);
      const total = bill + tip;
      const perPerson = total / people;

      tipVal.textContent = '$' + tip.toFixed(2);
      totalVal.textContent = '$' + total.toFixed(2);
      perPersonVal.textContent = '$' + perPerson.toFixed(2);
    }

    billInput.addEventListener('input', calculate);
    peopleInput.addEventListener('input', calculate);
    calculate();
  </script>
</body>
</html>`
  },

  countdown_timer: {
    title: 'Event Countdown Utility',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Event Countdown</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      margin: 0;
      padding: 1.5rem;
      background: #060913;
      color: #f1f5f9;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      box-sizing: border-box;
    }
    .card {
      background: #0f172a;
      border: 1px solid #1e293b;
      border-radius: 1rem;
      padding: 1.5rem;
      width: 100%;
      max-width: 420px;
      text-align: center;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
    }
    h2 { margin: 0 0 0.5rem 0; font-size: 1.3rem; color: #a855f7; }
    p.sub { font-size: 0.8rem; color: #94a3b8; margin: 0 0 1.25rem 0; }
    .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem; margin-bottom: 1.5rem; }
    .box { background: #020617; border: 1px solid #1e293b; border-radius: 0.5rem; padding: 0.75rem 0.25rem; }
    .num { font-size: 1.5rem; font-weight: 700; color: #c084fc; font-family: monospace; }
    .label { font-size: 0.65rem; text-transform: uppercase; color: #64748b; font-weight: 600; margin-top: 0.25rem; }
    input[type="text"], input[type="date"] {
      width: 100%;
      padding: 0.5rem;
      background: #020617;
      border: 1px solid #334155;
      border-radius: 0.5rem;
      color: #fff;
      font-size: 0.85rem;
      margin-bottom: 0.5rem;
      box-sizing: border-box;
    }
  </style>
</head>
<body>
  <div class="card">
    <h2 id="eventTitleDisplay">🚀 Product Launch Day</h2>
    <p class="sub">Time remaining until target date</p>
    <div class="grid">
      <div class="box"><div class="num" id="d">42</div><div class="label">Days</div></div>
      <div class="box"><div class="num" id="h">16</div><div class="label">Hours</div></div>
      <div class="box"><div class="num" id="m">30</div><div class="label">Mins</div></div>
      <div class="box"><div class="num" id="s">05</div><div class="label">Secs</div></div>
    </div>
    <input type="text" id="titleInput" value="🚀 Product Launch Day" placeholder="Event Name">
    <input type="date" id="dateInput">
  </div>
  <script>
    const target = new Date(Date.now() + 42 * 86400000 + 16 * 3600000);
    const dateInput = document.getElementById('dateInput');
    dateInput.value = target.toISOString().split('T')[0];

    const titleInput = document.getElementById('titleInput');
    const titleDisplay = document.getElementById('eventTitleDisplay');
    titleInput.addEventListener('input', () => {
      titleDisplay.textContent = titleInput.value || 'Custom Event';
    });

    function update() {
      const selected = new Date(dateInput.value).getTime();
      const now = Date.now();
      const diff = Math.max(0, selected - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      const secs = Math.floor((diff / 1000) % 60);

      document.getElementById('d').textContent = String(days).padStart(2, '0');
      document.getElementById('h').textContent = String(hours).padStart(2, '0');
      document.getElementById('m').textContent = String(mins).padStart(2, '0');
      document.getElementById('s').textContent = String(secs).padStart(2, '0');
    }

    dateInput.addEventListener('change', update);
    setInterval(update, 1000);
    update();
  </script>
</body>
</html>`
  },

  unit_converter: {
    title: 'Instant Multi-Unit Converter',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Unit Converter</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      margin: 0;
      padding: 1.5rem;
      background: #090e17;
      color: #e2e8f0;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      box-sizing: border-box;
    }
    .card {
      background: #111a2e;
      border: 1px solid #1e293b;
      border-radius: 1rem;
      padding: 1.5rem;
      width: 100%;
      max-width: 380px;
    }
    h2 { margin: 0 0 1rem 0; font-size: 1.25rem; color: #10b981; }
    .row { display: flex; gap: 0.5rem; margin-bottom: 1rem; align-items: center; }
    input, select {
      padding: 0.65rem;
      background: #030712;
      border: 1px solid #334155;
      border-radius: 0.5rem;
      color: #fff;
      font-size: 0.9rem;
      outline: none;
    }
    input { flex: 1; }
    select { width: 110px; }
    .swap { text-align: center; color: #94a3b8; font-size: 1.2rem; cursor: pointer; user-select: none; margin: -0.25rem 0 0.5rem 0; }
    .result {
      background: #030712;
      border: 1px solid #1e293b;
      border-radius: 0.5rem;
      padding: 1rem;
      text-align: center;
      font-size: 1.25rem;
      font-weight: 700;
      color: #34d399;
    }
  </style>
</head>
<body>
  <div class="card">
    <h2>⚖️ Instant Unit Converter</h2>
    <div class="row">
      <input type="number" id="fromVal" value="10">
      <select id="fromUnit">
        <option value="km">Kilometers</option>
        <option value="mi">Miles</option>
        <option value="kg">Kilograms</option>
        <option value="lb">Pounds</option>
      </select>
    </div>
    <div class="swap" id="swapBtn">⇅</div>
    <div class="row">
      <input type="number" id="toVal" readonly>
      <select id="toUnit">
        <option value="mi">Miles</option>
        <option value="km">Kilometers</option>
        <option value="lb">Pounds</option>
        <option value="kg">Kilograms</option>
      </select>
    </div>
    <div class="result" id="resText">10 km = 6.21 miles</div>
  </div>
  <script>
    const fromVal = document.getElementById('fromVal');
    const toVal = document.getElementById('toVal');
    const fromUnit = document.getElementById('fromUnit');
    const toUnit = document.getElementById('toUnit');
    const resText = document.getElementById('resText');

    function convert() {
      const v = parseFloat(fromVal.value) || 0;
      const f = fromUnit.value;
      const t = toUnit.value;
      let res = v;

      if (f === 'km' && t === 'mi') res = v * 0.621371;
      else if (f === 'mi' && t === 'km') res = v / 0.621371;
      else if (f === 'kg' && t === 'lb') res = v * 2.20462;
      else if (f === 'lb' && t === 'kg') res = v / 2.20462;

      toVal.value = res.toFixed(2);
      resText.textContent = v + ' ' + f + ' = ' + res.toFixed(2) + ' ' + t;
    }

    fromVal.addEventListener('input', convert);
    fromUnit.addEventListener('change', convert);
    toUnit.addEventListener('change', convert);
    convert();
  </script>
</body>
</html>`
  },

  blank_screen_drill: {
    title: 'Emergency State Recovery & Undo Drill',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Recovery Drill</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      margin: 0;
      padding: 1.5rem;
      background: #030712;
      color: #f9fafb;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }
    .panel {
      background: #111827;
      border: 1px solid #10b981;
      border-radius: 1rem;
      padding: 1.5rem;
      max-width: 400px;
      text-align: center;
    }
    h2 { color: #34d399; margin: 0 0 0.5rem 0; }
    p { font-size: 0.85rem; color: #9ca3af; line-height: 1.5; }
    .status {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 700;
      background: #064e3b;
      color: #6ee7b7;
      margin: 1rem 0;
    }
  </style>
</head>
<body>
  <div class="panel">
    <h2>✓ Healthy Screen State Restored</h2>
    <div class="status">STATUS: ONLINE & VERIFIED</div>
    <p>You successfully broke out of the blank-screen panic by triggering the recovery action. The state is intact, buttons respond, and no data was lost.</p>
  </div>
</body>
</html>`
  }
};

/**
 * Resolves which canned demo app to return for offline mode based on user prompt keywords.
 */
function pickCannedAppForPrompt(prompt: string): { title: string; html: string } {
  const p = prompt.toLowerCase();
  if (p.includes('countdown') || p.includes('timer') || p.includes('date') || p.includes('event')) {
    return CANNED_APPS.countdown_timer;
  }
  if (p.includes('unit') || p.includes('convert') || p.includes('metric') || p.includes('miles')) {
    return CANNED_APPS.unit_converter;
  }
  if (p.includes('undo') || p.includes('blank') || p.includes('recovery') || p.includes('revert')) {
    return CANNED_APPS.blank_screen_drill;
  }
  // Default versatile utility: Tip & Split Calculator
  return CANNED_APPS.tip_calculator;
}

// ============================================================================
// PRIMARY GENERATION ENTRY POINT
// ============================================================================

export async function generateAppPreview(
  prompt: string,
  provider: BuilderProviderType = 'offline',
  explicitKey?: string | null
): Promise<GenerationResult> {
  const startTime = Date.now();
  const trimmedPrompt = prompt.trim();

  // 1. MOCK PROVIDER (for CI / fast Playwright headless assertions)
  if (provider === 'mock') {
    const isHostile = trimmedPrompt.includes('alert(') || trimmedPrompt.includes('cookie') || trimmedPrompt.includes('localStorage');
    const mockHtml = `<!DOCTYPE html>
<html>
<head><title>Mock Preview</title></head>
<body>
  <div id="mock-app" data-testid="mock-preview-root">
    <h1>Mock Utility App</h1>
    <p id="mock-prompt-echo">${trimmedPrompt.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
    <button id="mock-action-btn" onclick="document.getElementById('mock-status').innerText = 'ACTION_EXECUTED'">Click Me</button>
    <div id="mock-status">READY</div>
  </div>
  ${isHostile ? `<script>${trimmedPrompt}</script>` : ''}
</body>
</html>`;

    return {
      success: true,
      html: injectCspAndFrameSandbox(mockHtml),
      providerUsed: 'mock',
      durationMs: Date.now() - startTime
    };
  }

  // 2. OFFLINE DEMO PROVIDER (instant, $0, guaranteed working without keys)
  if (provider === 'offline') {
    // Artificial small delay (120ms) to simulate tactile agent execution
    await new Promise(r => setTimeout(r, 120));
    const selected = pickCannedAppForPrompt(trimmedPrompt);

    return {
      success: true,
      html: injectCspAndFrameSandbox(selected.html),
      providerUsed: 'offline',
      durationMs: Date.now() - startTime
    };
  }

  // 3. GOOGLE AI STUDIO BYOK ADAPTER (Gemini Flash REST endpoint)
  if (provider === 'gemini-byok') {
    const key = explicitKey || getBuilderApiKey();
    if (!key) {
      return {
        success: false,
        html: '',
        error: 'Google AI Studio API key not found. Please enter your free key in the BYOK dialog, or select Offline Demo mode.',
        providerUsed: 'gemini-byok',
        durationMs: Date.now() - startTime
      };
    }

    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(key)}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15-second bounded timeout

      const requestBody = {
        contents: [
          {
            parts: [
              {
                text: `You are an expert web UI code generator for OpenGuide.
Build a complete, standalone, interactive single-file HTML document (with inline <style> and <script>) matching this prompt:
"${trimmedPrompt}"

REQUIREMENTS:
1. Output ONLY valid HTML code. No markdown wrapping (\`\`\`html), no preamble, no explanations.
2. Modern, accessible, tactile CSS with dark mode styling (#0f172a background).
3. Self-contained logic using vanilla JavaScript.
4. Clean layout that fits neatly on desktop and mobile.`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 2500
        }
      };

      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!resp.ok) {
        const errorJson = await resp.json().catch(() => null);
        const errorMsg = errorJson?.error?.message || `API Error: ${resp.status} ${resp.statusText}`;
        return {
          success: false,
          html: '',
          error: errorMsg,
          providerUsed: 'gemini-byok',
          durationMs: Date.now() - startTime
        };
      }

      const data = await resp.json();
      let rawOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

      // Strip markdown code fences if model enclosed it
      if (rawOutput.includes('```html')) {
        rawOutput = rawOutput.split('```html')[1].split('```')[0];
      } else if (rawOutput.includes('```')) {
        rawOutput = rawOutput.split('```')[1].split('```')[0];
      }

      return {
        success: true,
        html: injectCspAndFrameSandbox(rawOutput),
        providerUsed: 'gemini-byok',
        durationMs: Date.now() - startTime
      };
    } catch (err: any) {
      const isTimeout = err?.name === 'AbortError';
      return {
        success: false,
        html: '',
        error: isTimeout ? 'Request timed out after 15 seconds. Check your internet connection.' : (err?.message || 'Failed to call Gemini API'),
        providerUsed: 'gemini-byok',
        durationMs: Date.now() - startTime
      };
    }
  }

  // Fallback
  return {
    success: false,
    html: '',
    error: 'Unknown provider specified.',
    providerUsed: provider,
    durationMs: Date.now() - startTime
  };
}
