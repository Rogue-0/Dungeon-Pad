import { useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

import BackButton from '@/components/navigation/BackButton';
import { Avatar, Badge, Button, FadeMask, PaginationDots } from '@/components/ui';
import { typography, spacing, radii, componentSizes } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';
import {
  MOCK_COMBAT_MODULES,
  MOCK_COMBAT_MONSTERS,
  MOCK_HEROES,
} from '@/utils/mock-data';

export default function CombatModuleScreen() {
  const { campaignId, combatId } = useLocalSearchParams<{
    campaignId: string;
    combatId: string;
  }>();
  const colors = useColors();

  const campaignCombat = MOCK_COMBAT_MODULES.filter((c) => c.campaignId === campaignId);
  const initialIndex = campaignCombat.findIndex((c) => c.id === combatId);
  const [activeIndex, setActiveIndex] = useState(initialIndex >= 0 ? initialIndex : 0);

  const combat = campaignCombat[activeIndex];
  const monsters = MOCK_COMBAT_MONSTERS.filter((m) => m.combatModuleId === combat?.id);
  const heroes = MOCK_HEROES.filter((h) => h.campaignId === campaignId);

  const initiativeOrder = [
    ...heroes.map((h) => ({ id: h.id, name: h.name, type: 'hero' as const })),
    ...monsters.map((m) => ({ id: m.id, name: m.name, type: 'monster' as const })),
  ];
  const [activeInitiative, setActiveInitiative] = useState(0);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: 'transparent',
          padding: spacing['3xl'],
        },
        titleBar: {
          borderRadius: radii.card,
          borderWidth: componentSizes.strokeWidth,
          borderColor: colors.foreground,
          backgroundColor: colors.surface,
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.lg,
          alignItems: 'center',
          marginBottom: spacing.md,
        },
        title: {
          ...typography.subtitleLarge,
          color: colors.text.primary,
        },
        initiativeCard: {
          borderRadius: radii.card,
          borderWidth: componentSizes.strokeWidth,
          borderColor: colors.foreground,
          backgroundColor: colors.surface,
          padding: spacing.md,
          marginBottom: spacing.md,
        },
        sectionLabel: {
          ...typography.subtitleSmall,
          color: colors.text.primary,
          marginBottom: spacing.md,
        },
        initiativeRow: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.md,
        },
        avatarScrollWrap: {
          flex: 1,
        },
        avatarScroll: {
          gap: spacing.sm,
        },
        initiativeAvatar: {
          opacity: 0.5,
        },
        activeAvatar: {
          opacity: 1,
          borderWidth: 3,
          borderColor: colors.primary.default,
        },
        initiativeButtons: {
          flexDirection: 'row',
          gap: spacing.sm,
        },
        monsterCard: {
          flex: 1,
          borderRadius: radii.card,
          borderWidth: componentSizes.strokeWidth,
          borderColor: colors.foreground,
          backgroundColor: colors.surface,
          padding: spacing.lg,
        },
        monsterName: {
          ...typography.subtitleLarge,
          color: colors.text.primary,
          marginBottom: spacing.md,
        },
        statsRow: {
          flexDirection: 'row',
          gap: spacing.md,
          flex: 1,
        },
        statBlock: {
          flex: 1,
          borderRadius: radii.card,
          borderWidth: componentSizes.strokeWidth,
          borderColor: colors.foreground,
          padding: spacing.md,
        },
        statBlockLabel: {
          ...typography.subtitleSmall,
          color: colors.muted,
          marginBottom: spacing.sm,
        },
        statBlockScroll: {
          flex: 1,
        },
        statBlockText: {
          ...typography.bodyMedium,
          color: colors.text.secondary,
          lineHeight: 22,
        },
        pagination: {
          paddingTop: spacing.lg,
        },
      }),
    [colors],
  );

  if (!combat) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Combat not found</Text>
      </View>
    );
  }

  const handleNext = () => {
    setActiveInitiative((prev) =>
      prev < initiativeOrder.length - 1 ? prev + 1 : prev
    );
  };

  const handleBack = () => {
    setActiveInitiative((prev) => (prev > 0 ? prev - 1 : prev));
  };

  return (
    <View style={styles.container}>
      <BackButton label="Dashboard" />

      <View style={styles.titleBar}>
        <Text style={styles.title}>{combat.title}</Text>
      </View>

      <View style={styles.initiativeCard}>
        <Text style={styles.sectionLabel}>Initiative Order</Text>
        <View style={styles.initiativeRow}>
          <FadeMask style={styles.avatarScrollWrap}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.avatarScroll}
            >
              {initiativeOrder.map((entry, i) => (
                <Avatar
                  key={entry.id}
                  name={entry.name}
                  size={44}
                  style={[
                    styles.initiativeAvatar,
                    i === activeInitiative && styles.activeAvatar,
                  ]}
                />
              ))}
            </ScrollView>
          </FadeMask>
          <View style={styles.initiativeButtons}>
            <Button label="Back" variant="tertiary" onPress={handleBack} />
            <Button label="Next" variant="primary" onPress={handleNext} />
          </View>
        </View>
      </View>

      {monsters.map((monster) => (
        <View key={monster.id} style={styles.monsterCard}>
          <Text style={styles.monsterName}>{monster.name}</Text>
          <View style={styles.statsRow}>
            <Badge label="HP" value={monster.hp ?? '—'} />
            <Badge label="AC" value={monster.ac ?? '—'} />
            <Badge label="Speed" value={monster.speed ?? '—'} />

            <View style={styles.statBlock}>
              <Text style={styles.statBlockLabel}>Monster Stat Block</Text>
              <ScrollView style={styles.statBlockScroll}>
                <Text style={styles.statBlockText}>
                  {monster.statBlock || 'No stat block available'}
                </Text>
              </ScrollView>
            </View>
          </View>
        </View>
      ))}

      <PaginationDots
        total={campaignCombat.length}
        activeIndex={activeIndex}
        style={styles.pagination}
      />
    </View>
  );
}
