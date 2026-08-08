import { headers } from "next/headers";

// Only the public production hosts are allowed to be crawled. Every other host
// that serves this app — dev.ikkxa.com, test.ikkxa.com, pos.ikkxa.com, preview
// deployments, localhost — must fully disallow crawling (DEV-06). The dev
// deployment runs the same codebase, so a static prod robots.txt would let
// Google index dev; keying off the request host fixes that on every deploy.
const PROD_HOSTS = ["www.ikkxa.com", "ikkxa.com"];

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
          // Private / transactional routes
          "/wishlist",
          "/cart",
          "/profile",
          "/orders",
          "/manage-addresses",
          "/checkout",
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
