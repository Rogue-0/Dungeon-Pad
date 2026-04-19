import React, { useMemo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

import { typography, spacing, componentSizes } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';
import type { CompendiumItem } from '@/types';

interface CompendiumTableProps {
  items: CompendiumItem[];
  onItemPress: (item: CompendiumItem) => void;
}

export default function CompendiumTable({ items, onItemPress }: CompendiumTableProps) {
  const colors = useColors();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        table: {
          borderWidth: componentSizes.strokeWidth,
          borderColor: colors.foreground,
          borderRadius: 0,
        },
        headerRow: {
          flexDirection: 'row',
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.md,
        },
        headerCell: {
          ...typography.subtitleSmall,
          color: colors.text.primary,
        },
        headerDivider: {
          height: componentSizes.strokeWidth,
          backgroundColor: colors.foreground,
        },
        row: {
          flexDirection: 'row',
          paddingVertical: spacing.lg,
          paddingHorizontal: spacing.md,
        },
        cell: {
          ...typography.bodyMedium,
          color: colors.text.secondary,
        },
        rowDivider: {
          height: 1,
          backgroundColor: colors.border,
          marginHorizontal: spacing.md,
        },
        titleCol: {
          width: '18%',
        },
        typeCol: {
          width: '12%',
        },
        summaryCol: {
          flex: 1,
        },
        sourceCol: {
          width: '14%',
          textAlign: 'right',
        },
      }),
    [colors],
  );

  return (
    <View style={styles.table}>
      <View style={styles.headerRow}>
        <Text style={[styles.headerCell, styles.titleCol]}>Title</Text>
        <Text style={[styles.headerCell, styles.typeCol]}>Type</Text>
        <Text style={[styles.headerCell, styles.summaryCol]}>Summary</Text>
        <Text style={[styles.headerCell, styles.sourceCol]}>Source</Text>
      </View>

      <View style={styles.headerDivider} />

      {items.map((item) => (
        <Pressable key={item.id} onPress={() => onItemPress(item)}>
          <View style={styles.row}>
            <Text style={[styles.cell, styles.titleCol]} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={[styles.cell, styles.typeCol]}>{item.type}</Text>
            <Text style={[styles.cell, styles.summaryCol]} numberOfLines={2}>
              {item.summary}
            </Text>
            <Text style={[styles.cell, styles.sourceCol]}>
              {item.source === 'Link' ? '[Link]' : 'Created in app'}
            </Text>
          </View>
          <View style={styles.rowDivider} />
        </Pressable>
      ))}
    </View>
  );
}
