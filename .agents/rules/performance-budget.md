# Performance Budget Rule

Every feature in OpenGuide MUST meet these performance budgets. No exceptions.

---

## 1. Bundle Size Budget

| Asset | Budget (gzipped) | Action if exceeded |
|---|---|---|
| Total JS | ≤ 350KB (excluding on-demand Pyodide wheels) | Code split, remove unused deps |
| Total CSS | ≤ 50KB | Purge unused CSS rules |
| Initial load JS | ≤ 150KB | Lazy load non-critical routes |
| Total images/page | ≤ 500KB | Compress, lazy load, use WebP |
| Single JS chunk | ≤ 100KB | Split into smaller chunks |

### Check
```bash
npm run build
```

---

## 2. Core Web Vitals Budget

| Metric | Target | Maximum |
|---|---|---|
| LCP (Largest Contentful Paint) | ≤ 2.5s | 4.0s |
| INP (Interaction to Next Paint) | ≤ 200ms | 500ms |
| CLS (Cumulative Layout Shift) | ≤ 0.1 | 0.25 |
| FCP (First Contentful Paint) | ≤ 1.8s | 3.0s |
| TTFB (Time to First Byte) | ≤ 800ms | 1800ms |

### Check
```javascript
const perf = performance.getEntriesByType('navigation')[0];
console.log('FCP:', performance.getEntriesByName('first-contentful-paint')[0]?.startTime);
console.log('LCP:', perf.domContentLoadedEventEnd - perf.startTime);
```

---

## 3. DOM Budget

| Metric | Budget | Action |
|---|---|---|
| DOM nodes per page | ≤ 2000 | Virtual scroll, lazy load |
| Images per page | ≤ 20 | Lazy load offscreen |
| Scripts per page | ≤ 5 | Bundle, code split |
| Stylesheets per page | ≤ 3 | Combine, purge |

---

## 4. Memory & Web Worker Budget

| Metric | Budget | Action |
|---|---|---|
| JS heap size | ≤ 80MB | Fix memory leaks, dispose Web Workers |
| Web Worker watchdog timeout | ≤ 15s | Terminate infinite Python loops |
| Event listeners | Clean on unmount | useEffect cleanup |

---

## 5. Network Budget

| Metric | Budget | Action |
|---|---|---|
| Paid API calls | 0 ($0 Rule) | Only user BYOK keys allow frontier calls |
| Third-party requests | ≤ 3 | CDN assets for Pyodide and fonts only |

---

## 6. Enforcement

- Check bundle size before every deploy
- Monitor 60 FPS transitions and memory footprint
- Alert if any budget is exceeded

