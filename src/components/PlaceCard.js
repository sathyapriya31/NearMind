import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, typography, spacing, radius } from '../styles/theme';

/**
 * PlaceCard
 * Displays a single nearby place result.
 * onPress → opens Google Maps / Apple Maps.
 */
export default function PlaceCard({ place, category, onPress }) {
  const { name, address, rating, totalRatings, distanceKm, openNow } = place;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Icon */}
      <View style={[styles.iconBox, { backgroundColor: category.bgColor }]}>
        <Text style={styles.iconEmoji}>{category.emoji}</Text>
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
        {address ? (
          <Text style={styles.address} numberOfLines={1}>{address}</Text>
        ) : null}
        <View style={styles.metaRow}>
          {rating != null && (
            <Text style={styles.rating}>⭐ {rating} ({totalRatings})</Text>
          )}
          {distanceKm && (
            <Text style={styles.distance}>📍 {distanceKm} km</Text>
          )}
          {openNow != null && (
            <Text style={[styles.openTag, openNow ? styles.open : styles.closed]}>
              {openNow ? 'Open' : 'Closed'}
            </Text>
          )}
        </View>
      </View>

      {/* Maps arrow */}
      <View style={styles.mapsTag}>
        <Text style={styles.mapsText}>Maps →</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing[3],
    gap: spacing[3],
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  iconEmoji: { fontSize: 22 },
  info: { flex: 1, minWidth: 0 },
  name: {
    fontSize: typography.sizes.sm,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  address: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
    alignItems: 'center',
  },
  rating: { fontSize: 11, color: '#f7c26c' },
  distance: { fontSize: 11, color: colors.textMuted },
  openTag: {
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  open: {
    backgroundColor: 'rgba(108,247,168,0.15)',
    color: '#6cf7a8',
  },
  closed: {
    backgroundColor: 'rgba(247,108,162,0.12)',
    color: '#f76ca2',
  },
  mapsTag: {
    backgroundColor: 'rgba(108,142,247,0.12)',
    borderRadius: radius.sm,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderWidth: 1,
    borderColor: 'rgba(108,142,247,0.25)',
  },
  mapsText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '600',
  },
});
