import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { Card } from '@/components/ui';
import { colors, typography, spacing } from '@/theme/tokens';
import type { CampaignWithStats } from '@/types';

interface CampaignCardProps {
  campaign: CampaignWithStats;
}

export default function CampaignCard({ campaign }: CampaignCardProps) {
  const router = useRouter();

  const stats = [
    { label: 'Sessions', count: campaign.sessionCount },
    { label: 'Combat Modules', count: campaign.combatModuleCount },
    { label: 'NPC Profiles', count: campaign.npcCount },
    { label: 'Heroes', count: campaign.heroCount },
    { label: 'Maps', count: campaign.mapCount },
  ];

  return (
    <Card
      width={undefined}
      height={undefined}
      style={styles.card}
      onPress={() => router.push(`/(main)/campaigns/${campaign.id}`)}
    >
      <Text style={styles.name}>{campaign.name}</Text>
      <View style={styles.statsList}>
        {stats.map((stat) => (
          <Text key={stat.label} style={styles.statItem}>
            •  {stat.count} {stat.label}
          </Text>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: undefined,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  name: {
    ...typography.subtitleLarge,
    color: colors.foreground,
    marginBottom: spacing.md,
  },
  statsList: {
    gap: spacing.xs,
  },
  statItem: {
    ...typography.bodyMedium,
    color: colors.foreground,
  },
});
