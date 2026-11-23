// TEMPORARY diagnostic (remove after use): shows what the backend answers to
// this deployment's own server-side requests. Disabled on production hosts.
const PROD_HOSTS = ["www.ikkxa.com", "ikkxa.com", "shop.ikkxa.com"];

export const dynamic = "force-dynamic";

export async function GET(req) {
  const host = (req.headers.get("host") || "").split(":")[0].toLowerCase();
  if (PROD_HOSTS.includes(host)) return new Response("Not found", { status: 404 });

  const base = process.env.NEXT_PUBLIC_API_BASE_URL_SA || process.env.NEXT_PUBLIC_BASE_URL;
  const slug = new URL(req.url).searchParams.get("slug") || "embroidered-modern-jalabiya-test1-uzgij";
  const key = process.env.STOREFRONT_API_KEY;
  const out = { base, keyPresent: !!key, keyLength: key ? key.length : 0, results: [] };

  for (const withKey of [false, true]) {
    const url = `${base}home/product-details/${slug}?lang=en`;
    try {
      const res = await fetch(url, {
        headers: withKey && key ? { "X-Storefront-Key": key } : {},
      });
      const body = await res.text();
      const pick = ["server", "x-ratelimit-limit", "x-ratelimit-remaining", "retry-after", "cf-ray", "content-type"];
      out.results.push({
        withKey,
        status: res.status,
        headers: Object.fromEntries(pick.map((h) => [h, res.headers.get(h)])),
        body: body.slice(0, 300),
      });
    } catch (e) {
      out.results.push({ withKey, error: String(e) });
    }
  }
  return Response.json(out, { headers: { "Cache-Control": "no-store" } });
}
