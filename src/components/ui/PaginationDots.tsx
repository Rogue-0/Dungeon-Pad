import React from 'react';
import { View, StyleSheet, type ViewStyle } from 'react-native';

import { colors, spacing } from '@/theme/tokens';

interface PaginationDotsProps {
  total: number;
  activeIndex: number;
  style?: ViewStyle;
}

/** Pagination indicator dots (used on NPC profiles and combat modules) */
export default function PaginationDots({ total, activeIndex, style }: PaginationDotsProps) {
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

const DOT_SIZE = 10;

const styles = StyleSheet.create({
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
});
