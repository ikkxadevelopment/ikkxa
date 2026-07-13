# CLAUDE.md

Next.js 14 (App Router) storefront deployed to Cloudflare via `@opennextjs/cloudflare`.
This file documents how **static files / `public/` assets** are built and served, because
the serving path is non-obvious and is the source of most "image 404 / not updating" bugs.

## Static files: how they are served

### Where assets come from
- Files in `public/` are served at the site root: `public/images/logo.png` → `/images/logo.png`.
- The OpenNext build copies everything in `public/` into `.open-next/assets/` (its root),
  alongside `_next/static/`, `_next/media/`, `BUILD_ID`, etc. That directory is the asset store
  Cloudflare uploads.
- The `cp -r public .open-next/public` tail in `package.json`'s `build` script is a **leftover
  no-op** for Cloudflare — OpenNext already places `public/` into `.open-next/assets/`. Don't rely on it.

### Reference assets by root-relative path
- Use `/images/foo.png`, **not** `` `${process.env.NEXT_PUBLIC_BASE_URL_IMG}images/foo.png` ``.
  Public assets ship with the deployment and are served from the same origin.
- Images rendered through `next/image` go through the `/_next/image?url=...` optimizer, which the
  worker handles separately from the static-asset path below.

## Two deployment modes (they serve static files differently)

| | dev.ikkxa.com | www.ikkxa.com (prod) |
|---|---|---|
| Branch | `development` | `main` |
| CF project | Pages `ikkxa-dev` | Workers `ikkxa-production` |
| Mode | **Pages Advanced Mode** (`_worker.js`) | **Workers + Static Assets** (`[assets]` binding) |
| wrangler.toml | `pages_build_output_dir = ".open-next"` | `main = ".open-next/worker.js"` + `[assets]` |
| Static serving | Worker must proxy to `env.ASSETS` **manually** (see patch-worker) | Cloudflare serves assets natively **before** the worker runs |

Both deployments auto-deploy on push to their branch (Cloudflare Git integration — this is
separate from `.github/workflows/deploy.yml`, which is the unrelated VPS/Docker pipeline).

### Pages mode (dev) requires `scripts/patch-worker.cjs`
In Pages Advanced Mode **every** request hits `_worker.js` — Cloudflare does *not* auto-serve
static files. `patch-worker.cjs` injects a check into the built worker that proxies static paths
to `env.ASSETS` before falling through to the Next.js SSR handler. It serves:
`/_next/static/`, `/_next/media/`, `/images/`, `/fonts/`, and any root-level path with a file
extension (favicon.ico, *.svg, etc.). Anything it does **not** match falls through to SSR and 404s.

> **Gotcha that caused real 404s:** the patch originally only proxied `/_next/static/` and
> `/_next/media/`, so the entire `public/` folder (`/images/*`, `/fonts/*`, root `.svg`) 404'd on
> dev. If you add a new **top-level public prefix** (e.g. `public/videos/`), either it must be
> covered by the extension catch or you must add the prefix to `patch-worker.cjs`.

Workers mode (prod) needs none of this — the `[assets]` binding handles it. The patch is a no-op there.

### ikkxa-dev Pages build command (dashboard → Settings → Build)
```
npx @opennextjs/cloudflare@1.3.0 build \
  && cp -r .open-next/assets/. .open-next/ \
  && npm run cf:patch-worker \
  && mv .open-next/worker.js .open-next/_worker.js
```
Build output dir: `.open-next`. Compat date `2025-04-01`, flag `nodejs_compat`.

## Constraints & common failure modes

- **Per-file limit 25 MiB**, max ~20,000 files per Cloudflare deployment. Large media must stay under 25 MiB.
- **The file must be committed to the deployed branch.** A `public/` asset present on `development`
  but not on `main` will 404 on production even though the code references it. (This is exactly why
  `magnific_…mp4` worked on dev but 404'd on prod — it was not on `main`.)
- **Same-filename replacement can be edge/browser cached.** To force a refresh, rename the file or
  add a `?v=2` query — do not just overwrite in place.
- Videos: Cloudflare's edge adds HTTP range support for static assets automatically. `wrangler pages
  dev` locally may return `200` instead of `206` for range requests — that's a local-emulation quirk.

## Build / verify locally
```
npx opennextjs-cloudflare build   # produces .open-next/
npm run cf:patch-worker           # applies the Pages static-asset patch to worker.js
# Serve Pages-mode build exactly like the dashboard command:
cp -r .open-next/assets/. .open-next/ && cp .open-next/worker.js .open-next/_worker.js
npx wrangler pages dev .open-next --compatibility-date=2025-04-01 --compatibility-flags nodejs_compat
```
`.open-next/` and `.wrangler/` are build artifacts — gitignored, never commit them.

## Env vars
- `NEXT_PUBLIC_*` are inlined at **build time** by webpack, so they live in `next.config.js`'s `env`
  block (Cloudflare `[vars]` are runtime-only and not available to `next build`).
- Server-side secrets (`NEXTAUTH_SECRET`, `GOOGLE_CLIENT_SECRET`, Moyasar keys, `NEXT_PUBLIC_API_KEY`)
  are stored as encrypted values in each Cloudflare project's dashboard, not in the repo.
