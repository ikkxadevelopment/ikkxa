import { defineCloudflareConfig } from '@opennextjs/cloudflare';

const config = defineCloudflareConfig({
  tagCache: 'dummy',
  queue: 'dummy',
});

// `npm run build` (scripts/build.cjs) itself runs OpenNext inside Workers
// Builds, so OpenNext must call Next directly to avoid recursing into it.
export default { ...config, buildCommand: 'npx next build' };
