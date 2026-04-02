import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';

import HorizontalCardRow from '@/components/campaign/HorizontalCardRow';
import MiniCard from '@/components/campaign/MiniCard';
import BackButton from '@/components/navigation/BackButton';
import AddResourceMenu from '@/components/session/AddResourceMenu';
import { Accordion, Avatar, Button } from '@/components/ui';
import { colors, typography, spacing } from '@/theme/tokens';
import {
  MOCK_SESSIONS,
  MOCK_STORY_BEATS,
  MOCK_HEROES,
  MOCK_NPCS,
  MOCK_MAPS,
  MOCK_COMBAT_MODULES,
  SESSION_1_NPC_IDS,
  SESSION_1_MAP_IDS,
  SESSION_1_COMBAT_IDS,
} from '@/utils/mock-data';

export default function SessionScreen() {
  const { campaignId, sessionId } = useLocalSearchParams<{
    campaignId: string;
    sessionId: string;
  }>();
  const router = useRouter();

  const session = MOCK_SESSIONS.find((s) => s.id === sessionId);
  const storyBeats = MOCK_STORY_BEATS.filter((b) => b.sessionId === sessionId);
  const heroes = MOCK_HEROES.filter((h) => h.campaignId === campaignId);

  // Linked resources for Session 1
  const linkedNPCs = MOCK_NPCS.filter((n) => SESSION_1_NPC_IDS.includes(n.id));
  const linkedMaps = MOCK_MAPS.filter((m) => SESSION_1_MAP_IDS.includes(m.id));
  const linkedCombat = MOCK_COMBAT_MODULES.filter((c) =>
    SESSION_1_COMBAT_IDS.includes(c.id)
  );

  if (!session) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Session not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <BackButton label="Dashboard" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.sessionLabel}>Session {session.sessionNumber}</Text>
          <Text style={styles.title}>{session.title}</Text>
        </View>
        <View style={styles.heroAvatars}>
          <Text style={styles.heroesLabel}>Heroes</Text>
          <View style={styles.avatarRow}>
            {heroes.map((hero) => (
              <Avatar key={hero.id} name={hero.name} size={36} />
            ))}
          </View>
        </View>
      </View>

      {/* Story Beats */}
      <Text style={styles.sectionTitle}>Story Beats</Text>
      <View style={styles.beatsContainer}>
        {storyBeats.map((beat, index) => (
          <Accordion
            key={beat.id}
            title={beat.title}
            defaultExpanded={index < 2}
            style={styles.accordion}
          >
            {beat.body ? (
              <Text style={styles.beatBody}>{beat.body}</Text>
            ) : (
              <Text style={styles.beatPlaceholder}>No content yet</Text>
            )}
          </Accordion>
        ))}
      </View>

      <Button label="Add a Story Beat" variant="tertiary" style={styles.addButton} />

      {/* Notable NPCs */}
      <HorizontalCardRow title="Notable NPCs">
        {linkedNPCs.map((npc) => (
          <MiniCard
            key={npc.id}
            title={npc.name}
            onPress={() =>
              router.push(`/(main)/campaigns/${campaignId}/npcs/${npc.id}`)
            }
          />
        ))}
        <AddResourceMenu
          resourceType="NPC"
          onAddFromCampaign={() => {}}
          onAddFromCompendium={() => {}}
        />
      </HorizontalCardRow>

      {/* Maps */}
      <HorizontalCardRow title="Maps">
        {linkedMaps.map((map) => (
          <MiniCard
            key={map.id}
            title={map.name}
            onPress={() =>
              router.push(`/(main)/campaigns/${campaignId}/maps/${map.id}`)
            }
          />
        ))}
        <AddResourceMenu
          resourceType="Map"
          onAddFromCampaign={() => {}}
          onAddFromCompendium={() => {}}
        />
      </HorizontalCardRow>

      {/* Combat Modules */}
      <HorizontalCardRow title="Combat Modules">
        {linkedCombat.map((combat) => (
          <MiniCard
            key={combat.id}
            title={combat.title}
            onPress={() =>
              router.push(`/(main)/campaigns/${campaignId}/combat/${combat.id}`)
            }
          />
        ))}
        <AddResourceMenu
          resourceType="Combat Module"
          onAddFromCampaign={() => {}}
          onAddFromCompendium={() => {}}
        />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xl,
  },
  headerLeft: {
    flex: 1,
  },
  sessionLabel: {
    ...typography.subtitleSmall,
    color: colors.muted,
  },
  title: {
    ...typography.titleSmall,
    color: colors.foreground,
  },
  heroAvatars: {
    alignItems: 'flex-end',
  },
  heroesLabel: {
    ...typography.bodySmall,
    color: colors.muted,
    marginBottom: spacing.xs,
  },
  avatarRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.subtitleLarge,
    color: colors.foreground,
    marginBottom: spacing.md,
  },
  beatsContainer: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  accordion: {
    width: '100%',
  },
  beatBody: {
    ...typography.bodyMedium,
    color: colors.foreground,
    lineHeight: 24,
  },
  beatPlaceholder: {
    ...typography.bodyMedium,
    color: colors.muted,
    fontStyle: 'italic',
  },
  addButton: {
    alignSelf: 'center',
    marginBottom: spacing.xl,
  },
});
