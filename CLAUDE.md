# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static HTML/CSS/JavaScript landing page for a health insurance advisory service in Paraguay. Targets German retirees, digital nomads, and expats. Bilingual (English/German) with WhatsApp-based contact flow. No framework, no dependencies, no backend.

Hosted on **Vercel** (deployed via GitHub). Currently Phase 1 (informational site). Phase 2 will add a Python backend, insurance comparator, online quoter, and database.

## Running Locally

Open `index.html` directly in a browser, or serve with:
```bash
python -m http.server 8000
```
No build step, no package manager, no test suite, no linter configured.

## Architecture

Three files total:

- **index.html** — Single-page scroll layout with sections: hero, about, health system overview, IPS vs private insurance comparison, coverage table, national vs international plans, and contact form.
- **script.js** — Three concerns: language switching, WhatsApp link generation, and contact form handling (redirects to WhatsApp, no backend).
- **styles.css** — CSS variables for theming, mobile-first responsive design with breakpoints at 640px (tablet) and 1024px (desktop). Uses flexbox and CSS grid.

## Code Principles

- **No frameworks or libraries** — vanilla HTML/CSS/JS only. No jQuery, no SASS, no preprocessors.
- **Simple, direct JavaScript** — plain functions with `addEventListener`. No classes, no OOP patterns.
- **Semantic HTML** — standard tags, clear IDs for navigation, no unnecessary divs.
- **CSS layout with flexbox** — CSS variables for colors. Basic media queries for responsive.
- **Mobile-first** — 70%+ of users are on mobile. Test on mobile constantly.

## Bilingual System

Every translatable element uses `data-en` and `data-de` attributes. The `setLanguage(lang)` function in script.js iterates all `[data-en]` elements and sets `textContent` (or `placeholder` for inputs) from the matching attribute. New text content must always include both `data-en` and `data-de` attributes.

## WhatsApp Integration

Contact form and floating button both redirect to WhatsApp (`wa.me/595994677948`) with pre-populated, language-aware messages. The phone number and message templates are in script.js. No form data is stored server-side.
