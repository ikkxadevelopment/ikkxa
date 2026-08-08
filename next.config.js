// import createNextIntlPlugin from 'next-intl/plugin';
// // const withNextIntl = require('next-intl/plugin')();
// const withNextIntl = createNextIntlPlugin();
// const createNextIntlPlugin = require('next-intl/plugin');
 
// const withNextIntl = createNextIntlPlugin();
const withNextIntl = require('next-intl/plugin')('./src/i18n/request.js');

// Only active when ANALYZE=true (local perf audits); a no-op for normal and
// Cloudflare builds. Run: `ANALYZE=true npx next build`.
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
    openAnalyzer: false,
});
/** @type {import('next').NextConfig} */
const nextConfig = {
    // NEXT_PUBLIC_* vars are inlined at build time by webpack.
    // They must be present here (or in a tracked .env file) because
    // Cloudflare Pages wrangler.toml [vars] are runtime-only and are
    // NOT available to `next build` for static inlining.
    env: {
        NEXT_PUBLIC_BASE_URL: 'https://www.ikkxa.com/web-api/',
        NEXT_PUBLIC_BASE_URL_IMG: 'https://www.ikkxa.com/public/',
        // Country-dynamic API hosts — selected per request from the
        // NEXT_LOCALE cookie (SA → ksa, AE → uae). See src/utils/fetcher.js
        // and src/app/api/auth/[...nextauth]/route.js (getBaseUrlFromLocale).
        NEXT_PUBLIC_API_BASE_URL_AE: 'https://uae.ikkxa.com/web-api/',
        NEXT_PUBLIC_API_BASE_URL_SA: 'https://ksa.ikkxa.com/web-api/',
        // NEXT_PUBLIC_MOYASAR_PUBLIC_API_KEY and NEXT_PUBLIC_MOYASAR_SECRET_API_KEY
        // use pk_live_/sk_live_ prefixes that trigger GitHub push-protection.
        // They are set as encrypted Secrets in the Cloudflare Pages dashboard
        // (Settings → Variables and Secrets) so they are injected at both
        // build time and runtime without being committed to the repo.
        //
        // NEXT_PUBLIC_API_KEY is similarly managed as a Dashboard Secret.
        // If any of these are absent at build time the values will be undefined
        // but the application will still load; payment/API features will degrade.
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'test.ikkxa.com',
                port: '',
            },{
                protocol: 'https',
                hostname: 'ksa.ikkxa.com',
                port: '',
            },{
                protocol: 'https',
                hostname: 'uae.ikkxa.com',
                port: '',
            },{
                protocol: 'https',
                hostname: 'www.ikkxa.com',
                port: '',
            },
            
        ],
        formats: ['image/webp'],
        // Trim the very large breakpoints — no storefront image needs 2K/4K
        // srcset candidates. Fewer variants = fewer optimizer transforms and
        // smaller srcset payloads (DEV-12).
        deviceSizes: [640, 750, 828, 1080, 1200, 1920],
        imageSizes: [32, 64, 128, 256, 384],
        // Cache optimized images at the edge for 24h instead of the 60s default.
        minimumCacheTTL: 60 * 60 * 24,
    },
};

// export default nextConfig;
// export default withNextIntl(nextConfig);
module.exports = withBundleAnalyzer(withNextIntl(nextConfig));

// const withNextIntl = require('next-intl/plugin')('./src/i18n/request.js');

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   i18n: {
//     locales: ['en', 'ar'], // Support both languages in each domain
//     defaultLocale: 'en',   // Default locale for the primary domain
//     domains: [
//       {
//         domain: 'example.com',  // English domain
//         defaultLocale: 'en',
//       },
//       {
//         domain: 'example.ae',   // Arabic domain
//         defaultLocale: 'ar',
//       },
//     ],
//   },
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'test.ikkxa.com',
//         port: '',
//       },
//       {
//         protocol: 'https',
//         hostname: 'www.ikkxa.com',
//         port: '',
//       },
//     ],
//     formats: ['image/webp'],
//   },
// };

// module.exports = withNextIntl(nextConfig);

