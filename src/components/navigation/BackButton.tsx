import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { Pressable, Text, StyleSheet, type ViewStyle } from 'react-native';

import { typography, spacing } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';

interface BackButtonProps {
  label?: string;
  style?: ViewStyle;
}

/** Back arrow button for top-left of each page */
export default function BackButton({ label = 'Back', style }: BackButtonProps) {
  const router = useRouter();
  const colors = useColors();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.sm,
          paddingVertical: spacing.sm,
          marginBottom: spacing.md,
        },
        arrow: {
          ...typography.subtitleLarge,
          color: colors.muted,
        },
        label: {
          ...typography.bodyMedium,
          color: colors.muted,
        },
      }),
    [colors],
  );

  return (
    <Pressable
      onPress={() => router.back()}
      style={[styles.container, style]}
    >
      <Text style={styles.arrow}>{'\u2190'}</Text>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}
