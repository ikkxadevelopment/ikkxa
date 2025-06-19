
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const middleware = async (req, ev) => {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const protectedPaths = ['/profile', '/orders'];
  const isProtectedRoute = protectedPaths.some((path) =>
    req.nextUrl.pathname.includes(path)
  );

  // Extract current locale & country from the URL (e.g., /en-SA)
  const pathname = req.nextUrl.pathname;
  const localeCountryMatch = pathname.match(/^\/(en|ar)-([A-Z]{2})/);
  const urlLocale = localeCountryMatch?.[1] || 'en';
  const urlCountry = localeCountryMatch?.[2];

  // 1. Check cookie (manual override)
  const cookieCountry = req.cookies.get("country")?.value;

  // 2. Check geo (if no cookie)
  const geoCountry = req.geo?.country || 'SA';

  const finalCountry = urlCountry || cookieCountry || geoCountry;
  const expectedPrefix = `/${urlLocale}-${finalCountry}`;

  // Allow request to proceed if URL already has correct locale-country
  if (pathname.startsWith(expectedPrefix)) {
    const response = createMiddleware(routing)(req, ev);

    // Set cookie if not present but URL includes country
    if (!cookieCountry && urlCountry) {
      response.cookies.set("country", urlCountry, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365, // 1 year
      });
    }

    return response;
  }

  // Only redirect if URL doesn't have locale-country
  const cleanedPath = pathname.replace(/^\/(en|ar)(-[A-Z]{2})?/, '');
  const redirectUrl = new URL(`${expectedPrefix}${cleanedPath}`, req.url);
  const response = NextResponse.redirect(redirectUrl);

  // Set cookie for first time
  if (!cookieCountry && urlCountry) {
    response.cookies.set("country", urlCountry, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  return response;
};

export default middleware;

export const config = {
  matcher: [
    '/',
    '/(en-SA|en-AE|ar-SA|ar-AE)/:path*',
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
};
