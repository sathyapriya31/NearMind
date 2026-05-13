import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,

} from 'react-native';
import useLocation from '../hooks/useLocation';
import { CATEGORIES } from '../utils/categories';
import { colors, typography, spacing, radius } from '../styles/theme';

export default function HomeScreen({ navigation }) {
  const { coords, loading, error, fetchLocation } = useLocation();

  // Step 1: User taps a category button
  // Step 2: GPS fires FIRST — only after coords are ready, navigate
  const handleCategoryPress = async category => {
    try {
      // Trigger GPS
      await new Promise((resolve, reject) => {
        fetchLocation();
        // Poll until coords or error are set (simple approach)
        const interval = setInterval(() => {
          if (coords) {
            clearInterval(interval);
            resolve(coords);
          }
        }, 300);
        setTimeout(() => {
          clearInterval(interval);
          reject(new Error('Location timeout'));
        }, 15000);
      });
    } catch {
      // If coords already cached, use them
    }

    // Navigate — PlacesScreen will also call fetchLocation on mount
    navigation.navigate('Places', { category });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* ── Header ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.appName}>NearMind</Text>
            <Text style={styles.tagline}>AI-Powered Nearby Discovery</Text>
          </View>
          <View style={styles.statusDot} />
        </View>

        {/* ── Greeting ── */}
        <View style={styles.greetingBox}>
          <Text style={styles.greetingText}>
            👋 What are you looking for nearby?
          </Text>
          <Text style={styles.greetingSubText}>
            Tap a category — NearMind will find and recommend the best spots.
          </Text>
        </View>

        {/* ── Category Buttons ── */}
        <Text style={styles.sectionLabel}>Choose a category</Text>
        <View style={styles.categoryGrid}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.catButton, { backgroundColor: cat.bgColor }]}
              onPress={() => handleCategoryPress(cat)}
              activeOpacity={0.75}
              disabled={loading}
            >
              <Text style={styles.catEmoji}>{cat.emoji}</Text>
              <Text style={[styles.catLabel, { color: cat.color }]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Loading indicator ── */}
        {loading && (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.loadingText}>Getting your location…</Text>
          </View>
        )}

        {/* ── Error ── */}
        {error && (
          <Text style={styles.errorText}>⚠️ Location error: {error}</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing[5],
    paddingTop: spacing[6],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[6],
  },
  appName: {
    fontFamily: typography.display,
    fontSize: typography.sizes.xl,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#6cf7a8',
  },
  greetingBox: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing[4],
    marginBottom: spacing[6],
    borderWidth: 1,
    borderColor: colors.border,
  },
  greetingText: {
    fontSize: typography.sizes.base,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  greetingSubText: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    lineHeight: 18,
  },
  sectionLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: spacing[3],
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[3],
  },
  catButton: {
    width: '47%',
    borderRadius: radius.lg,
    paddingVertical: spacing[5],
    alignItems: 'center',
    gap: spacing[2],
    borderWidth: 1,
    borderColor: colors.border,
  },
  catEmoji: {
    fontSize: 32,
  },
  catLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginTop: spacing[5],
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
  },
  errorText: {
    fontSize: typography.sizes.xs,
    color: '#f76ca2',
    marginTop: spacing[3],
    textAlign: 'center',
  },
});
