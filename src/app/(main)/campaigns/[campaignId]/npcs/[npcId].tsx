import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { colors, typography, spacing } from '@/theme/tokens';

/** NPC profile — image, description, and abilities */
export default function NPCProfileScreen() {
  const { npcId } = useLocalSearchParams<{ npcId: string }>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>NPC Profile</Text>
      <Text style={styles.subtitle}>ID: {npcId}</Text>
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
