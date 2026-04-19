import { useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import BackButton from '@/components/navigation/BackButton';
import { typography, spacing, radii, componentSizes } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';
import { MOCK_MAPS } from '@/utils/mock-data';

export default function MapScreen() {
  const { mapId } = useLocalSearchParams<{ mapId: string }>();
  const colors = useColors();
  const map = MOCK_MAPS.find((m) => m.id === mapId);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: 'transparent',
          padding: spacing['3xl'],
        },
        name: {
          ...typography.subtitleLarge,
          color: colors.text.primary,
          marginBottom: spacing.md,
        },
        imageArea: {
          flex: 1,
          borderRadius: radii.card,
          borderWidth: componentSizes.strokeWidth,
          borderColor: colors.foreground,
          backgroundColor: colors.surfaceSecondary,
          alignItems: 'center',
          justifyContent: 'center',
        },
        placeholder: {
          ...typography.bodyLarge,
          color: colors.muted,
        },
      }),
    [colors],
  );

  if (!map) {
    return (
      <View style={styles.container}>
        <Text style={styles.name}>Map not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BackButton label="Dashboard" />
      <Text style={styles.name}>{map.name}</Text>
      <View style={styles.imageArea}>
        <Text style={styles.placeholder}>Map Image</Text>
      </View>
    </View>
  );
}
