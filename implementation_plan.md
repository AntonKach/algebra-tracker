# Redesign Algebra Tracker Web App

## Goal
Transform the existing `index.html` and associated assets into a modern, visually stunning, responsive web application for the Algebra Tracker. The redesign will focus on premium aesthetics, dark mode, smooth micro‑animations, and an intuitive user experience.

## User Review Required
- **Design direction**: Confirm the preferred color palette (e.g., deep dark theme with accent teal) and font choices (Google Font: Inter). If you have any brand colors or imagery you want to keep, let us know.
- **Feature scope**: Should we retain all existing functionality (login, problem generation, OCR, chat, etc.)? If any features can be dropped or simplified, advise.

## Open Questions
> [!IMPORTANT]
> - Do you want a single‑page app with dynamic routing (e.g., using vanilla JS history API) or keep the current SPA style?
> - Should we incorporate any additional UI components such as a floating action button for help or a persistent dark‑mode toggle?
> - Are there any performance constraints (e.g., target load time < 2 s on mobile)?

## Proposed Changes
---
### Design System (new files)
- **[NEW] style.css** – Central stylesheet defining CSS variables for colors, typography, layout grid, glass‑morphism cards, and animations.
- **[NEW] fonts.html** – Tiny HTML fragment to load Google Fonts (Inter, Roboto) with `font-display: swap`.

### Index HTML
- **[MODIFY] index.html** – Clean up the `<head>` to include the new stylesheet and font link, remove redundant meta tags, and add a `<meta name="theme-color">` matching the dark mode.
- Re‑structure the body using semantic sections (`<header>`, `<main>`, `<nav>`, `<section>`) and CSS Grid for a two‑column layout on desktop, stacking on mobile.
- Replace inline styles with class‑based styling.
- Add `data-theme="dark"` attribute to enable CSS theme switching.
- Introduce a visible dark‑mode toggle button.
- Update all button elements to use consistent component classes (`.btn-primary`, `.btn-secondary`).
- Refactor the welcome splash into a modal component with fade‑in animation.
- Ensure all images (e.g., `cat.jpg`) are loaded via `<picture>` element for responsive resolutions.
- Add ARIA labels and proper button semantics for accessibility.

### JavaScript Enhancements (existing script.js)
- **[MODIFY] script.js** – Refactor to modular functions, replace repeated DOM queries with cached references.
- Introduce a small utility module for theme handling (`theme.js`).
- Add subtle micro‑animations using CSS transitions triggered from JS (e.g., button press ripple effect).
- Ensure the language selector updates text via the existing `translations.js` but with smoother UI feedback.

### Additional UI Components
- **[NEW] modal.js** – Generic modal handling (open/close, focus trap).
- **[NEW] toast.js** – Toast notifications for success/error messages.

### SEO & Accessibility
- Add a single `<h1>` per page (`<h1 class="app-title">Algebra Tracker</h1>`).
- Include meta description and Open Graph tags.
- Ensure all interactive elements have unique IDs and `role` attributes where appropriate.
- Implement `prefers-reduced-motion` media query fallback.

## Verification Plan
### Automated Tests
- Run `npm run dev` after installing a simple dev server (e.g., `live-server`). Verify that the page loads without console errors.
- Use Lighthouse (via Chrome) to check Performance, Accessibility, Best Practices, and SEO scores (target > 90).

### Manual Verification
- Open the page on mobile and desktop to confirm responsive layout.
- Test dark‑mode toggle and ensure colors adjust correctly.
- Verify all existing functionality (login, problem generation, OCR, chat) still works.
- Check that the language selector updates UI text instantly.

---
*This plan outlines a comprehensive redesign while preserving the core functionality of the Algebra Tracker. Please review and approve or suggest adjustments.*
