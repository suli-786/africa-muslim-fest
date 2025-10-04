Africa Muslim Fest 2026 — One‑page site
=======================================

This repo contains a simple, offline‑friendly Jekyll site for Africa Muslim Fest 2026. It uses a small custom layout, data‑driven sections, and one stylesheet/JS for simplicity.

Quick start

- Build: `bundle exec jekyll build`
- Serve: `bundle exec jekyll serve`
- Output is in `_site/`

Key files and what to edit

- Homepage content: `index.md`
  - Front matter controls hero image, color, button.
  - Includes insert section partials in order.
- Layout: `_layouts/splash.html`
  - Minimal HTML wrapper used by the homepage. Includes custom nav, hero, footer, and loads CSS/JS.
- Navigation: `_includes/nav.html` and `_data/navigation.yml`
  - Edit links in `_data/navigation.yml`. The include renders them.
- Sections (edit text/markup):
  - About: `_includes/about.html`
  - Pillars: `_includes/pillars.html` (content from `_data/pillars.yml`)
  - Event Types: `_includes/event_types.html` (content from `_data/event_types.yml`)
  - Get Involved: `_includes/get_involved.html` (CTA rows linking to `/forms/`)
  - Footer: `_includes/footer.html`
- Data (easy to update lists):
  - Pillars: `_data/pillars.yml`
  - Event types: `_data/event_types.yml`
- Assets
  - CSS: `assets/css/custom.css`
  - JS: `assets/js/custom.js`
  - Images: `assets/images/`

How the homepage is composed

- `index.md` uses `layout: splash` and supplies hero settings via `header:`. The layout renders the hero and then injects the page content, which is the series of `{% include ... %}` calls in `index.md`.

Brand + fonts

- Colors are defined as CSS variables in `assets/css/custom.css`:
  - Primary (Persian Green): `#00A597`
  - Secondary (Pizza Gold): `#C4900D`
  - Background: `#E5F6F4`
- Fonts are loaded in `_includes/head/custom.html` (Hahmlet + Nunito Sans) along with Font Awesome (for icons if you re‑enable them).

Editing common items

- Change hero background: `index.md` front matter `header.overlay_image`
- Change hero copy/tagline: `index.md` `excerpt` (use a markdown line break `two spaces + newline` to split lines)
- Update nav items: `_data/navigation.yml`
- Add/rename pillars: `_data/pillars.yml` (optional `icon:` per item)
- Update event types: `_data/event_types.yml` (icons in `assets/images/icons/`)
- Get Involved CTAs: `_includes/get_involved.html` (links point to `/forms/#...`)

Forms page (placeholder)

- CTAs point to `/forms/`. A simple placeholder exists at `forms/index.md` with anchor IDs for Partner, Event, and Committee. Replace later with real forms or a third‑party service.

Accessibility notes

- Landmarks: header/nav/hero/main/footer used.
- Links and buttons have visible focus; social icons (if re‑enabled) use `aria-label`.
- Images include meaningful `alt` where appropriate.

Deploy notes

- URLs inside templates use Jekyll’s `relative_url` filter where possible.
- Direct URLs in the CSS (e.g., background images) are absolute (`/assets/...`). If deploying under a subpath, either keep `baseurl: ""` or move those backgrounds into HTML styles so Liquid can apply `relative_url`.

Known trade‑offs / cleanup ideas

- The repo previously used the Minimal Mistakes remote theme. We removed the remote dependency to support offline builds and added a simple local layout. Some Minimal Mistakes masthead overrides remain in the CSS; they are harmless but can be deleted if you won’t switch back.
- `assets/css/custom.css` is one file for simplicity. If this grows, consider moving to SCSS and splitting into partials in `_sass/`.
- Image weight can be optimized (WebP variants, sizes, `srcset`).
