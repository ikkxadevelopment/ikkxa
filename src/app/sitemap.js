// app/sitemap/[id]/route.js
import { escape } from "lodash";

export async function generateSitemaps() {
  return [
    { id: 'en-SA' },
    { id: 'ar-SA' },
    { id: 'en-AE' },
    { id: 'ar-AE' },
  ];
}

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
          url: `https://ikkxa.com/${locale}-${country}`,
          lastModified: new Date().toISOString(),
          changeFrequency: 'daily',
          priority: 1.0,
        }
      ];
    }

    const entries = data.results.urls
      .filter(page => page && typeof page === 'object') // Filter out null/undefined entries
      .map((page) => {
        try {
          const cleanPath = cleanUrlPath(page.loc);
          
          return {
            url: `https://ikkxa.com/${locale}-${country}/${cleanPath}`,
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
      url: `https://ikkxa.com/${locale}-${country}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 1.0,
    });

    return entries;

  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Return homepage as fallback
    return [{
      url: `https://ikkxa.com/${locale}-${country}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 1.0,
    }];
  }
}

