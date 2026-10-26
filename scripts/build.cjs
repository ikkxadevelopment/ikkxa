/**
 * build.cjs — `npm run build`
 *
 * Cloudflare Workers Builds (ikkxa-dev / ikkxa-production) run `npm run build`
 * then `npx wrangler deploy` by default. A plain `next build` leaves no
 * .open-next/ and the deploy fails with "Open Next build not found", so in
 * Workers Builds this runs the OpenNext build instead.
 *
 * Everywhere else (Vercel, Docker, local) it is a plain `next build`.
 * OpenNext's own inner build uses `npx next build` (open-next.config.ts
 * buildCommand), so this script is not re-entered.
 */
const { execSync } = require("node:child_process");

const inWorkersBuilds = Boolean(process.env.WORKERS_CI || process.env.WORKERS_CI_BRANCH);
const command = inWorkersBuilds ? "npx opennextjs-cloudflare build" : "npx next build";

console.log(`[build] ${inWorkersBuilds ? "Cloudflare Workers Builds" : "standard"} → ${command}`);
execSync(command, { stdio: "inherit" });
