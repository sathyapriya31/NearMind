import { Linking, Platform, Alert } from 'react-native';

/**
 * openMapsForPlace
 * Opens Google Maps (Android) or Apple Maps (iOS) for a given place.
 *
 * @param {{ name: string, lat: number, lng: number }} place
 */
export async function openMapsForPlace(place) {
  const { name, lat, lng } = place;
  const label = encodeURIComponent(name);

  // Platform-specific deep-link schemes
  const nativeUrl =
    Platform.OS === 'ios'
      ? `maps://app?daddr=${lat},${lng}&q=${label}`
      : `geo:${lat},${lng}?q=${lat},${lng}(${label})`;

  // Universal fallback — Google Maps web
  const webUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${label}`;

  try {
    const supported = await Linking.canOpenURL(nativeUrl);
    if (supported) {
      await Linking.openURL(nativeUrl);
    } else {
      await Linking.openURL(webUrl);
    }
  } catch (err) {
    Alert.alert('Maps Error', 'Unable to open maps. Please try again.');
    console.error('openMapsForPlace error:', err);
  }
}
