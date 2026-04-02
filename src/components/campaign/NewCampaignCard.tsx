import React from 'react';
import { Text, StyleSheet } from 'react-native';

import { Card } from '@/components/ui';
import { colors, typography, spacing } from '@/theme/tokens';

interface NewCampaignCardProps {
  onPress?: () => void;
}

export default function NewCampaignCard({ onPress }: NewCampaignCardProps) {
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

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: undefined,
    paddingVertical: spacing['2xl'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    ...typography.bodyLarge,
    color: colors.foreground,
    marginBottom: spacing.sm,
  },
  icon: {
    fontSize: 48,
    color: colors.foreground,
  },
});
