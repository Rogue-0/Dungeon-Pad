import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';

import HorizontalCardRow from '@/components/campaign/HorizontalCardRow';
import MiniCard from '@/components/campaign/MiniCard';
import SessionsPlayedCounter from '@/components/campaign/SessionsPlayedCounter';
import BackButton from '@/components/navigation/BackButton';
import { Button } from '@/components/ui';
import { typography, spacing, radii, componentSizes } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';
import { formatRelativeDate } from '@/utils/format-relative-date';
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
  const colors = useColors();

  const campaign = MOCK_CAMPAIGNS.find((c) => c.id === campaignId);
  const sessions = MOCK_SESSIONS.filter((s) => s.campaignId === campaignId);
  const heroes = MOCK_HEROES.filter((h) => h.campaignId === campaignId);
  const combatModules = MOCK_COMBAT_MODULES.filter((c) => c.campaignId === campaignId);
  const npcs = MOCK_NPCS.filter((n) => n.campaignId === campaignId);
  const maps = MOCK_MAPS.filter((m) => m.campaignId === campaignId);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: 'transparent',
        },
        content: {
          padding: spacing['3xl'],
        },
        campaignName: {
          ...typography.titleMedium,
          color: colors.text.primary,
        },
        headerRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: spacing.xl,
          gap: spacing.md,
        },
        headerActions: {
          flexDirection: 'row',
          gap: spacing.sm,
          alignItems: 'center',
        },
        dashboardLabel: {
          ...typography.bodyMedium,
          color: colors.text.tertiary,
          marginBottom: spacing.xs,
        },
        topRow: {
          flexDirection: 'row',
          gap: spacing.md,
          marginBottom: spacing.xl,
          alignItems: 'stretch',
        },
        heroesContainer: {
          flex: 1,
          borderRadius: radii.card,
          borderWidth: componentSizes.strokeWidth,
          borderColor: colors.foreground,
          backgroundColor: colors.surface,
          padding: spacing.md,
        },
        sectionLabel: {
          ...typography.subtitleSmall,
          color: colors.text.primary,
          marginBottom: spacing.sm,
        },
        heroWrap: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: spacing.md,
        },
        title: {
          ...typography.titleSmall,
          color: colors.text.primary,
          padding: spacing['3xl'],
        },
      }),
    [colors],
  );

  if (!campaign) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Campaign not found</Text>
      </View>
    );
  }

  const latestPlayedAt = sessions
    .map((s) => s.playedAt)
    .filter((d): d is string => Boolean(d))
    .sort()
    .reverse()[0] ?? null;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <BackButton label="Campaigns" />

        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.dashboardLabel}>Campaign Dashboard</Text>
            <Text style={styles.campaignName}>{campaign.name}</Text>
          </View>
          <View style={styles.headerActions}>
            <Button
              label="Campaign Compendium"
              variant="secondary"
              onPress={() =>
                router.push(`/(main)/campaigns/${campaignId}/compendium`)
              }
            />
          </View>
        </View>

        <View style={styles.topRow}>
          <View style={styles.heroesContainer}>
            <Text style={styles.sectionLabel}>Heroes</Text>
            <View style={styles.heroWrap}>
              {heroes.map((hero, i) => (
                <MiniCard
                  key={hero.id}
                  title={hero.name}
                  description={hero.class}
                  imageUri={hero.imageUri}
                  gradientIndex={i + 3}
                  placeholderType="hero"
                  onPress={() =>
                    router.push(`/(main)/campaigns/${campaignId}/heroes/${hero.id}`)
                  }
                />
              ))}
              <MiniCard title="Add Hero" isAddCard onPress={() => {}} />
            </View>
          </View>
          <SessionsPlayedCounter
            count={campaign.sessionCount}
            lastPlayedLabel={latestPlayedAt ? formatRelativeDate(latestPlayedAt) : undefined}
          />
        </View>

        <HorizontalCardRow
          title="Recent Sessions"
          isEmpty={sessions.length === 0}
          emptyLabel="No sessions yet — add your first"
        >
          {sessions.map((session, i) => (
            <MiniCard
              key={session.id}
              title={`Session ${session.sessionNumber}`}
              description={session.description}
              imageUri={session.imageUri}
              gradientIndex={i}
              placeholderType="session"
              sessionNumber={session.sessionNumber}
              onPress={() =>
                router.push(`/(main)/campaigns/${campaignId}/sessions/${session.id}`)
              }
            />
          ))}
          <MiniCard title="Add Session" isAddCard onPress={() => {}} />
        </HorizontalCardRow>

        <HorizontalCardRow
          title="Combat Modules"
          isEmpty={combatModules.length === 0}
          emptyLabel="No combat modules yet — add your first"
        >
          {combatModules.map((combat, i) => (
            <MiniCard
              key={combat.id}
              title={combat.title}
              description={combat.description}
              imageUri={combat.imageUri}
              gradientIndex={i + 2}
              placeholderType="combat"
              onPress={() =>
                router.push(`/(main)/campaigns/${campaignId}/combat/${combat.id}`)
              }
            />
          ))}
          <MiniCard title="Add Combat Module" isAddCard onPress={() => {}} />
        </HorizontalCardRow>

        <HorizontalCardRow
          title="NPC Profiles"
          isEmpty={npcs.length === 0}
          emptyLabel="No NPCs yet — add your first"
        >
          {npcs.map((npc, i) => (
            <MiniCard
              key={npc.id}
              title={npc.name}
              description={npc.description}
              imageUri={npc.imageUri}
              gradientIndex={i + 4}
              placeholderType="npc"
              onPress={() =>
                router.push(`/(main)/campaigns/${campaignId}/npcs/${npc.id}`)
              }
            />
          ))}
          <MiniCard title="Add NPC" isAddCard onPress={() => {}} />
        </HorizontalCardRow>

        <HorizontalCardRow
          title="Maps"
          isEmpty={maps.length === 0}
          emptyLabel="No maps yet — add your first"
        >
          {maps.map((map, i) => (
            <MiniCard
              key={map.id}
              title={map.name}
              imageUri={map.imageUri}
              gradientIndex={i + 1}
              placeholderType="map"
              onPress={() =>
                router.push(`/(main)/campaigns/${campaignId}/maps/${map.id}`)
              }
            />
          ))}
          <MiniCard title="Add Map" isAddCard onPress={() => {}} />
        </HorizontalCardRow>
      </ScrollView>
    </View>
  );
}
