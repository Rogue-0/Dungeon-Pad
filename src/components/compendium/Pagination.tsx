import React, { useMemo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

import { typography, spacing, componentSizes } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const colors = useColors();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: spacing.sm,
          paddingVertical: spacing.lg,
        },
        pageButton: {
          width: 36,
          height: 36,
          borderRadius: 18,
          alignItems: 'center',
          justifyContent: 'center',
        },
        activePageButton: {
          borderWidth: componentSizes.strokeWidth,
          borderColor: colors.foreground,
        },
        pageText: {
          ...typography.bodyMedium,
          color: colors.text.secondary,
        },
        activePageText: {
          ...typography.subtitleSmall,
          color: colors.text.primary,
        },
        ellipsis: {
          ...typography.bodyMedium,
          color: colors.muted,
          paddingHorizontal: spacing.xs,
        },
        nextButton: {
          width: 36,
          height: 36,
          alignItems: 'center',
          justifyContent: 'center',
        },
        nextText: {
          ...typography.subtitleLarge,
          color: colors.text.primary,
        },
      }),
    [colors],
  );

  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | '...')[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <View style={styles.container}>
      {getPageNumbers().map((page, index) =>
        page === '...' ? (
          <Text key={`ellipsis-${index}`} style={styles.ellipsis}>...</Text>
        ) : (
          <Pressable
            key={page}
            style={[styles.pageButton, page === currentPage && styles.activePageButton]}
            onPress={() => onPageChange(page)}
          >
            <Text style={[styles.pageText, page === currentPage && styles.activePageText]}>
              {page}
            </Text>
          </Pressable>
        )
      )}
      {currentPage < totalPages && (
        <Pressable style={styles.nextButton} onPress={() => onPageChange(currentPage + 1)}>
          <Text style={styles.nextText}>{'\u203A'}</Text>
        </Pressable>
      )}
    </View>
  );
}
