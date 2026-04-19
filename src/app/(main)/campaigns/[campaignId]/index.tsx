import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import React, { useCallback, useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, View, Text, StyleSheet } from 'react-native';

import HorizontalCardRow from '@/components/campaign/HorizontalCardRow';
import MiniCard from '@/components/campaign/MiniCard';
import NewEntityDialog from '@/components/campaign/NewEntityDialog';
import SessionsPlayedCounter from '@/components/campaign/SessionsPlayedCounter';
import BackButton from '@/components/navigation/BackButton';
import { Button, FadeMask } from '@/components/ui';
import { getDatabase } from '@/db/database';
import {
  combatsRepo,
  heroesRepo,
  mapsRepo,
  npcsRepo,
  sessionsRepo,
} from '@/db/repos';
import {
  useCampaign,
  useCombats,
  useHeroes,
  useMaps,
  useNpcs,
  useSessions,
} from '@/hooks/data';
import { useBackgroundPicker } from '@/hooks/useBackgroundPicker';
import { useBackgroundStore } from '@/theme/background-store';
import { typography, spacing, radii, componentSizes } from '@/theme/tokens';
import { useColors, useThemeMode } from '@/theme/use-theme';
import { formatRelativeDate } from '@/utils/format-relative-date';

const DAY_SCENE = require('../../../../../assets/images/campaigns-day.webp');
const NIGHT_SCENE = require('../../../../../assets/images/campaigns-night.webp');

type AddKind = 'hero' | 'session' | 'combat' | 'npc' | 'map' | null;

interface AddDialogConfig {
  title: string;
  primaryLabel: string;
  primaryPlaceholder: string;
  secondaryLabel: string;
  secondaryPlaceholder: string;
}

const ADD_DIALOG_CONFIG: Record<Exclude<AddKind, null>, AddDialogConfig> = {
  hero: {
    title: 'New hero',
    primaryLabel: 'Name',
    primaryPlaceholder: 'e.g. Sherizod',
    secondaryLabel: 'Class',
    secondaryPlaceholder: 'e.g. Paladin',
  },
  session: {
    title: 'New session',
    primaryLabel: 'Title',
    primaryPlaceholder: 'e.g. The Raven Hangs',
    secondaryLabel: 'Description',
    secondaryPlaceholder: 'e.g. The party arrives at the village of Barovia',
  },
  combat: {
    title: 'New combat module',
    primaryLabel: 'Title',
    primaryPlaceholder: 'e.g. Ambush at the bridge',
    secondaryLabel: 'Description',
    secondaryPlaceholder: 'e.g. Wolves strike when the party crosses the bridge',
  },
  npc: {
    title: 'New NPC',
    primaryLabel: 'Name',
    primaryPlaceholder: 'e.g. Madam Eva',
    secondaryLabel: 'Description',
    secondaryPlaceholder: 'e.g. A Vistani fortune-teller with deep secrets',
  },
  map: {
    title: 'New map',
    primaryLabel: 'Name',
    primaryPlaceholder: 'e.g. Castle Ravenloft',
    secondaryLabel: 'Description',
    secondaryPlaceholder: 'e.g. Strahd’s ancestral fortress',
  },
};

export default function CampaignOverviewScreen() {
  const { campaignId } = useLocalSearchParams<{ campaignId: string }>();
  const router = useRouter();
  const colors = useColors();
  const mode = useThemeMode();
  const [backgroundModalOpen, setBackgroundModalOpen] = useState(false);
  const [addKind, setAddKind] = useState<AddKind>(null);

  const campaignUri = useBackgroundStore(
    (s) => (campaignId ? s.customByCampaignId[campaignId] ?? null : null),
  );
  const setCampaignCustom = useBackgroundStore((s) => s.setCampaignCustom);
  const pickBackground = useBackgroundPicker((uri) => {
    if (campaignId) setCampaignCustom(campaignId, uri);
  });

  const { data: campaign, loading: campaignLoading } = useCampaign(campaignId);
  const sessionsQuery = useSessions(campaignId);
  const heroesQuery = useHeroes(campaignId);
  const combatsQuery = useCombats(campaignId);
  const npcsQuery = useNpcs(campaignId);
  const mapsQuery = useMaps(campaignId);

  const sessions = sessionsQuery.data ?? [];
  const heroes = heroesQuery.data ?? [];
  const combatModules = combatsQuery.data ?? [];
  const npcs = npcsQuery.data ?? [];
  const maps = mapsQuery.data ?? [];

  const refetchSessions = sessionsQuery.refetch;
  const refetchHeroes = heroesQuery.refetch;
  const refetchCombats = combatsQuery.refetch;
  const refetchNpcs = npcsQuery.refetch;
  const refetchMaps = mapsQuery.refetch;

  const previewSource = campaignUri
    ? { uri: campaignUri }
    : mode === 'dark'
      ? NIGHT_SCENE
      : DAY_SCENE;

  const handleCreate = useCallback(
    async (kind: Exclude<AddKind, null>, primary: string, secondary: string) => {
      if (!campaignId) return;
      const db = await getDatabase();
      const secondaryOrNull = secondary.trim() ? secondary : null;
      switch (kind) {
        case 'hero': {
          const created = await heroesRepo.create(db, {
            campaignId,
            name: primary,
            class: secondaryOrNull,
          });
          setAddKind(null);
          await refetchHeroes();
          router.push(`/(main)/campaigns/${campaignId}/heroes/${created.id}`);
          break;
        }
        case 'session': {
          const nextNumber = (sessions?.length ?? 0) + 1;
          const created = await sessionsRepo.create(db, {
            campaignId,
            title: primary,
            description: secondaryOrNull,
            sessionNumber: nextNumber,
          });
          setAddKind(null);
          await refetchSessions();
          router.push(`/(main)/campaigns/${campaignId}/sessions/${created.id}`);
          break;
        }
        case 'combat': {
          const created = await combatsRepo.create(db, {
            campaignId,
            title: primary,
            description: secondaryOrNull,
          });
          setAddKind(null);
          await refetchCombats();
          router.push(`/(main)/campaigns/${campaignId}/combat/${created.id}`);
          break;
        }
        case 'npc': {
          const created = await npcsRepo.create(db, {
            campaignId,
            name: primary,
            description: secondaryOrNull,
          });
          setAddKind(null);
          await refetchNpcs();
          router.push(`/(main)/campaigns/${campaignId}/npcs/${created.id}`);
          break;
        }
        case 'map': {
          const created = await mapsRepo.create(db, {
            campaignId,
            name: primary,
            description: secondaryOrNull,
          });
          setAddKind(null);
          await refetchMaps();
          router.push(`/(main)/campaigns/${campaignId}/maps/${created.id}`);
          break;
        }
      }
    },
    [
      campaignId,
      router,
      sessions,
      refetchHeroes,
      refetchSessions,
      refetchCombats,
      refetchNpcs,
      refetchMaps,
    ],
  );

  const handleImageChange = useCallback(
    (kind: Exclude<AddKind, null>) =>
      async (id: string, uri: string) => {
        const db = await getDatabase();
        switch (kind) {
          case 'hero':
            await heroesRepo.update(db, id, { imageUri: uri });
            await refetchHeroes();
            break;
          case 'session':
            await sessionsRepo.update(db, id, { imageUri: uri });
            await refetchSessions();
            break;
          case 'combat':
            await combatsRepo.update(db, id, { imageUri: uri });
            await refetchCombats();
            break;
          case 'npc':
            await npcsRepo.update(db, id, { imageUri: uri });
            await refetchNpcs();
            break;
          case 'map':
            await mapsRepo.update(db, id, { imageUri: uri });
            await refetchMaps();
            break;
        }
      },
    [refetchHeroes, refetchSessions, refetchCombats, refetchNpcs, refetchMaps],
  );

  const handleDelete = useCallback(
    (kind: Exclude<AddKind, null>) => async (id: string) => {
      const db = await getDatabase();
      switch (kind) {
        case 'hero':
          await heroesRepo.remove(db, id);
          await refetchHeroes();
          break;
        case 'session':
          await sessionsRepo.remove(db, id);
          await refetchSessions();
          break;
        case 'combat':
          await combatsRepo.remove(db, id);
          await refetchCombats();
          break;
        case 'npc':
          await npcsRepo.remove(db, id);
          await refetchNpcs();
          break;
        case 'map':
          await mapsRepo.remove(db, id);
          await refetchMaps();
          break;
      }
    },
    [refetchHeroes, refetchSessions, refetchCombats, refetchNpcs, refetchMaps],
  );

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
          overflow: 'hidden',
        },
        sectionLabel: {
          ...typography.subtitleSmall,
          color: colors.text.primary,
          marginBottom: spacing.sm,
        },
        heroScrollContent: {
          flexDirection: 'row',
          gap: spacing.md,
        },
        title: {
          ...typography.titleSmall,
          color: colors.text.primary,
          padding: spacing['3xl'],
        },
        modalOverlay: {
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          alignItems: 'center',
          justifyContent: 'center',
          padding: spacing.lg,
        },
        modalDialog: {
          width: '100%',
          maxWidth: 480,
          borderRadius: radii.card,
          borderWidth: componentSizes.strokeWidth,
          borderColor: colors.border,
          backgroundColor: colors.surface,
          padding: spacing.lg,
          gap: spacing.md,
        },
        modalTitle: {
          ...typography.subtitleLarge,
          color: colors.text.primary,
        },
        modalDescription: {
          ...typography.bodyMedium,
          color: colors.text.tertiary,
        },
        modalPreview: {
          width: '100%',
          aspectRatio: 16 / 9,
          borderRadius: radii.input,
          overflow: 'hidden',
          backgroundColor: colors.surfaceSecondary,
        },
        modalPreviewImage: {
          width: '100%',
          height: '100%',
        },
        modalActions: {
          flexDirection: 'row',
          gap: spacing.sm,
          flexWrap: 'wrap',
        },
      }),
    [colors],
  );

  if (campaignLoading) {
    return <View style={styles.container} />;
  }

  if (!campaign) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Campaign not found</Text>
      </View>
    );
  }

  const latestPlayedAt =
    sessions
      .map((s) => s.playedAt)
      .filter((d): d is string => Boolean(d))
      .sort()
      .reverse()[0] ?? null;

  const addConfig = addKind ? ADD_DIALOG_CONFIG[addKind] : null;

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
              label="Edit Background"
              variant="tertiary"
              onPress={() => setBackgroundModalOpen(true)}
            />
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
            <FadeMask>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.heroScrollContent}
              >
                {heroes.map((hero, i) => (
                  <MiniCard
                    key={hero.id}
                    title={hero.name}
                    description={hero.class}
                    imageUri={hero.imageUri}
                    gradientIndex={i + 3}
                    placeholderType="hero"
                    size="small"
                    onPress={() =>
                      router.push(`/(main)/campaigns/${campaignId}/heroes/${hero.id}`)
                    }
                    onImageChange={(uri) => handleImageChange('hero')(hero.id, uri)}
                    onDelete={() => handleDelete('hero')(hero.id)}
                  />
                ))}
                <MiniCard
                  title="Add Hero"
                  isAddCard
                  size="small"
                  onPress={() => setAddKind('hero')}
                />
              </ScrollView>
            </FadeMask>
          </View>
          <SessionsPlayedCounter
            count={sessions.length}
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
              title={session.title}
              description={session.description}
              imageUri={session.imageUri}
              gradientIndex={i}
              placeholderType="session"
              sessionNumber={session.sessionNumber}
              onPress={() =>
                router.push(`/(main)/campaigns/${campaignId}/sessions/${session.id}`)
              }
              onImageChange={(uri) => handleImageChange('session')(session.id, uri)}
              onDelete={() => handleDelete('session')(session.id)}
            />
          ))}
          <MiniCard
            title="Add Session"
            isAddCard
            onPress={() => setAddKind('session')}
          />
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
              onImageChange={(uri) => handleImageChange('combat')(combat.id, uri)}
              onDelete={() => handleDelete('combat')(combat.id)}
            />
          ))}
          <MiniCard
            title="Add Combat Module"
            isAddCard
            onPress={() => setAddKind('combat')}
          />
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
              onImageChange={(uri) => handleImageChange('npc')(npc.id, uri)}
              onDelete={() => handleDelete('npc')(npc.id)}
            />
          ))}
          <MiniCard title="Add NPC" isAddCard onPress={() => setAddKind('npc')} />
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
              onImageChange={(uri) => handleImageChange('map')(map.id, uri)}
              onDelete={() => handleDelete('map')(map.id)}
            />
          ))}
          <MiniCard title="Add Map" isAddCard onPress={() => setAddKind('map')} />
        </HorizontalCardRow>
      </ScrollView>

      {addKind && addConfig ? (
        <NewEntityDialog
          visible
          title={addConfig.title}
          primaryLabel={addConfig.primaryLabel}
          primaryPlaceholder={addConfig.primaryPlaceholder}
          secondaryLabel={addConfig.secondaryLabel}
          secondaryPlaceholder={addConfig.secondaryPlaceholder}
          onClose={() => setAddKind(null)}
          onSubmit={(primary, secondary) => handleCreate(addKind, primary, secondary)}
        />
      ) : null}

      <Modal
        visible={backgroundModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setBackgroundModalOpen(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setBackgroundModalOpen(false)}>
          <Pressable style={styles.modalDialog} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>Campaign Background</Text>
            <Text style={styles.modalDescription}>
              {campaignUri
                ? 'This campaign uses a custom background everywhere inside it.'
                : 'Choose an image to use whenever you’re inside this campaign. Falls back to the app background if unset.'}
            </Text>
            <View style={styles.modalPreview}>
              <Image
                source={previewSource}
                style={styles.modalPreviewImage}
                contentFit="cover"
              />
            </View>
            <View style={styles.modalActions}>
              <Button
                variant="secondary"
                label={campaignUri ? 'Change Image' : 'Choose Image'}
                onPress={pickBackground}
              />
              {campaignUri ? (
                <Button
                  variant="tertiary"
                  label="Reset"
                  onPress={() => campaignId && setCampaignCustom(campaignId, null)}
                />
              ) : null}
              <Button
                variant="tertiary"
                label="Close"
                onPress={() => setBackgroundModalOpen(false)}
              />
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
