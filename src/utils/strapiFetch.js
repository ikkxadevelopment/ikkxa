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
//
// Even through Cloudflare's proxy the firewall still blocks some Worker
// requests, so blocked requests are retried and, if still blocked, answered
// from a 24h copy of the last good response instead of 404 / an empty page.
const edgeCache =
    typeof navigator !== "undefined" &&
    navigator.userAgent === "Cloudflare-Workers" &&
    typeof caches !== "undefined"
        ? caches.default
        : null;
const EDGE_CACHE_TTL = 60;
// Last good copy, served when the backend refuses the Worker.
const STALE_CACHE_TTL = 60 * 60 * 24;
const RETRY_DELAYS_MS = [300, 800];

// The firewall's blocks are intermittent ("403 Blocked", 429, Cloudflare
// 52x), so these are worth retrying. Real API errors (404/422 "Product not
// found") are not, and must never be answered from the stale copy.
const isBlocked = (status) => status === 403 || status === 429 || status >= 500;

const fetchWithRetry = async (url, requestHeaders) => {
    let res;
    for (let attempt = 0; ; attempt++) {
        try {
            res = await fetch(url, { method: "GET", headers: requestHeaders });
        } catch {
            // Network error / connection reset: treat like a 503.
            res = new Response(null, { status: 503 });
        }
        if (!isBlocked(res.status) || attempt >= RETRY_DELAYS_MS.length) return res;
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAYS_MS[attempt]));
    }
};

const fetchEdgeCached = async (url, requestHeaders) => {
    const key = new Request(url);
    const staleKey = new Request(`${url}${url.includes("?") ? "&" : "?"}__stale=1`);
    const hit = await edgeCache.match(key);
    if (hit) return hit;

    const res = await fetchWithRetry(url, requestHeaders);
    if (!res.ok) {
        if (isBlocked(res.status)) {
            const stale = await edgeCache.match(staleKey);
            if (stale) return stale;
        }
        return res;
    }

    // Buffer the body once instead of tee-ing the stream (clone() + put()
    // stalls when the same URL is fetched concurrently, e.g. by
    // generateMetadata and the page).
    const body = await res.text();
    const contentType = res.headers.get("Content-Type") || "application/json";
    const cacheFor = (ttl) => ({ "Content-Type": contentType, "Cache-Control": `public, max-age=${ttl}` });
    await Promise.all([
        edgeCache.put(key, new Response(body, { headers: cacheFor(EDGE_CACHE_TTL) })),
        edgeCache.put(staleKey, new Response(body, { headers: cacheFor(STALE_CACHE_TTL) })),
    ]);
    return new Response(body, { headers: cacheFor(EDGE_CACHE_TTL) });
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
