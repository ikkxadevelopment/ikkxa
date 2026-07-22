"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { DEFAULT_CENTERS, searchPlaces } from "@/lib/geocode";
import { MdMyLocation } from "react-icons/md";

// Inline SVG pin as a divIcon — avoids the broken default marker image issue in bundlers.
const pinIcon = L.divIcon({
  className: "",
  html: `<svg width="30" height="42" viewBox="0 0 24 36" xmlns="http://www.w3.org/2000/svg">
    <path fill="#F83E16" stroke="#fff" stroke-width="1.5"
      d="M12 1C6.5 1 2 5.4 2 10.9 2 18.3 12 34 12 34s10-15.7 10-23.1C22 5.4 17.5 1 12 1z"/>
    <circle cx="12" cy="11" r="3.5" fill="#fff"/>
  </svg>`,
  iconSize: [30, 42],
  iconAnchor: [15, 42],
});

// Recenter the map imperatively when the value changes (e.g. after search / geolocate).
function Recenter({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.setView([position.lat, position.lng], Math.max(map.getZoom(), 15));
  }, [position, map]);
  return null;
}

// Capture map clicks.
function ClickHandler({ onPick }) {
  useMapEvents({
    click(e) {
      onPick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

export default function MapPicker({ value, country, locale = "en", onPick }) {
  const center = useMemo(() => {
    if (value?.lat && value?.lng) return { lat: Number(value.lat), lng: Number(value.lng) };
    return DEFAULT_CENTERS[country] || DEFAULT_CENTERS.SA;
  }, [value, country]);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [locating, setLocating] = useState(false);
  const debounceRef = useRef(null);

  const hasMarker = value?.lat && value?.lng;

  useEffect(() => {
    if (!query || query.trim().length < 3) {
      setResults([]);
      return;
    }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      const places = await searchPlaces(query.trim(), { country, locale });
      setResults(places);
      setSearching(false);
    }, 500);
    return () => clearTimeout(debounceRef.current);
  }, [query, country, locale]);

  const handleGeolocate = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        onPick({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleResultClick = (place) => {
    setQuery(place.label);
    setResults([]);
    onPick({ lat: place.lat, lng: place.lng });
  };

  return (
    <div className="w-full">
      {/* Search + locate controls */}
      <div className="relative mb-2 flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a place, area or landmark"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
          {(results.length > 0 || searching) && (
            <ul className="absolute z-[1000] mt-1 max-h-48 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-lg">
              {searching && <li className="px-3 py-2 text-xs text-gray-400">Searching…</li>}
              {results.map((place, i) => (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => handleResultClick(place)}
                    className="block w-full px-3 py-2 text-start text-xs hover:bg-stone-100"
                  >
                    {place.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          type="button"
          onClick={handleGeolocate}
          disabled={locating}
          title="My location"
          className="btn btn-outline-secondary btn-sm shrink-0 flex items-center justify-center w-10 h-10 !p-0"
        >
          {locating ? (
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <MdMyLocation className="h-6 w-6" />
          )}
        </button>
      </div>

      <div className="h-64 md:h-[350px] lg:h-[450px] w-full overflow-hidden rounded-md border border-gray-200">
        <MapContainer
          center={[center.lat, center.lng]}
          zoom={hasMarker ? 15 : 11}
          scrollWheelZoom
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onPick={onPick} />
          {hasMarker && (
            <Marker
              position={[Number(value.lat), Number(value.lng)]}
              icon={pinIcon}
              draggable
              eventHandlers={{
                dragend(e) {
                  const { lat, lng } = e.target.getLatLng();
                  onPick({ lat, lng });
                },
              }}
            />
          )}
          <Recenter position={hasMarker ? { lat: Number(value.lat), lng: Number(value.lng) } : null} />
        </MapContainer>
      </div>

      <p className="mt-1 text-xs text-gray-400">
        Tap the map or drag the pin to set your exact location.
        {hasMarker && (
          <span className="ms-1 text-gray-500">
            ({Number(value.lat).toFixed(5)}, {Number(value.lng).toFixed(5)})
          </span>
        )}
      </p>
    </div>
  );
}
