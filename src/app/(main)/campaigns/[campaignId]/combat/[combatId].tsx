import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { colors, typography, spacing } from '@/theme/tokens';

/** Combat module — initiative tracker and monster stat cards */
export default function CombatModuleScreen() {
  const { combatId } = useLocalSearchParams<{ combatId: string }>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Combat Module</Text>
      <Text style={styles.subtitle}>ID: {combatId}</Text>
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
