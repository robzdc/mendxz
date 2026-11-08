# mendxz.com

Personal studio site for apps and games. Built with Astro 7, Tailwind v4 and pnpm.

## Develop

```sh
nvm use          # Node 24 (see .nvmrc)
pnpm install
pnpm dev         # http://localhost:4321
pnpm astro check # type-check
pnpm build       # static output in dist/
```

## Store URLs (per app)

| Store field | URL |
|---|---|
| Marketing URL | `https://mendxz.com/apps/<slug>` |
| Support URL | `https://mendxz.com/apps/<slug>/support` |
| Privacy Policy URL | `https://mendxz.com/apps/<slug>/privacy` |

## Editing content

- **Studio identity** (email, name, socials): `src/config/site.ts`
- **Apps**: one Markdown file per app in `src/content/apps/`. The file name is the slug. The schema is in `src/content.config.ts`.
- **App images**: `src/assets/apps/<slug>/` (icon and screenshots, optimized at build time).
- **Social share image**: `public/og/<slug>.png` (1200×630).
- **Colors and fonts**: `src/styles/global.css` (`@theme`) and `astro.config.mjs` (`fonts`).

To add an app, copy `src/content/apps/astrosurf.md`, rename it, and add its images. All of its pages, the sitemap, JSON-LD and `llms.txt` update automatically.

## Deploy (Cloudflare Pages)

- Build command: `pnpm build`
- Output directory: `dist`
- Environment variable: `NODE_VERSION=24` (or rely on `.nvmrc`)
