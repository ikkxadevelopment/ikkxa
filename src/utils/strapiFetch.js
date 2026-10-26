import getBaseUrl from "@/hooks/getBaseUrl";
import qs from "qs";

// On Cloudflare Workers every visitor's SSR request reaches the backend
// (Hostinger shared hosting) from the same few Cloudflare IPs, and its firewall
// bans them for a few minutes after ~20 uncached hits ("403 Blocked" → empty
// home page / 404 product pages). Cache public GETs at the Cloudflare edge so
// the backend sees ~1 request per URL per minute instead of one per visitor.
// Vercel/Node keep the original no-store behaviour.
//
// This uses the Cache API rather than fetch's `cf.cacheTtl`: the backend sends
// `Set-Cookie: ikkxa_session=...` on every API response, and Cloudflare never
// caches a response that sets a cookie. The cached copy is stored without it.
const edgeCache =
    typeof navigator !== "undefined" &&
    navigator.userAgent === "Cloudflare-Workers" &&
    typeof caches !== "undefined"
        ? caches.default
        : null;
const EDGE_CACHE_TTL = 60;

const fetchEdgeCached = async (url, requestHeaders) => {
    const key = new Request(url);
    const hit = await edgeCache.match(key);
    if (hit) return hit;

    const res = await fetch(url, { method: "GET", headers: requestHeaders });
    if (!res.ok) return res;

    // Buffer the body once instead of tee-ing the stream (clone() + put()
    // stalls when the same URL is fetched concurrently, e.g. by
    // generateMetadata and the page).
    const body = await res.text();
    const headers = {
        "Content-Type": res.headers.get("Content-Type") || "application/json",
        "Cache-Control": `public, max-age=${EDGE_CACHE_TTL}`,
    };
    await edgeCache.put(key, new Response(body, { headers }));
    return new Response(body, { headers });
};

const strapiFetch = async (slug, urlParamsObject, options, country) => {
      const baseUrl = getBaseUrl(country);
    const queryString = qs.stringify(urlParamsObject);
    const url = `${baseUrl}${slug}${queryString ? `?${queryString}` : ""}`;
    // const res = await fetch(
    //     `${process.env.NEXT_PUBLIC_BASE_URL}${slug}${queryString ? `?${queryString}` : ""}`,
    //     { ...options }
    // );

    // Never edge-cache per-user responses.
    const isPublicGet =
        (!options?.method || options.method.toUpperCase() === "GET") &&
        !options?.headers?.Authorization;

    const res = edgeCache && isPublicGet
        ? await fetchEdgeCached(url, options?.headers)
        : await fetch(url, { ...options });

    // console.log(`${process.env.NEXT_PUBLIC_BASE_URL}${slug}${queryString ? `?${queryString}` : ""}`,"link");

    if (!res.ok) {
        return undefined;
    }

    return res.json();
};

export default strapiFetch;
