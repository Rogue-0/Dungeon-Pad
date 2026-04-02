import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';

import HorizontalCardRow from '@/components/campaign/HorizontalCardRow';
import MiniCard from '@/components/campaign/MiniCard';
import SessionsPlayedCounter from '@/components/campaign/SessionsPlayedCounter';
import { Avatar } from '@/components/ui';
import { colors, typography, spacing, radii, componentSizes } from '@/theme/tokens';
import {
  MOCK_CAMPAIGNS,
  MOCK_SESSIONS,
  MOCK_HEROES,
  MOCK_COMBAT_MODULES,
  MOCK_NPCS,
  MOCK_MAPS,
} from '@/utils/mock-data';

export default function CampaignOverviewScreen() {
  const { campaignId } = useLocalSearchParams<{ campaignId: string }>();
  const router = useRouter();

  const campaign = MOCK_CAMPAIGNS.find((c) => c.id === campaignId);
  const sessions = MOCK_SESSIONS.filter((s) => s.campaignId === campaignId);
  const heroes = MOCK_HEROES.filter((h) => h.campaignId === campaignId);
  const combatModules = MOCK_COMBAT_MODULES.filter((c) => c.campaignId === campaignId);
  const npcs = MOCK_NPCS.filter((n) => n.campaignId === campaignId);
  const maps = MOCK_MAPS.filter((m) => m.campaignId === campaignId);

  if (!campaign) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Campaign not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <Text style={styles.campaignName}>{campaign.name}</Text>
      <Text style={styles.dashboardLabel}>Campaign Dashboard</Text>

      {/* Top row: Heroes portraits + Sessions Played */}
      <View style={styles.topRow}>
        <View style={styles.heroesCard}>
          <Text style={styles.sectionLabel}>Heroes</Text>
          <View style={styles.heroPortraits}>
            {heroes.map((hero) => (
              <Avatar key={hero.id} name={hero.name} imageUri={hero.imageUri} size={64} />
            ))}
          </View>
        </View>
        <SessionsPlayedCounter count={campaign.sessionCount} />
      </View>

      {/* Recent Sessions */}
      <HorizontalCardRow title="Recent Sessions">
        {sessions.map((session) => (
          <MiniCard
            key={session.id}
            title={`Session ${session.sessionNumber}`}
            onPress={() =>
              router.push(`/(main)/campaigns/${campaignId}/sessions/${session.id}`)
            }
          />
        ))}
      </HorizontalCardRow>

      {/* Heroes */}
      <HorizontalCardRow title="Heroes">
        {heroes.map((hero) => (
          <MiniCard
            key={hero.id}
            title={hero.name}
            onPress={() =>
              router.push(`/(main)/campaigns/${campaignId}/heroes/${hero.id}`)
            }
          />
        ))}
      </HorizontalCardRow>

      {/* Combat Modules */}
      <HorizontalCardRow title="Combat Modules">
        {combatModules.map((combat) => (
          <MiniCard
            key={combat.id}
            title={combat.title}
            onPress={() =>
              router.push(`/(main)/campaigns/${campaignId}/combat/${combat.id}`)
            }
          />
        ))}
      </HorizontalCardRow>

      {/* NPC Profiles */}
      <HorizontalCardRow title="NPC Profiles">
        {npcs.map((npc) => (
          <MiniCard
            key={npc.id}
            title={npc.name}
            onPress={() =>
              router.push(`/(main)/campaigns/${campaignId}/npcs/${npc.id}`)
            }
          />
        ))}
      </HorizontalCardRow>

      {/* Maps */}
      <HorizontalCardRow title="Maps">
        {maps.map((map) => (
          <MiniCard
            key={map.id}
            title={map.name}
            onPress={() =>
              router.push(`/(main)/campaigns/${campaignId}/maps/${map.id}`)
            }
          />
        ))}
        <MiniCard title="Add a Map" isAddCard onPress={() => {}} />
      </HorizontalCardRow>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing['3xl'],
  },
  campaignName: {
    ...typography.titleSmall,
    color: colors.foreground,
    fontStyle: 'italic',
  },
  dashboardLabel: {
    ...typography.subtitleLarge,
    color: colors.foreground,
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
  },
  topRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  heroesCard: {
    flex: 1,
    borderRadius: radii.card,
    borderWidth: componentSizes.strokeWidth,
    borderColor: colors.foreground,
    backgroundColor: colors.surface,
    padding: spacing.md,
  },
  heroPortraits: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  sectionLabel: {
    ...typography.subtitleSmall,
    color: colors.foreground,
  },
  title: {
    ...typography.titleSmall,
    color: colors.foreground,
    padding: spacing['3xl'],
  },
});
