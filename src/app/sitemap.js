// app/sitemap/[id]/route.js
import { escape } from "lodash";
import { TAG_ARCHIVES, MIN_TAG_PRODUCTS } from "@/config/tagArchives";
import { getTagProducts } from "@/lib/getHome";

export async function generateSitemaps() {
  return [
    { id: 'en-SA' },
    { id: 'ar-SA' },
    { id: 'en-AE' },
    { id: 'ar-AE' },
  ];
}

const NON_INDEXABLE_PATHS = ['store-list'];

function getApiUrl(region) {
  const baseUrls = {
    sa: 'https://ksa.ikkxa.com/web-api/site-map',
    ae: 'https://uae.ikkxa.com/web-api/site-map',
  };
  return baseUrls[region] || baseUrls.sa; // Fallback to SA if region not found
}

function cleanUrlPath(path) {
  if (!path || typeof path !== 'string') return '';
  
  try {
    return path
      .replace(/^\/(en|ar)-(SA|AE)/, '')
      .replace(/^\/+|\/+$/g, '') || '';
  } catch (error) {
    console.error('Error cleaning URL path:', error);
    return '';
  }
}

export default async function sitemap({ id }) {
  // Validate id parameter
  if (!id || typeof id !== 'string') {
    console.error('Invalid id parameter:', id);
    return [];
  }

  const [locale, country] = id.split('-');
  
  // Validate locale and country
  if (!locale || !country) {
    console.error('Invalid locale or country:', { locale, country });
    return [];
  }

  const region = country.toLowerCase();
  const baseApiUrl = getApiUrl(region);

  try {
    const response = await fetch(baseApiUrl, {
      next: { revalidate: 0 },
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch sitemap: ${response.status}`);
    }

    const data = await response.json();
    
    // Validate data structure
    if (!data || !data.results || !Array.isArray(data.results.urls)) {
      console.warn('Invalid data structure received from API');
      return [
        {
          url: `https://www.ikkxa.com/${locale}-${country}`,
          lastModified: new Date().toISOString(),
          changeFrequency: 'daily',
          priority: 1.0,
        }
      ];
    }

    const entries = data.results.urls
      .filter(page => page && typeof page === 'object') // Filter out null/undefined entries
      // The homepage is added below; an empty path would list it twice
      // (/en-SA and /en-SA/).
      .filter(page => cleanUrlPath(page.loc) !== '')
      // Data-only CMS pages (JSON for the app) are noindex, so keep them out.
      .filter(page => !NON_INDEXABLE_PATHS.includes(cleanUrlPath(page.loc)))
      .map((page) => {
        try {
          const cleanPath = cleanUrlPath(page.loc);
          
          return {
            url: `https://www.ikkxa.com/${locale}-${country}/${cleanPath}`,
            lastModified: (page.lastmod && new Date(page.lastmod).toISOString()) || new Date().toISOString(),
            changeFrequency: (page.changefreq && typeof page.changefreq === 'string') ? page.changefreq : 'daily',
            priority: (typeof page.priority === 'number' && page.priority >= 0 && page.priority <= 1) ? page.priority : 0.7,
          };
        } catch (error) {
          console.error('Error processing page:', error, page);
          return null;
        }
      })
      .filter(Boolean); // Remove any null entries from errors

    // Add homepage
    entries.unshift({
      url: `https://www.ikkxa.com/${locale}-${country}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 1.0,
    });

    // Curated tag archives (DEV-00). Config-driven so they are discoverable
    // without waiting on the backend site-map feed to include them.
    // Only list archives that currently render: an empty tag 404s (see
    // collections/[tag]/page.js), and a 404 in the sitemap wastes crawl budget.
    const liveSlugs = await Promise.all(
      Object.keys(TAG_ARCHIVES).map(async (slug) => {
        try {
          const data = await getTagProducts({ tag: slug, lang: locale, country, paginate: 1 });
          const total = data?.results?.products?.total ?? 0;
          return total >= MIN_TAG_PRODUCTS ? slug : null;
        } catch {
          return null;
        }
      })
    );
    liveSlugs.filter(Boolean).forEach((slug) => {
      entries.push({
        url: `https://www.ikkxa.com/${locale}-${country}/collections/${slug}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    });

    return entries;

  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Return homepage as fallback
    return [{
      url: `https://www.ikkxa.com/${locale}-${country}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 1.0,
    }];
  }
}

