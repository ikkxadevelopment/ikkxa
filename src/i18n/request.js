import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  // Validate that the incoming `locale` parameter is valid
  let locale = await requestLocale;
  // if (!routing.locales.includes(locale)) notFound();
   if (!locale || !routing.locales.includes(locale)) {
       locale = routing.defaultLocale;
    }
  const currentLocale = locale?.split(",")[0]?.split("-")[0]
  return {
    locale,
    messages: (
      await (currentLocale === 'en'
        ? // When using Turbopack, this will enable HMR for `en`
          import('../../messages/en.json')
        : import(`../../messages/${currentLocale}.json`))
    ).default
  };
});


// + import {routing} from './i18n/routing';
 
// export default getRequestConfig(async ({
// -  locale
// +  requestLocale
// }) => {
// +  // This typically corresponds to the `[locale]` segment
// +  let locale = await requestLocale;
 
// -  // Validate that the incoming `locale` parameter is valid
// -  if (!routing.locales.includes(locale as any)) notFound();
// +  // Ensure that the incoming locale is valid
// +  if (!locale || !routing.locales.includes(locale as any)) {
// +    locale = routing.defaultLocale;
// +  }
 
//   return {
// +    locale,
//     // ...
//   };
// });

// import {getRequestConfig} from 'next-intl/server';
// import {routing} from '@/i18n/routing';
 
// export default getRequestConfig(async ({requestLocale}) => {
//   // This typically corresponds to the `[locale]` segment.
//   let locale = await requestLocale;
 
//   // Ensure that a valid locale is used
//   if (!locale || !routing.locales.includes(locale as any)) {
//     locale = routing.defaultLocale;
//   }
 
//   return {
//     locale,
//     messages: (await import(`../../messages/${locale}.json`)).default
//   };
// });