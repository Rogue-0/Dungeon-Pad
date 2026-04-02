import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { colors, typography, spacing, radii, componentSizes } from '@/theme/tokens';

interface SessionsPlayedCounterProps {
  count: number;
}

export default function SessionsPlayedCounter({ count }: SessionsPlayedCounterProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Sessions Played</Text>
      <Text style={styles.count}>{count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radii.card,
    borderWidth: componentSizes.strokeWidth,
    borderColor: colors.foreground,
    backgroundColor: colors.surface,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 160,
    minHeight: 120,
  },
  label: {
    ...typography.bodyMedium,
    color: colors.foreground,
    marginBottom: spacing.sm,
  },
  count: {
    ...typography.titleLarge,
    color: colors.foreground,
  },
});
