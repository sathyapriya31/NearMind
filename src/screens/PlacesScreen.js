import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import useLocation from '../hooks/useLocation';
import { fetchNearbyPlaces, calcDistance } from '../services/placesService';
import { openMapsForPlace } from '../utils/mapsHelper';
import PlaceCard from '../components/PlaceCard';
import BackButton from '../components/BackButton';
import { colors, typography, spacing, radius } from '../styles/theme';

export default function PlacesScreen({ route, navigation }) {
  const { category } = route.params;
  const { coords, loading: locationLoading, fetchLocation } = useLocation();

  const [places, setPlaces] = useState([]);
  const [fetchingPlaces, setFetchingPlaces] = useState(false);
  const [error, setError] = useState(null);

  // ── Step 2: Get GPS on mount ─────────────────────────────────────────────
  useEffect(() => {
    fetchLocation();
  }, []);

  // ── Step 3: Once GPS coords arrive, hit Google Places API ────────────────
  useEffect(() => {
    if (coords) {
      loadPlaces(coords.latitude, coords.longitude);
    }
  }, [coords]);

  const loadPlaces = useCallback(async (lat, lng) => {
    setFetchingPlaces(true);
    setError(null);
    try {
      const results = await fetchNearbyPlaces(lat, lng, category.placesType);
      // Attach calculated distance to each place
      const withDistance = results.map(p => ({
        ...p,
        distanceKm: calcDistance(lat, lng, p.lat, p.lng),
      }));
      // Sort by distance
      withDistance.sort((a, b) => a.distanceKm - b.distanceKm);
      setPlaces(withDistance);
    } catch (err) {
      console.error('Places fetch error:', err);
      setError(err.message);
      Alert.alert('Error', `Could not fetch nearby ${category.pluralLabel}.`);
    } finally {
      setFetchingPlaces(false);
    }
  }, [category]);

  // ── Step 6: Open Maps on card tap ─────────────────────────────────────────
  const handlePlacePress = place => {
    openMapsForPlace(place);
  };

  const isLoading = locationLoading || fetchingPlaces;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* ── Header ── */}
        <View style={styles.header}>
          <BackButton onPress={() => navigation.goBack()} />
          <View style={styles.headerText}>
            <Text style={styles.title}>
              {category.emoji} Nearby {category.pluralLabel}
            </Text>
            {coords && (
              <Text style={styles.coordText}>
                📍 {coords.latitude.toFixed(4)}°N, {coords.longitude.toFixed(4)}°E
              </Text>
            )}
          </View>
        </View>

        {/* ── Loading ── */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>
              {locationLoading
                ? '📡 Getting your GPS location…'
                : '🌐 Fetching nearby places…'}
            </Text>
          </View>
        )}

        {/* ── Error ── */}
        {error && !isLoading && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
            <TouchableOpacity
              style={styles.retryBtn}
              onPress={() => coords && loadPlaces(coords.latitude, coords.longitude)}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── Places List ── */}
        {!isLoading && places.length > 0 && (
          <>
            <Text style={styles.resultCount}>
              {places.length} places found
            </Text>
            <FlatList
              data={places}
              keyExtractor={item => item.placeId}
              renderItem={({ item }) => (
                <PlaceCard
                  place={item}
                  category={category}
                  onPress={() => handlePlacePress(item)}
                />
              )}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />

            {/* ── AI Recommendation Button ── */}
            <TouchableOpacity
              style={styles.aiButton}
              onPress={() =>
                navigation.navigate('Recommendation', {
                  places,
                  category,
                  userLat: coords.latitude,
                  userLng: coords.longitude,
                })
              }
              activeOpacity={0.85}>
              <Text style={styles.aiButtonText}>
                ✦ Get AI Recommendation
              </Text>
            </TouchableOpacity>
          </>
        )}

        {/* ── Empty state ── */}
        {!isLoading && !error && places.length === 0 && coords && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyTitle}>No places found</Text>
            <Text style={styles.emptyText}>
              Try increasing the search radius or check your location.
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.bg },
  container: { flex: 1, paddingHorizontal: spacing[4] },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingVertical: spacing[4],
  },
  headerText: { flex: 1 },
  title: {
    fontFamily: typography.display,
    fontSize: typography.sizes.lg,
    fontWeight: '700',
    color: colors.text,
  },
  coordText: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    marginTop: 2,
    fontFamily: 'monospace',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[4],
  },
  loadingText: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[4],
  },
  errorText: { fontSize: typography.sizes.sm, color: '#f76ca2' },
  retryBtn: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[3],
    borderWidth: 1,
    borderColor: colors.border,
  },
  retryText: { color: colors.primary, fontWeight: '600' },
  resultCount: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    marginBottom: spacing[3],
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  listContent: { paddingBottom: spacing[4] },
  separator: { height: spacing[2] },
  aiButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    paddingVertical: spacing[4],
    alignItems: 'center',
    marginVertical: spacing[4],
  },
  aiButtonText: {
    fontSize: typography.sizes.base,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.3,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[3],
  },
  emptyEmoji: { fontSize: 48 },
  emptyTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: '700',
    color: colors.text,
  },
  emptyText: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
    textAlign: 'center',
    maxWidth: 260,
  },
});
