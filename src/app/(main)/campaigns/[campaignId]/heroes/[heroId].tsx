import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import BackButton from '@/components/navigation/BackButton';
import { Avatar } from '@/components/ui';
import { colors, typography, spacing, radii, componentSizes } from '@/theme/tokens';
import { MOCK_HEROES } from '@/utils/mock-data';

export default function HeroScreen() {
  const { heroId } = useLocalSearchParams<{ heroId: string }>();
  const hero = MOCK_HEROES.find((h) => h.id === heroId);

  if (!hero) {
    return (
      <View style={styles.container}>
        <Text style={styles.name}>Hero not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BackButton label="Dashboard" />
      <View style={styles.profileCard}>
        <Avatar name={hero.name} size={120} />
        <View style={styles.info}>
          <Text style={styles.name}>{hero.name}</Text>
          {hero.playerName && (
            <Text style={styles.detail}>Player: {hero.playerName}</Text>
          )}
          {hero.class && (
            <Text style={styles.detail}>
              {hero.class} — Level {hero.level}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing['3xl'],
  },
  profileCard: {
    flexDirection: 'row',
    gap: spacing.lg,
    borderRadius: radii.card,
    borderWidth: componentSizes.strokeWidth,
    borderColor: colors.foreground,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  name: {
    ...typography.subtitleLarge,
    color: colors.foreground,
  },
  detail: {
    ...typography.bodyMedium,
    color: colors.muted,
    marginTop: spacing.xs,
  },
});
