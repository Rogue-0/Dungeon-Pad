import React from 'react';
import { View, StyleSheet, type ViewStyle } from 'react-native';

import { colors, spacing } from '@/theme/tokens';

interface DividerProps {
  style?: ViewStyle;
}

/** Horizontal divider line */
export default function Divider({ style }: DividerProps) {
  return <View style={[styles.divider, style]} />;
}

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
});
