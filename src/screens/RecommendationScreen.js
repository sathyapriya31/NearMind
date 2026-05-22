import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { getAIRecommendation } from '../services/aiService';
import { openMapsForPlace } from '../utils/mapsHelper';
import PlaceCard from '../components/PlaceCard';
import BackButton from '../components/BackButton';
import { colors, typography, spacing, radius } from '../styles/theme';

export default function RecommendationScreen({ route, navigation }) {
  const { places, category, userLat, userLng } = route.params;

  const [aiText, setAiText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Step 4+5: Send data to AI, display response ──────────────────────────
  useEffect(() => {
    loadAIRecommendation();
  }, []);

  const loadAIRecommendation = async () => {
    setLoading(true);
    setError(null);
    try {
      const text = await getAIRecommendation(
        places,
        category.label,
        userLat,
        userLng,
      );
      console.log('AI text:', text);
      setAiText(text);
    } catch (err) {
      console.error('AI error:', err);
      setError('Could not get AI recommendation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Step 6: Open Maps on card tap ─────────────────────────────────────────
  const handlePlacePress = place => {
    openMapsForPlace(place);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <BackButton onPress={() => navigation.goBack()} />
          <Text style={styles.title}>AI Recommendation</Text>
        </View>

        {/* ── AI Bubble ── */}
        <View style={styles.aiBubble}>
          <View style={styles.aiBadge}>
            <Text style={styles.aiBadgeText}>✦ NearMind AI</Text>
          </View>

          {loading ? (
            <View style={styles.aiLoading}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={styles.aiLoadingText}>
                Analyzing {places.length} places…
              </Text>
            </View>
          ) : error ? (
            <View>
              <Text style={styles.aiErrorText}>{error}</Text>
              <TouchableOpacity
                style={styles.retryBtn}
                onPress={loadAIRecommendation}
              >
                <Text style={styles.retryText}>Try again</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={styles.aiText}>{aiText}</Text>
          )}
        </View>

        {/* ── Top Pick label ── */}
        <Text style={styles.sectionLabel}>
          {category.emoji} All {category.pluralLabel} · Tap to open Maps
        </Text>

        {/* ── Place cards — tap opens Maps (Step 6) ── */}
        {places.map(place => (
          <View key={place.placeId} style={styles.cardWrapper}>
            <PlaceCard
              place={place}
              category={category}
              onPress={() => handlePlacePress(place)}
            />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1 },
  container: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[10],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingVertical: spacing[4],
  },
  title: {
    fontFamily: typography.display,
    fontSize: typography.sizes.lg,
    fontWeight: '700',
    color: colors.text,
  },
  aiBubble: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing[5],
    borderWidth: 1,
    borderColor: 'rgba(108,142,247,0.25)',
    marginBottom: spacing[5],
  },
  aiBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(108,142,247,0.15)',
    borderRadius: radius.full,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    marginBottom: spacing[3],
  },
  aiBadgeText: {
    fontSize: typography.sizes.xs,
    color: colors.primary,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  aiLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingVertical: spacing[2],
  },
  aiLoadingText: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
  },
  aiText: {
    fontSize: typography.sizes.base,
    color: colors.text,
    lineHeight: 24,
  },
  aiErrorText: {
    fontSize: typography.sizes.sm,
    color: '#f76ca2',
    marginBottom: spacing[3],
  },
  retryBtn: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceOffset,
    borderRadius: radius.md,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderWidth: 1,
    borderColor: colors.border,
  },
  retryText: {
    fontSize: typography.sizes.xs,
    color: colors.primary,
    fontWeight: '600',
  },
  sectionLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: spacing[3],
  },
  cardWrapper: {
    marginBottom: spacing[2],
  },
});
