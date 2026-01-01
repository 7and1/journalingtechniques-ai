# journalingtechniques.ai

Private, on-device AI journaling workspace built with Next.js. Journal text stays in the browser (local storage / optional encrypted “Vault”) and is never sent to a server for analysis.

## What’s included

- On-device AI insights (Transformers.js via `@xenova/transformers`)
- Guided templates (CBT-inspired thought record, gratitude, etc.)
- Prompt library (`content/prompts/prompts-database.json`)
- Bookmarks + reading progress
- Journal history + export/import (JSON + Markdown)
- Optional local encryption “Vault” (PBKDF2 + AES‑GCM) for stored data
- PWA + offline fallback (`public/sw.js`)

> Note: This project is educational and not medical advice.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Commands

```bash
npm run lint
npm run type-check
npm test
npm run build
```

## Content

- Guides (MDX): `content/guides`
- Prompt database (JSON): `content/prompts/prompts-database.json`

## Configuration

- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` (optional): sets the Plausible `data-domain` (defaults to `journalingtechniques.ai`)

## Deployment notes

- If you deploy under a different domain, update `app/layout.tsx` (`metadataBase`, OpenGraph URLs, sitemap URL).
- Security headers (including HSTS) are configured in `next.config.mjs` — only enable HSTS on HTTPS deployments.
