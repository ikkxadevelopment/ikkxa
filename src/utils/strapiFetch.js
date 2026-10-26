import getBaseUrl from "@/hooks/getBaseUrl";
import qs from "qs";

// On Cloudflare Workers every visitor's SSR request reaches the backend
// (Hostinger shared hosting) from the same few Cloudflare IPs, and its firewall
// bans them for a few minutes after ~20 uncached hits ("403 Blocked" → empty
// home page / 404 product pages). Cache public GETs at the Cloudflare edge so
// the backend sees ~1 request per URL per minute instead of one per visitor.
// Vercel/Node keep the original no-store behaviour.
const isCloudflareWorker =
    typeof navigator !== "undefined" && navigator.userAgent === "Cloudflare-Workers";
const EDGE_CACHE_TTL = 60;

const strapiFetch = async (slug, urlParamsObject, options, country) => {
      const baseUrl = getBaseUrl(country);
    const queryString = qs.stringify(urlParamsObject);
    // const res = await fetch(
    //     `${process.env.NEXT_PUBLIC_BASE_URL}${slug}${queryString ? `?${queryString}` : ""}`,
    //     { ...options }
    // );

    // Never edge-cache per-user responses.
    const isPublicGet =
        (!options?.method || options.method.toUpperCase() === "GET") &&
        !options?.headers?.Authorization;
    const init = isCloudflareWorker && isPublicGet
        ? {
            method: "GET",
            headers: options?.headers,
            cf: { cacheTtl: EDGE_CACHE_TTL, cacheEverything: true },
        }
        : { ...options };

    const res = await fetch(
        `${baseUrl}${slug}${queryString ? `?${queryString}` : ""}`,
        init
    );

    // console.log(`${process.env.NEXT_PUBLIC_BASE_URL}${slug}${queryString ? `?${queryString}` : ""}`,"link");

    if (!res.ok) {
        return undefined;
    }

    return res.json();
};

export default strapiFetch;
