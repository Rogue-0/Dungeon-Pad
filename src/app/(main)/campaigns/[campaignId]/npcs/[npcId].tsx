import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

import BackButton from '@/components/navigation/BackButton';
import { PaginationDots } from '@/components/ui';
import { colors, typography, spacing, radii, componentSizes } from '@/theme/tokens';
import { MOCK_NPCS } from '@/utils/mock-data';

export default function NPCProfileScreen() {
  const { campaignId, npcId } = useLocalSearchParams<{
    campaignId: string;
    npcId: string;
  }>();

  const campaignNPCs = MOCK_NPCS.filter((n) => n.campaignId === campaignId);
  const initialIndex = campaignNPCs.findIndex((n) => n.id === npcId);
  const [activeIndex, setActiveIndex] = useState(initialIndex >= 0 ? initialIndex : 0);

  const npc = campaignNPCs[activeIndex];

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

      {/* Name */}
      <View style={styles.nameBar}>
        <Text style={styles.name}>{npc.name}</Text>
      </View>

      {/* Two-column layout */}
      <View style={styles.columns}>
        {/* Left: Character Image */}
        <View style={styles.imageContainer}>
          <Text style={styles.imagePlaceholder}>Character Image</Text>
        </View>

        {/* Right: Description + Abilities */}
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

      {/* Pagination */}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
    color: colors.foreground,
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
    color: colors.foreground,
    marginBottom: spacing.sm,
  },
  fieldText: {
    ...typography.bodyMedium,
    color: colors.foreground,
    lineHeight: 22,
  },
  pagination: {
    alignItems: 'center',
    paddingTop: spacing.lg,
  },
});
