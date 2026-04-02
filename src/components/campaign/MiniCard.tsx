import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

import { Card } from '@/components/ui';
import { colors, typography, spacing } from '@/theme/tokens';

interface MiniCardProps {
  title: string;
  subtitle?: string;
  onPress?: () => void;
  isAddCard?: boolean;
}

/** Compact card used in horizontal scroll rows on the Campaign Overview */
export default function MiniCard({ title, subtitle, onPress, isAddCard }: MiniCardProps) {
  return (
    <Card
      width={160}
      height={180}
      onPress={onPress}
      style={isAddCard ? styles.addCard : undefined}
    >
      <View style={styles.imageArea} />
      <Text style={styles.title} numberOfLines={2}>{title}</Text>
      {subtitle && <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>}
    </Card>
  );
}

const styles = StyleSheet.create({
  imageArea: {
    flex: 1,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 8,
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.subtitleSmall,
    color: colors.foreground,
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.muted,
    marginTop: 2,
  },
  addCard: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
