# CLAUDE.md

Guidelines for Claude Code when working on this project.

## Project Overview

Personal portfolio site — SvelteKit 2 + Svelte 5, TypeScript, Tailwind CSS + DaisyUI, Firebase Hosting. Statically generated via `@sveltejs/adapter-static`.

## Key Files

| File | Purpose |
|------|---------|
| `src/lib/constants.ts` | All portfolio content: skills, work experience, projects |
| `src/lib/i18n/translations.ts` | All user-facing strings in EN and ES |
| `src/routes/+page.svelte` | Main portfolio page (~830 lines) |
| `src/routes/+layout.server.ts` | Server-side Medium RSS fetch |
| `src/lib/i18n/store.ts` | Language store + localStorage persistence |
| `src/lib/utils/colorRandomizer.ts` | Random color generation for cards/accents |

## Development Commands

```bash
npm run dev        # Start dev server
npm run build      # Production build (outputs to build/)
npm run check      # Svelte type checking
npm run lint       # ESLint
npm run format     # Prettier
firebase deploy    # Deploy to Firebase Hosting
```

## Architecture Notes

- **Routing**: File-based via SvelteKit. Routes under `src/routes/`.
- **i18n**: All UI strings go in `src/lib/i18n/translations.ts` under both `en` and `es` keys. Never hardcode user-facing text directly in components.
- **Content data**: Skills, experiences, and projects are defined as typed objects in `src/lib/constants.ts`. Add new items there, not inline in components.
- **Static adapter**: No server-side runtime. Avoid SvelteKit features that require a server (e.g., form actions, server endpoints that aren't prerendered).
- **Styling**: Use Tailwind utility classes. DaisyUI component classes are available. Custom CSS goes in `src/app.css` or `src/styles.css`.
- **Colors**: Dynamic accent colors are generated via `colorRandomizer.ts`. CSS custom properties (`--red`, `--publication-hover-color`, etc.) are set inline on elements.

## Conventions

- Tabs for indentation, single quotes, 100-char line width (per `.prettierrc`).
- TypeScript strict mode is on — avoid `any`.
- Component files use `.svelte`, utilities/helpers use `.ts`.
- Bilingual support is required for all new user-facing text — add both `en` and `es` translations.
- Mobile breakpoint is 768px (`md:` in Tailwind).
