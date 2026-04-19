import { useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

import BackButton from '@/components/navigation/BackButton';
import { PaginationDots } from '@/components/ui';
import { typography, spacing, radii, componentSizes } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';
import { MOCK_NPCS } from '@/utils/mock-data';

export default function NPCProfileScreen() {
  const { campaignId, npcId } = useLocalSearchParams<{
    campaignId: string;
    npcId: string;
  }>();
  const colors = useColors();

  const campaignNPCs = MOCK_NPCS.filter((n) => n.campaignId === campaignId);
  const initialIndex = campaignNPCs.findIndex((n) => n.id === npcId);
  const [activeIndex, setActiveIndex] = useState(initialIndex >= 0 ? initialIndex : 0);

  const npc = campaignNPCs[activeIndex];

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: 'transparent',
          padding: spacing['3xl'],
        },
        nameBar: {
          borderRadius: radii.card,
          borderWidth: componentSizes.strokeWidth,
          borderColor: colors.foreground,
          backgroundColor: colors.surface,
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.lg,
          alignItems: 'center',
          marginBottom: spacing.md,
        },
        name: {
          ...typography.subtitleLarge,
          color: colors.text.primary,
        },
        columns: {
          flex: 1,
          flexDirection: 'row',
          gap: spacing.md,
        },
        imageContainer: {
          flex: 1,
          borderRadius: radii.card,
          borderWidth: componentSizes.strokeWidth,
          borderColor: colors.foreground,
          backgroundColor: colors.surfaceSecondary,
          alignItems: 'center',
          justifyContent: 'center',
        },
        imagePlaceholder: {
          ...typography.bodyLarge,
          color: colors.muted,
        },
        rightColumn: {
          flex: 1,
          gap: spacing.md,
        },
        descriptionBox: {
          flex: 1,
          borderRadius: radii.card,
          borderWidth: componentSizes.strokeWidth,
          borderColor: colors.foreground,
          backgroundColor: colors.surface,
          padding: spacing.md,
        },
        abilitiesBox: {
          flex: 1,
          borderRadius: radii.card,
          borderWidth: componentSizes.strokeWidth,
          borderColor: colors.foreground,
          backgroundColor: colors.surface,
          padding: spacing.md,
        },
        fieldLabel: {
          ...typography.subtitleSmall,
          color: colors.text.primary,
          marginBottom: spacing.sm,
        },
        fieldText: {
          ...typography.bodyMedium,
          color: colors.text.secondary,
          lineHeight: 22,
        },
        pagination: {
          alignItems: 'center',
          paddingTop: spacing.lg,
        },
      }),
    [colors],
  );

  if (!npc) {
    return (
      <View style={styles.container}>
        <Text style={styles.name}>NPC not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BackButton label="Dashboard" />

      <View style={styles.nameBar}>
        <Text style={styles.name}>{npc.name}</Text>
      </View>

      <View style={styles.columns}>
        <View style={styles.imageContainer}>
          <Text style={styles.imagePlaceholder}>Character Image</Text>
        </View>

        <View style={styles.rightColumn}>
          <View style={styles.descriptionBox}>
            <Text style={styles.fieldLabel}>Character Description</Text>
            <Text style={styles.fieldText}>
              {npc.description || 'No description yet'}
            </Text>
          </View>
          <View style={styles.abilitiesBox}>
            <Text style={styles.fieldLabel}>Notable Abilities / Information</Text>
            <Text style={styles.fieldText}>
              {npc.notableAbilities || 'No abilities listed'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.pagination}>
        {campaignNPCs.map((_, i) => (
          <Pressable key={i} onPress={() => setActiveIndex(i)}>
            <View />
          </Pressable>
        ))}
        <PaginationDots total={campaignNPCs.length} activeIndex={activeIndex} />
      </View>
    </View>
  );
}
