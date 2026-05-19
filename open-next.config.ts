import { defineCloudflareConfig } from '@opennextjs/cloudflare';

export default defineCloudflareConfig({
  tagCache: 'dummy',
  queue: 'dummy',
});
