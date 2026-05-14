# myProfile

Personal portfolio site built with SvelteKit. Bilingual (EN/ES), statically generated, and deployed via Firebase Hosting.

## Tech Stack

- **Framework**: SvelteKit 2.0 + Svelte 5
- **Styling**: Tailwind CSS 3 + DaisyUI 4
- **Language**: TypeScript
- **Backend/Hosting**: Firebase (Firestore, Hosting, Functions)
- **Charts**: Chart.js
- **Adapter**: `@sveltejs/adapter-static` (SSG)

## Project Structure

```
myProfile/
├── src/
│   ├── routes/                  # File-based routing
│   │   ├── +layout.svelte       # Global layout (Header + Footer)
│   │   ├── +layout.server.ts    # Server-side data loading (Medium articles)
│   │   ├── +page.svelte         # Home page — hero, experience, projects, skills
│   │   ├── posts/               # Blog/publications page
│   │   ├── projects/            # Projects showcase
│   │   ├── skills/              # Skills page with Chart.js charts
│   │   ├── trabajos/            # Work experience page
│   │   └── inicio/              # Alternate home route
│   ├── lib/
│   │   ├── components/
│   │   │   ├── Header.svelte    # Navigation header
│   │   │   ├── Footer.svelte    # Footer
│   │   │   ├── Modal.svelte     # Modal dialog
│   │   │   └── Circles.svelte   # Animated background circles
│   │   ├── i18n/
│   │   │   ├── store.ts         # Language state (Svelte stores, localStorage)
│   │   │   └── translations.ts  # EN/ES translation strings
│   │   ├── utils/
│   │   │   └── colorRandomizer.ts  # Random color utilities
│   │   ├── helpers/
│   │   │   └── Circle.ts        # Circle animation helper class
│   │   ├── constants.ts         # Static data: skills, experiences, projects
│   │   ├── helpers.ts           # Utility functions
│   │   ├── services.ts          # External API calls (Medium RSS)
│   │   └── index.ts             # Barrel export
│   ├── app.css                  # Global styles
│   └── app.d.ts                 # TypeScript app types
├── static/                      # Static assets (fonts, icons, favicon)
├── build/                       # Production build output
├── firebase.json                # Firebase Hosting + Functions config
├── firestore.rules              # Firestore security rules
├── svelte.config.js             # SvelteKit config (static adapter)
├── tailwind.config.js           # Tailwind + DaisyUI config
└── vite.config.ts               # Vite config
```

## Getting Started

```bash
npm install
npm run dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run check` | Run Svelte type checks |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |

## Key Features

- **Bilingual (EN/ES)**: Language stored in `localStorage`, detected from browser preferences
- **Static generation**: All pages prerendered at build time
- **Medium integration**: Articles fetched server-side from Medium RSS feed
- **Dynamic colors**: Cards and accents use randomized color palettes
- **Scroll animations**: Name animation and section transitions tied to scroll position
- **Chart.js skills**: Horizontal bar charts per skill category
- **Responsive**: Mobile-first with Tailwind, breakpoint at 768px

## Content Data

All portfolio content lives in `src/lib/constants.ts`:
- **Skills**: Grouped by category (Languages, Frameworks, AI/ML, DevOps, Tooling)
- **Experiences**: Full career history entries
- **Projects**: Featured and archived projects with status tracking
- **Publications**: Template/metadata for blog posts

## Deployment

Deployed to Firebase Hosting. The build output goes to `build/`.

```bash
npm run build
firebase deploy
```
