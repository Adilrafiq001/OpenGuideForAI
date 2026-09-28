# Accessibility Standards Rule

Every UI component in Openlysts MUST meet WCAG 2.1 Level AA. No exceptions.

---

## 1. Semantic HTML

### Required Landmarks
```html
<header role="banner">...</header>
<nav aria-label="Main navigation">...</nav>
<main id="main-content">...</main>
<footer role="contentinfo">...</footer>
```

### Heading Hierarchy
- Exactly ONE `<h1>` per page
- Never skip heading levels (h1 → h3 is invalid)
- Use headings for structure, not styling

---

## 2. Keyboard Navigation

### Tab Order
- Skip link is first focusable element
- Logical flow: nav → content → footer
- Focus never gets stuck
- All interactive elements reachable

### Focus Styles
```css
:focus-visible {
  outline: 2px solid #10b981;
  outline-offset: 2px;
}
```

### Required Keyboard Support
| Key | Action |
|---|---|
| Tab | Next focusable element |
| Shift+Tab | Previous focusable element |
| Enter | Activate links and buttons |
| Space | Activate buttons and checkboxes |
| Escape | Close modals, dropdowns |
| Arrow keys | Navigate menus, lists |

---

## 3. Images & Media

### Alt Text
```jsx
// Informative image
<img src="chart.png" alt="Star growth chart showing 1000 to 5000 stars" />

// Decorative image
<img src="decor.svg" alt="" role="presentation" />
```

### Rules
- Every `<img>` must have `alt` attribute
- Informative images: describe the content
- Decorative images: `alt=""` and `role="presentation"`
- Complex images: use `<figure>` + `<figcaption>`

---

## 4. Forms

### Labels
```jsx
// Every input must have a label
<label htmlFor="email">Email address</label>
<input id="email" type="email" aria-required="true" />

// Error messages must be associated
<input aria-invalid={hasError} aria-describedby="email-error" />
<p id="email-error" role="alert">Invalid email</p>
```

### Rules
- Every input has a visible label
- Error messages use `role="alert"`
- Required fields use `aria-required="true"`
- Fieldsets for radio/checkbox groups

---

## 5. ARIA Patterns

### Modals
```jsx
<Dialog.Content
  role="dialog"
  aria-modal="true"
  aria-labelledby="title"
>
  <h2 id="title">Dialog</h2>
</Dialog.Content>
```

### Dropdowns
```jsx
<button aria-expanded={isOpen} aria-haspopup="menu">Options</button>
```

### Live Regions
```jsx
<div aria-live="polite">{loadingMessage}</div>
<div aria-live="assertive" role="alert">{errorMessage}</div>
```

---

## 6. Color & Contrast

### Minimum Ratios
| Element | Normal Text | Large Text |
|---|---|---|
| Body text | 4.5:1 | 3:1 |
| UI components | 3:1 | 3:1 |
| Focus indicators | 3:1 | 3:1 |

### Rules
- Never rely on color alone for information
- Use icons + text for status indicators
- Test with color-blindness simulators

---

## 7. Touch Targets

Two criteria apply, and they are not the same size. Both are enforced by
`tools/lib/page-probes.mjs` (the gate's probes import from there, so the rule
and the check cannot drift apart).

### The classification: standalone vs sentence-embedded

Every control is one of two things, and the direct parent element decides:

- **Sentence-embedded** - the control's direct parent is part of a running
  line: `p`, `li`, `dd`, `dt`, `blockquote`, `cite`, `figcaption`. These keep
  their natural text box; padding them to a floor would break line flow or
  overlap neighbouring lines. WCAG 2.5.8 (AA) and 2.5.5 (AAA) both exempt
  them. (If a link that reads as prose sits directly in a table cell or
  another container, wrap the sentence in a `p` so the DOM carries the
  classification, see the vespers guarantee page, ruling 54.)
- **Standalone** - everything else: navigation and footer rows, breadcrumbs,
  pagers, buttons, form controls, mode switches, wordmarks, card and product
  titles, contact links, teasers. Both floors apply to these.

The same filter lives once in the probe (`standalone`, by direct parent), so
the template-page and style-page passes cannot disagree.

### WCAG 2.5.8 (AA) - the enforced floor
- Every STANDALONE control is at least 24×24px.
- Exempt: a link inside a running sentence (see the classification above).
- Exempt: anything a person cannot aim at, a clipped, `aria-hidden` or
  off-screen element (a spam honeypot, a visually hidden skip target used only
  by assistive tech).
- Whichever of 24×24 or the spacing exception you use, targets must not
  overlap.

### WCAG 2.5.5 (AAA) - the project target, enforced (ruling 54)
- Standalone controls get 44×44px: navigation and footer rows, buttons, form
  controls, mode switches, card and product titles, contact links.
- Prose links keep their natural text box. Padding them to 44px would either
  break line flow or overlap neighbouring lines, and both criteria exempt them.
- The gate FAILs a touch-device page on any standalone control under the 44px
  floor. It was advisory until ruling 54; the advisory class produced 300+
  accepted-looking notes a run while real gaps stayed invisible. On non-touch
  (pointer) devices the tier stays a metric, a mouse has no finger.
- `min-height`/`min-width` only work on a non-inline box: a floor on an
  `inline` link is silently ignored, so pair it with `display: inline-flex` or
  `inline-block`. Completing the floor in the width dimension is done with
  padding on the row, never negative margins, they overlap the neighbouring
  hit areas, which the criteria forbid.
- The floors compare against (floor − 0.02px): a box laid out at exactly 44px
  can read 43.99999 depending on where the engine rounds its line box, and
  that dust is not a small target. The real shortfalls are 16-20px short.

```css
/* Standalone controls: a 44×44 box. Prose links: untouched. */
.nav a, .foot-links a, .a11y-modes button {
  display: inline-flex; align-items: center; justify-content: center;
  min-height: 44px; min-width: 44px;
}
```

---

## 8. Responsive

- Content reflows at 320px width (no horizontal scroll)
- Text resizable to 200% without loss
- No information lost at any viewport

---

## 9. Testing Checklist

### Keyboard
- [ ] Tab through entire page
- [ ] Focus visible on all elements
- [ ] Enter activates links/buttons
- [ ] Escape closes modals
- [ ] No keyboard traps

### Screen Reader
- [ ] Landmarks announced
- [ ] Headings in order
- [ ] Images have alt text
- [ ] Forms have labels
- [ ] Dynamic content announced

### Visual
- [ ] Contrast ≥ 4.5:1
- [ ] No color-only information
- [ ] Text resizable
- [ ] Focus indicators visible

---

## 10. Enforcement

- WCAG compliance required for all new components
- Accessibility audit required before major releases
- Screen reader testing for critical flows
- Keyboard testing for all interactive elements
