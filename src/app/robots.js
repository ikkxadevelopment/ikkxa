import { headers } from "next/headers";

// Only the public production hosts are allowed to be crawled. Every other host
// that serves this app — dev.ikkxa.com, test.ikkxa.com, pos.ikkxa.com, preview
// deployments, localhost — must fully disallow crawling (DEV-06). The dev
// deployment runs the same codebase, so a static prod robots.txt would let
// Google index dev; keying off the request host fixes that on every deploy.
const PROD_HOSTS = ["www.ikkxa.com", "ikkxa.com"];

// Every real URL carries a locale prefix (/en-SA/cart), so the private routes
// must be blocked under each prefix too, not just at the bare path.
const LOCALES = ["en-SA", "ar-SA", "en-AE", "ar-AE"];
const PRIVATE_PATHS = [
  "/wishlist",
  "/cart",
  "/profile",
  "/orders",
  "/manage-addresses",
  "/checkout",
  "/account",
  "/change-password",
  "/login",
];
const privateDisallows = PRIVATE_PATHS.flatMap((p) => [
  p,
  ...LOCALES.map((l) => `/${l}${p}`),
]);

export default function robots() {
  const host = (headers().get("host") || "").split(":")[0].toLowerCase();
  const isProd = PROD_HOSTS.includes(host);

  if (!isProd) {
    // Non-production: block everything, advertise no sitemap.
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        disallow: [
          // Private / transactional routes, bare and locale-prefixed
          ...privateDisallows,
          // Faceted / param URLs — canonical is the clean category (DEV-03)
          "/*?*sort=",
          "/*?*filter=",
          "/*?*color=",
          // Next.js image optimizer endpoint
          "/_next/image",
        ],
      },
    ],
    sitemap: [
      "https://www.ikkxa.com/sitemap/en-SA.xml",
      "https://www.ikkxa.com/sitemap/ar-SA.xml",
      "https://www.ikkxa.com/sitemap/en-AE.xml",
      "https://www.ikkxa.com/sitemap/ar-AE.xml",
    ],
  };
}
