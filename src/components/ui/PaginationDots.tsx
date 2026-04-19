import React, { useMemo } from 'react';
import { View, StyleSheet, type ViewStyle } from 'react-native';

import { spacing } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';

interface PaginationDotsProps {
  total: number;
  activeIndex: number;
  style?: ViewStyle;
}

const DOT_SIZE = 10;

/** Pagination indicator dots (used on NPC profiles and combat modules) */
export default function PaginationDots({ total, activeIndex, style }: PaginationDotsProps) {
  const colors = useColors();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: spacing.sm,
        },
        dot: {
          width: DOT_SIZE,
          height: DOT_SIZE,
          borderRadius: DOT_SIZE / 2,
        },
        active: {
          backgroundColor: colors.foreground,
        },
        inactive: {
          backgroundColor: colors.muted,
        },
      }),
    [colors],
  );

  return (
    <View style={[styles.container, style]}>
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          style={[styles.dot, i === activeIndex ? styles.active : styles.inactive]}
        />
      ))}
    </View>
  );
}
