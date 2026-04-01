import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { colors, typography, spacing } from '@/theme/tokens';

/** Campaign Overview dashboard */
export default function CampaignOverviewScreen() {
  const { campaignId } = useLocalSearchParams<{ campaignId: string }>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Campaign Dashboard</Text>
      <Text style={styles.subtitle}>ID: {campaignId}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing['3xl'],
  },
  title: {
    ...typography.titleSmall,
    color: colors.foreground,
  },
  subtitle: {
    ...typography.bodyMedium,
    color: colors.muted,
    marginTop: spacing.sm,
  },
});
