import { useState, useCallback } from 'react';
import { Platform, PermissionsAndroid, Alert } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

/**
 * useLocation
 * Returns { coords, loading, error, fetchLocation }
 * Call fetchLocation() to trigger GPS lookup.
 */
export default function useLocation() {
  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const requestAndroidPermission = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'NearMind Location Permission',
        message: 'NearMind needs your location to find nearby places.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'Allow',
      },
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  };

  const fetchLocation = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (Platform.OS === 'android') {
        const granted = await requestAndroidPermission();
        if (!granted) {
          Alert.alert('Permission Denied', 'Location access is required.');
          setLoading(false);
          return;
        }
      }

      // useLocation.js — update getCurrentPosition options
  Geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude, accuracy } = position.coords;

      // ✅ Add these console logs to verify coordinates
      console.log('✅ LAT:', latitude);
      console.log('✅ LNG:', longitude);
      console.log('✅ ACCURACY (metres):', accuracy);
      console.log('✅ FULL COORDS:', position.coords);

      setCoords(position.coords);
      setLoading(false);
    },
    (err) => {
      console.log('❌ Location error code:', err.code);
      console.log('❌ Location error message:', err.message);
      setError(err.message);
      setLoading(false);
    },
    {
      enableHighAccuracy: false, // ← change to FALSE for emulator
      timeout: 30000,            // ← increase to 30 seconds
      maximumAge: 60000,         // ← accept 60s cached location
    }
  );
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  }, []);

  return { coords, loading, error, fetchLocation };
}
