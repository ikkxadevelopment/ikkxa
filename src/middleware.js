import { getToken } from "next-auth/jwt";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { NextResponse } from "next/server";

const middleware = async (req, ev) => {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const protectedPaths = ['/profile', '/orders'];
  const isProtectedRoute = protectedPaths.some((path) =>
    req.nextUrl.pathname.includes(path)
  );

  // Check geo location
  const countryCode = req.geo?.country || 'SA'; // Default to Saudi Arabia if geo is unavailable


  const currentLocale = req.nextUrl.pathname.startsWith('/ar') ? 'ar' : 'en';
  const newPathname = `/${currentLocale}-${countryCode}`;

  // if (!req.nextUrl.pathname.startsWith(newPathname)) {
  //   return NextResponse.redirect(new URL(newPathname, req.url));
  // }

  return createMiddleware(routing)(req, ev);
};

export default middleware;

export const config = {
  matcher: [
    '/',
    '/(en-SA|en-AR|ar-SA|ar-AE)/:path*',
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
};

/*-------------------last one start--------------*/
// import { NextResponse } from "next/server";
// import { getToken } from "next-auth/jwt";
// import createMiddleware from "next-intl/middleware";
// import { routing } from "@/i18n/routing";

// const middleware = async (req, ev) => {
//   const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

//   const protectedPaths = ['/profile', '/orders'];
//   const isProtectedRoute = protectedPaths.some((path) =>
//     req.nextUrl.pathname.includes(path)
//   );

//   // 1. Check if manual country is set in cookie
//   const manualCountry = req.cookies.get("country")?.value;

//   // 2. Use manual country if available, otherwise use geo country
//   const countryCode = manualCountry || req.geo?.country || 'SA'; // Default to SA
//   const currentLocale = req.nextUrl.pathname.startsWith('/ar') ? 'ar' : 'en';

//   const newPathname = `/${currentLocale}-${countryCode}`;

//   // 3. Redirect if not already on the right locale-country path
//   const expectedPrefix = `/${currentLocale}-${countryCode}`;
//   if (!req.nextUrl.pathname.startsWith(expectedPrefix)) {
//     const cleanedPath = req.nextUrl.pathname.replace(/^\/(en|ar)(-[A-Z]{2})?/, '');
//     const redirectUrl = new URL(expectedPrefix + cleanedPath, req.url);
//     return NextResponse.redirect(redirectUrl);
//   }

//   return createMiddleware(routing)(req, ev);
// };

// export default middleware;

// export const config = {
//   matcher: [
//     '/',
//     '/(en-SA|en-AE|ar-SA|ar-AE)/:path*',
//     '/((?!api|_next|_vercel|.*\\..*).*)'
//   ]
// };
/*--------------Last one end---------------------*/




// import createMiddleware from 'next-intl/middleware';
// import {routing} from '@/i18n/routing';

// export default createMiddleware(routing);

// export const config = {
//   matcher: [
//     // Enable a redirect to a matching locale at the root
//     '/',

//     // Set a cookie to remember the previous locale for
//     // all requests that have a locale prefix
//     '/(ar|en)/:path*',

//     // Enable redirects that add missing locales
//     // (e.g. `/pathnames` -> `/en/pathnames`)
//     '/((?!api|_next|_vercel|.*\\..*).*)'
//   ]
// };


// import { getToken } from "next-auth/jwt";
// import createMiddleware from "next-intl/middleware";
// import { routing } from "@/i18n/routing";
// import { NextResponse } from "next/server";

// const middleware = async (req, ev) => {
//   const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

//   const protectedPaths = ['/profile','/orders'];
//   const isProtectedRoute = protectedPaths.some((path) =>
//     req.nextUrl.pathname.includes(path)
//   );

//   // console.log("Request URL:", req.nextUrl.pathname);
//   // console.log("Token value:", token);
//   // console.log("isProtectedRoute:", isProtectedRoute);

//   //   if (isProtectedRoute) {
//   //     console.log("in side of isProtectedRoute");
//   //     if (token === null) {
//   //       console.log("inside of token");
//   //       const redirectUrl = new URL('/', req.url);
//   //       console.log("Redirecting to:", redirectUrl);
//   //       return NextResponse.redirect(redirectUrl);
//   //     }
//   // }

//   return createMiddleware(routing)(req, ev);
// };

// export default middleware;

// export const config = {
//   matcher: [
//     '/',
//     '/(ar|en)/:path*',
//     '/((?!api|_next|_vercel|.*\\..*).*)'
//   ]
// };


// import createMiddleware from 'next-intl/middleware';
 
// export default createMiddleware({
//   locales: ['ar', 'en'],
//   localeDetection: false,
//   defaultLocale: 'en'
// });
 
// export const config = {
//   // Match only internationalized pathnames
//   matcher: ['/', '/(ar|en)/:path*']
// };

// export { auth as middleware } from "@/auth"

// import { getToken } from "next-auth/jwt";
// import createMiddleware from "next-intl/middleware";
// import { routing } from "@/i18n/routing";
// import { NextResponse } from "next/server";

// const middleware = async (req, ev) => {
//   const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

//   const protectedPaths = ['/profile', '/orders'];
//   const isProtectedRoute = protectedPaths.some((path) =>
//     req.nextUrl.pathname.includes(path)
//   );

//   // Parse the current URL path
//   const pathname = req.nextUrl.pathname;
  
//   // Skip middleware for static files and API routes
//   if (
//     pathname.includes('._next') || 
//     pathname.includes('/api/') ||
//     pathname.match(/\.(.*)$/)
//   ) {
//     return NextResponse.next();
//   }

//   // Extract locale and country from URL if present
//   const urlPattern = /^\/(en|ar)-(SA|AE)/;
//   const match = pathname.match(urlPattern);

//   // If URL already has valid locale-country pattern, proceed
//   if (match) {
//     return createMiddleware(routing)(req, ev);
//   }
  
//   // Determine country based on geolocation
//   const geoCountry = req.geo?.country;
//   const countryCode = geoCountry === 'AE' ? 'AE' : 'SA';

//   // Set default locale
//   const defaultLocale = 'en';
  
//   // Build the new pathname with geolocation-based country
//   const newPathname = `/${defaultLocale}-${countryCode}${pathname === '/' ? '' : pathname}`;
//   const url = new URL(newPathname, req.url);
//   url.search = req.nextUrl.search;
//   return NextResponse.redirect(url);
// };

// export default middleware;

// export const config = {
//   matcher: [
//     '/',
//     '/(en|ar)-(SA|AE)/:path*',
//     '/((?!api|_next|_vercel|.*\\..*).*)'
//   ]
// };


// import { getToken } from "next-auth/jwt";
// import createMiddleware from "next-intl/middleware";
// import { routing } from "@/i18n/routing";
// import { NextResponse } from "next/server";

// const middleware = async (req, ev) => {
//   const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

//   const protectedPaths = ['/profile', '/orders'];
//   const isProtectedRoute = protectedPaths.some((path) =>
//     req.nextUrl.pathname.includes(path)
//   );

//   if (isProtectedRoute && !token) {
//     return NextResponse.redirect(new URL('/', req.url));
//   }

//   const countryCode = req.geo?.country || 'SA'; 
//   const validCountries = ['SA', 'AE'];

//   const validLocales = ['ar', 'en'];
//   const currentLocale = req.nextUrl.pathname.startsWith('/ar') ? 'ar' : 'en';
  
//   const pathLocaleMatch = req.nextUrl.pathname.match(/^\/(ar|en)-(SA|AE)/);

//   if (pathLocaleMatch) {
//     return createMiddleware(routing)(req, ev);
//   }

//   const locale = validLocales.includes(currentLocale) ? currentLocale : 'en';
//   const country = validCountries.includes(countryCode) ? countryCode : 'SA';
//   const newPathname = `/${locale}-${country}${req.nextUrl.pathname}`;

//   return NextResponse.redirect(new URL(newPathname, req.url));
// };

// export default middleware;

// export const config = {
//   matcher: [
//     '/', 
//     '/((?!api|_next|_vercel|.*\\..*).*)' 
//   ]
// };
