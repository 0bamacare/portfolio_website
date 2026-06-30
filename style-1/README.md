## Style 1 – Modern Minimal (Light, Pastel)

This style focuses on a **clean, modern minimal** look:

- Light background with **soft pastel accents**.
- Generous whitespace and clear visual hierarchy.
- Simple geometric dividers and subtle shadows.
- Rounded cards and smooth hover states.

### Technical notes

- Uses CSS custom properties for:
  - Colors (`--color-bg`, `--color-accent`, `--color-text`, etc.).
  - Spacing and radius scales.
  - Transition durations and easing.
- Layout:
  - Mobile-first flexbox and CSS grid.
  - Max-width container for readable line lengths.
- Animations:
  - Subtle fades and slides using `transform` and `opacity`.
  - Scroll-triggered reveals via `IntersectionObserver` where supported.
  - Respects `prefers-reduced-motion` and a manual “Animations” toggle.

### Files in this style

- `index.html` – Home with sections for hero, projects highlight, skills, about, contact CTA.
- `css/style.css` – Main stylesheet with variables and component styles.
- `js/main.js` – Bootstraps interactions, binds event listeners.
- `js/i18n.js` – Language loading and switching.
- `js/carousel.js` – Accessible projects carousel behaviour.
- `js/animations.js` – Scroll and motion toggle logic.
- `data/projects.json` – Project data feeding cards and carousel.
- `i18n/*.json` – Language dictionaries (en, nl, de, fr, es).
- `assets/` – Icons and placeholder imagery.

### Notes on customization

- Replace any personal content placeholders:
  - `{{FULL_NAME}}`
  - `{{BIO_SHORT}}`
  - `{{BIO_LONG}}`
  - `{{HERO_TAGLINE}}`
  - `{{CONTACT_EMAIL}}`, `{{CONTACT_LOCATION}}`
  - Social URLs like `{{GITHUB_URL}}`, `{{LINKEDIN_URL}}`, etc.
- Update `data/projects.json` to reflect your real projects.
- Adjust colors by changing `:root` variables near the top of `css/style.css`.

