import React, { useMemo } from 'react';
import { View, StyleSheet, type ViewStyle } from 'react-native';

import { spacing } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';

interface DividerProps {
  style?: ViewStyle;
}

/** Horizontal divider line */
export default function Divider({ style }: DividerProps) {
  const colors = useColors();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        divider: {
          height: 1,
          backgroundColor: colors.border,
          marginVertical: spacing.md,
        },
      }),
    [colors],
  );
  return <View style={[styles.divider, style]} />;
}
