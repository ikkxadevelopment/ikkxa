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

### Reference assets by root-relative path
- Use `/images/foo.png`, **not** `` `${process.env.NEXT_PUBLIC_BASE_URL_IMG}images/foo.png` ``.
  Public assets ship with the deployment and are served from the same origin.
- Images rendered through `next/image` go through the `/_next/image?url=...` optimizer, which the
  worker handles separately from the static-asset path below.

## Two Cloudflare Workers (dev + prod)

| | dev.ikkxa.com | shop.ikksa.com (prod) |
|---|---|---|
| Branch | `development` | `main` |
| CF Worker | `ikkxa-dev` | `ikkxa-production` |
| wrangler.toml | `[env.dev]` section | top-level config |
| Backend (build time) | `test.ikkxa.com` | live `ksa` / `uae` hosts |
| `NEXTAUTH_URL` | `https://dev.ikkxa.com` | `https://shop.ikksa.com` |

Both use **Workers + Static Assets** (`[assets]` binding): Cloudflare serves `public/` and
`_next/static` natively before the worker runs. Both auto-deploy on push via Cloudflare Workers
Builds (separate from `.github/workflows/deploy.yml`, the unrelated VPS/Docker pipeline).

### Dashboard build settings (each Worker → Settings → Build)
Both Workers use the **default** commands: build `npm run build`, deploy `npx wrangler deploy`.
- `npm run build` is `scripts/build.cjs`: inside Workers Builds (`WORKERS_CI` set) it runs
  `opennextjs-cloudflare build`; elsewhere (Vercel, Docker, local) plain `next build`.
  `open-next.config.ts` sets `buildCommand: 'npx next build'` so OpenNext doesn't recurse into it.
- **ikkxa-dev** additionally needs the build variable `CLOUDFLARE_ENV=dev` (Settings → Build →
  Variables) so `wrangler deploy` targets `[env.dev]`. Without it, it deploys the top-level (prod) config.
- The `ikkxa-dev` Worker's name must match `[env.dev] name` in `wrangler.toml`.
- `vars` are not inherited by wrangler environments, so `[env.dev.vars]` repeats them.
  Secrets are set per Worker in the dashboard.
- Failure signature of a plain `next build`: `Open Next build not found` at deploy.

### Legacy: Pages mode
dev used to be a Pages project (`ikkxa-dev`, Advanced Mode `_worker.js`). `wrangler.pages.toml`
and `scripts/patch-worker.cjs` (which proxied static paths to `env.ASSETS`) only exist for that
setup and are not used by the Workers deployments.

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
WORKERS_CI_BRANCH=development npx opennextjs-cloudflare build   # dev build (test backend)
npx wrangler deploy --dry-run --env dev                         # check dev bindings
npx opennextjs-cloudflare build && npx wrangler deploy --dry-run   # prod
npx opennextjs-cloudflare preview                               # run the worker locally
```
`.open-next/` and `.wrangler/` are build artifacts — gitignored, never commit them.

## Env vars
- `NEXT_PUBLIC_*` are inlined at **build time** by webpack, so they live in `next.config.js`'s `env`
  block (Cloudflare `[vars]` are runtime-only and not available to `next build`).
- Backend hosts: `next.config.js` picks `test.ikkxa.com` when `WORKERS_CI_BRANCH=development` (set by
  Workers Builds on the dev Worker; `CF_PAGES=1` kept for the legacy Pages project) and the live
  `uae`/`ksa`/`www` hosts otherwise.
- Server-side secrets (`NEXTAUTH_SECRET`, `GOOGLE_CLIENT_SECRET`, Moyasar keys, `NEXT_PUBLIC_API_KEY`)
  are stored as encrypted values in each Cloudflare project's dashboard, not in the repo.
