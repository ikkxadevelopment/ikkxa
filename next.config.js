// import createNextIntlPlugin from 'next-intl/plugin';
// // const withNextIntl = require('next-intl/plugin')();
// const withNextIntl = createNextIntlPlugin();
// const createNextIntlPlugin = require('next-intl/plugin');
 
// const withNextIntl = createNextIntlPlugin();
const withNextIntl = require('next-intl/plugin')('./src/i18n/request.js');
/** @type {import('next').NextConfig} */
const nextConfig = {
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

