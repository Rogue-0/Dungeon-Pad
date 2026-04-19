import React, { useMemo } from 'react';
import { View, Text, StyleSheet, type ViewStyle } from 'react-native';

import { radii, spacing, typography, componentSizes } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';

interface BadgeProps {
  label: string;
  value: string | number;
  style?: ViewStyle;
}

/** Stat badge used in combat modules (HP, AC, Speed) */
export default function Badge({ label, value, style }: BadgeProps) {
  const colors = useColors();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          borderRadius: radii.card,
          borderWidth: componentSizes.strokeWidth,
          borderColor: colors.foreground,
          backgroundColor: colors.surface,
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.md,
          alignItems: 'center',
          minWidth: 72,
        },
        label: {
          ...typography.bodySmall,
          color: colors.muted,
        },
        value: {
          ...typography.subtitleLarge,
          color: colors.text.primary,
        },
      }),
    [colors],
  );

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}
