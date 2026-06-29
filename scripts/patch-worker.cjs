/**
 * patch-worker.cjs
 *
 * Patches .open-next/worker.js to serve /_next/static/ and /_next/media/
 * assets via the Cloudflare Pages ASSETS binding BEFORE passing the request
 * to the Next.js SSR handler.
 *
 * WHY THIS IS NEEDED:
 *   @opennextjs/cloudflare is designed for Cloudflare Workers + Static Assets
 *   deployment (wrangler.toml using `main` + `[assets]`).  In that model,
 *   Cloudflare's routing layer intercepts requests for files that exist in the
 *   assets directory (/_next/static/, favicon.ico, etc.) and serves them
 *   BEFORE the Worker script ever runs.
 *
 *   When deployed on Cloudflare Pages in Advanced Mode (_worker.js), ALL
 *   requests – including /_next/static/ – go through the Worker.  The
 *   worker.js template only calls env.ASSETS for image-optimization routes
 *   (/cdn-cgi/image/ and /_next/image), so /_next/static/ falls through to
 *   the Next.js SSR handler which returns 404.
 *
 *   This script injects an env.ASSETS check for static asset paths BEFORE the
 *   dynamic import of the SSR handler, making the Worker correctly serve
 *   static files from the Cloudflare Pages asset store.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const workerPath = path.join(process.cwd(), '.open-next', 'worker.js');

if (!fs.existsSync(workerPath)) {
  console.error(`ERROR: ${workerPath} not found. Run the OpenNext build first.`);
  process.exit(1);
}

const original = fs.readFileSync(workerPath, 'utf8');

// The exact string to find – verbatim from the worker.js template that
// @opennextjs/cloudflare copies into .open-next/worker.js
const SEARCH = `// @ts-expect-error: resolved by wrangler build
            const { handler } = await import("./server-functions/default/handler.mjs");`;

if (!original.includes(SEARCH)) {
  console.error(
    'ERROR: Could not locate the dynamic handler import in worker.js.\n' +
    'The OpenNext worker template may have changed in this version.\n' +
    'Search string:\n' + SEARCH
  );
  process.exit(1);
}

const STATIC_ASSET_HANDLER = `\
            // ── Cloudflare Pages static-asset fix ─────────────────────────────────────
            // OpenNext v1.3.x relies on Cloudflare Workers+Assets routing to serve
            // /_next/static/ before the Worker runs.  In Pages Advanced Mode every
            // request reaches the Worker, so we must proxy static paths to ASSETS here.
            if (env.ASSETS) {
                if (
                    url.pathname.startsWith('/_next/static/') ||
                    url.pathname.startsWith('/_next/media/')
                ) {
                    const assetResponse = await env.ASSETS.fetch(request.clone());
                    if (assetResponse.status !== 404) return assetResponse;
                }
            }
            // ─────────────────────────────────────────────────────────────────────────
            `;

const patched = original.replace(SEARCH, STATIC_ASSET_HANDLER + SEARCH);

fs.writeFileSync(workerPath, patched, 'utf8');
console.log('✅  worker.js patched: /_next/static/ and /_next/media/ will be served from ASSETS binding');
