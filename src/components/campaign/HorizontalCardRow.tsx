import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, type ViewStyle } from 'react-native';

import { FadeMask } from '@/components/ui';
import { typography, spacing } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';

interface HorizontalCardRowProps {
  title: string;
  children: React.ReactNode;
  style?: ViewStyle;
  isEmpty?: boolean;
  emptyLabel?: string;
}

/** Horizontal scrolling row of cards with a section title */
export default function HorizontalCardRow({
  title,
  children,
  style,
  isEmpty,
  emptyLabel,
}: HorizontalCardRowProps) {
  const colors = useColors();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          marginBottom: spacing.xl,
        },
        title: {
          ...typography.subtitleLarge,
          color: colors.text.primary,
          marginBottom: spacing.md,
        },
        scrollContent: {
          gap: spacing.md,
          paddingRight: spacing.lg,
        },
        emptyHint: {
          width: 240,
          height: 280,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: spacing.md,
        },
        emptyText: {
          ...typography.bodyMedium,
          color: colors.text.tertiary,
          textAlign: 'center',
        },
      }),
    [colors],
  );

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>
      <FadeMask>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {isEmpty && emptyLabel ? (
            <View style={styles.emptyHint}>
              <Text style={styles.emptyText}>{emptyLabel}</Text>
            </View>
          ) : null}
          {children}
        </ScrollView>
      </FadeMask>
    </View>
  );
}
