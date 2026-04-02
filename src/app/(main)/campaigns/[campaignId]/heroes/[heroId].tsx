import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { colors, typography, spacing } from '@/theme/tokens';

/** Hero profile screen */
export default function HeroScreen() {
  const { heroId } = useLocalSearchParams<{ heroId: string }>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hero</Text>
      <Text style={styles.subtitle}>ID: {heroId}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing['3xl'],
  },
  title: {
    ...typography.titleSmall,
    color: colors.foreground,
  },
  subtitle: {
    ...typography.bodyMedium,
    color: colors.muted,
    marginTop: spacing.sm,
  },
});
