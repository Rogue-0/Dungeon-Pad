import React, { useMemo } from 'react';
import { Text, StyleSheet } from 'react-native';

import { Card } from '@/components/ui';
import { typography, spacing } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';

interface NewCampaignCardProps {
  onPress?: () => void;
}

export default function NewCampaignCard({ onPress }: NewCampaignCardProps) {
  const colors = useColors();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        card: {
          width: '100%',
          height: 'auto',
          padding: 0,
          paddingTop: spacing.xl,
          paddingBottom: spacing['2xl'],
          paddingHorizontal: spacing.xl,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.surfaceSecondary,
        },
        text: {
          ...typography.bodyLarge,
          color: colors.text.tertiary,
          marginBottom: spacing.sm,
        },
        icon: {
          fontSize: 56,
          color: colors.muted,
        },
      }),
    [colors],
  );

  return (
    <Card
      width={undefined}
      height={undefined}
      style={styles.card}
      onPress={onPress}
    >
      <Text style={styles.text}>Start a new campaign</Text>
      <Text style={styles.icon}>⬡</Text>
    </Card>
  );
}
