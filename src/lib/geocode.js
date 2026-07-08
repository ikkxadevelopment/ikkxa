// OpenStreetMap (Nominatim) geocoding helpers + fuzzy name matching for
// auto-filling the address form from a picked map point.

// Default map centres per country (used before a point is picked).
export const DEFAULT_CENTERS = {
  SA: { lat: 24.7136, lng: 46.6753 }, // Riyadh
  AE: { lat: 25.2048, lng: 55.2708 }, // Dubai
};

// Normalise a string for loose comparison (lowercase, strip diacritics/punctuation).
const normalize = (str = "") =>
  str
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // diacritics
    .replace(/[^a-z0-9؀-ۿ]+/g, " ") // keep latin + arabic
    .trim();

// Find the best match for a name inside a list of { id, name } options.
export const fuzzyFindByName = (list, name) => {
  if (!name || !Array.isArray(list) || list.length === 0) return null;
  const target = normalize(name);
  if (!target) return null;

  // 1. exact normalised match
  let match = list.find((item) => normalize(item.name) === target);
  if (match) return match;

  // 2. one contains the other
  match = list.find((item) => {
    const n = normalize(item.name);
    return n && (n.includes(target) || target.includes(n));
  });
  if (match) return match;

  // 3. shared first word (e.g. "Riyadh Province" vs "Riyadh")
  const firstWord = target.split(" ")[0];
  if (firstWord.length > 2) {
    match = list.find((item) => normalize(item.name).split(" ")[0] === firstWord);
  }
  return match || null;
};

// Reverse geocode a lat/lng into address parts via OpenStreetMap Nominatim.
export const reverseGeocode = async (lat, lng, locale = "en") => {
  try {
    const url =
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2` +
      `&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=${locale}`;
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) return null;
    const data = await res.json();
    const a = data.address || {};

    const streetParts = [a.road, a.suburb || a.neighbourhood || a.quarter].filter(Boolean);
    return {
      street: streetParts.join(", ") || (data.display_name || "").split(",")[0] || "",
      building: a.house_number || "",
      postal_code: a.postcode || "",
      country: a.country || "",
      state: a.state || a.region || a.province || a.state_district || "",
      city: a.city || a.town || a.village || a.municipality || a.county || "",
    };
  } catch (e) {
    console.error("reverseGeocode failed", e);
    return null;
  }
};

// Free-text place search via Nominatim, biased to the current country.
export const searchPlaces = async (query, { country, locale = "en" } = {}) => {
  try {
    const params = new URLSearchParams({
      format: "jsonv2",
      q: query,
      addressdetails: "1",
      limit: "5",
      "accept-language": locale,
    });
    if (country) params.set("countrycodes", country.toLowerCase());
    const res = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data || []).map((d) => ({
      label: d.display_name,
      lat: parseFloat(d.lat),
      lng: parseFloat(d.lon),
    }));
  } catch (e) {
    console.error("searchPlaces failed", e);
    return [];
  }
};
