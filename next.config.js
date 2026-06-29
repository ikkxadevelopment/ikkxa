// import createNextIntlPlugin from 'next-intl/plugin';
// // const withNextIntl = require('next-intl/plugin')();
// const withNextIntl = createNextIntlPlugin();
// const createNextIntlPlugin = require('next-intl/plugin');
 
// const withNextIntl = createNextIntlPlugin();
const withNextIntl = require('next-intl/plugin')('./src/i18n/request.js');
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
    },
};

// export default nextConfig;
// export default withNextIntl(nextConfig);
module.exports = withNextIntl(nextConfig);

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

