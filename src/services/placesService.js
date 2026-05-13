import { GOOGLE_PLACES_API_KEY } from '../utils/config';

const BASE_URL = 'https://maps.googleapis.com/maps/api/place';

/**
 * fetchNearbyPlaces
 * Calls Google Places Nearby Search API.
 *
 * @param {number} lat
 * @param {number} lng
 * @param {string} type  - 'lodging' | 'hospital' | 'park' | 'school'
 * @param {number} radius - metres, default 5000
 * @returns {Promise<Array>} array of place objects
 */
export async function fetchNearbyPlaces(lat, lng, type, radius = 5000) {
  const url =
    `${BASE_URL}/nearbysearch/json` +
    `?location=${lat},${lng}` +
    `&radius=${radius}` +
    `&type=${type}` +
    `&key=${GOOGLE_PLACES_API_KEY}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Places API error: ${response.status}`);
  }

  const data = await response.json();

  if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
    throw new Error(`Places API status: ${data.status}`);
  }

  // Map to a clean shape used across the app
  return (data.results || []).slice(0, 6).map(place => ({
    placeId: place.place_id,
    name: place.name,
    address: place.vicinity || '',
    rating: place.rating || null,
    totalRatings: place.user_ratings_total || 0,
    lat: place.geometry.location.lat,
    lng: place.geometry.location.lng,
    openNow: place.opening_hours?.open_now ?? null,
    photoRef: place.photos?.[0]?.photo_reference || null,
    types: place.types || [],
  }));
}

/**
 * getPhotoUrl
 * Returns a Google Place Photo URL from a photo reference.
 */
export function getPhotoUrl(photoRef, maxWidth = 400) {
  if (!photoRef) return null;
  return (
    `${BASE_URL}/photo` +
    `?maxwidth=${maxWidth}` +
    `&photoreference=${photoRef}` +
    `&key=${GOOGLE_PLACES_API_KEY}`
  );
}

/**
 * calcDistance
 * Haversine formula — returns distance in km between two coords.
 */
export function calcDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(1);
}
