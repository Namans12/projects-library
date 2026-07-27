# projects-library

A scroll-driven portfolio wall. A full-viewport hero image shrinks into a 5×3 grid of project cards as you scroll — animated entirely by CSS scroll-driven animations, with GSAP only as a fallback.

## Overview

The point of this project is the technique. Rather than listening to scroll events in JavaScript and imperatively setting styles, the animation is declared in CSS using the [scroll-driven animations](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline) spec — `animation-timeline`, `view-timeline`, and `animation-range`. The browser runs it off the main thread, so it stays smooth under load.

Each card in the resulting grid links to its GitHub repository. CSS subgrid keeps the layers aligned as they resolve into the final layout.

GSAP ScrollTrigger is wired up as a fallback for browsers that don't support the spec yet — it is not the primary path.

## Features

- Hero-to-grid transition driven purely by scroll position
- CSS subgrid layout for the 5×3 wall
- Three image layers plus a central "scaler" hero image
- Every card links to its repo
- GSAP ScrollTrigger fallback for unsupported browsers
- No scroll event listeners in the primary path

## Tech Stack

React 19 · TypeScript · Vite · CSS scroll-driven animations + subgrid · GSAP ScrollTrigger (fallback only)

## Browser support

Scroll-driven animations are supported in Chromium 115+ and Safari 26+. Firefox requires `layout.css.scroll-driven-animations.enabled`. Elsewhere the GSAP fallback takes over — visually equivalent, but running on the main thread.

## Prerequisites

- Node.js 18+ and npm

## Installation

```bash
git clone https://github.com/Namans12/projects-library.git
cd projects-library
npm install
```

## Usage

```bash
npm run dev
```

| Command | Does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run preview` | Serve the build |
| `npm run lint` | ESLint |

## Adding or changing projects

Everything is in [`src/data.ts`](src/data.ts). It exports `layers` — an array of three arrays, one per subgrid layer:

```ts
export interface Project {
  src: string    // image path under public/images/
  href: string   // GitHub URL
  name: string   // label
}
```

To add a project: drop a screenshot in `public/images/`, add an entry to the appropriate layer, and keep the layer sizes balanced so the 5×3 grid stays full.

## Project Structure

```
src/
  main.tsx              entry point
  App.tsx               layout and layer composition
  data.ts               project list — the only file you normally edit
  hooks/
    usePlaybook.ts      animation orchestration and fallback detection
  styles/
    playbook.css        scroll-driven animation definitions
  assets/
public/
  images/               project screenshots
```

The interesting code is `styles/playbook.css` — that is where the timelines and ranges are declared.

## Notes

- The package is named `scroll-airplane` internally, from an earlier iteration
- Screenshots are committed rather than generated, so they need refreshing when a project's UI changes
- Default branch is `main`

## Related Repositories

| Repo | Relationship |
|---|---|
| [`projects-web`](https://github.com/Namans12/projects-web) | Similar name, different project — a vanilla-TypeScript project showcase with no React |
| [`Portfolio_resume`](https://github.com/Namans12/Portfolio_resume) | Personal portfolio site |
| [`resume-hero`](https://github.com/Namans12/resume-hero) | Animated hero section experiment |
