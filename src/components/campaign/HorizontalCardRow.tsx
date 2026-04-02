import React from 'react';
import { View, Text, ScrollView, StyleSheet, type ViewStyle } from 'react-native';

import { colors, typography, spacing } from '@/theme/tokens';

interface HorizontalCardRowProps {
  title: string;
  children: React.ReactNode;
  style?: ViewStyle;
}

/** Horizontal scrolling row of cards with a section title */
export default function HorizontalCardRow({ title, children, style }: HorizontalCardRowProps) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {children}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.subtitleLarge,
    color: colors.foreground,
    marginBottom: spacing.md,
  },
  scrollContent: {
    gap: spacing.md,
    paddingRight: spacing.lg,
  },
});
