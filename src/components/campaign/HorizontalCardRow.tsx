import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

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
        scrollWrap: {
          position: 'relative',
        },
        scrollContent: {
          gap: spacing.md,
          paddingRight: spacing.lg,
        },
        fade: {
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: 48,
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

  const fadeColors = useMemo(
    () => [`${colors.background}00`, colors.background] as [string, string],
    [colors],
  );

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.scrollWrap}>
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
        <LinearGradient
          colors={fadeColors}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.fade}
          pointerEvents="none"
        />
      </View>
    </View>
  );
}
