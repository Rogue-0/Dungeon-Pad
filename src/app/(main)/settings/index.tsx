import React, { useMemo } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';

import BackButton from '@/components/navigation/BackButton';
import { typography, spacing, radii, componentSizes } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';
import { useThemePreference } from '@/theme/use-theme';
import type { ThemePreference } from '@/theme/theme-store';

const THEME_OPTIONS: { value: ThemePreference; label: string; description: string }[] = [
  { value: 'system', label: 'System', description: 'Follow your device setting' },
  { value: 'light', label: 'Light', description: 'Warm parchment — daylight' },
  { value: 'dark', label: 'Dark', description: 'Brown-black — low light' },
];

export default function SettingsScreen() {
  const colors = useColors();
  const [preference, setPreference] = useThemePreference();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: 'transparent',
        },
        content: {
          padding: spacing['3xl'],
          maxWidth: 720,
        },
        pageTitle: {
          ...typography.titleSmall,
          color: colors.text.primary,
          marginBottom: spacing.sm,
        },
        pageDescription: {
          ...typography.bodyLarge,
          color: colors.text.tertiary,
          marginBottom: spacing['2xl'],
        },
        sectionLabel: {
          ...typography.subtitleSmall,
          color: colors.text.primary,
          marginBottom: spacing.md,
        },
        optionList: {
          gap: spacing.sm,
          marginBottom: spacing['2xl'],
        },
        option: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.md,
          padding: spacing.md,
          borderRadius: radii.card,
          borderWidth: componentSizes.strokeWidth,
          borderColor: colors.border,
          backgroundColor: colors.surface,
        },
        optionSelected: {
          borderColor: colors.primary.default,
          backgroundColor: colors.surfaceHover,
        },
        radio: {
          width: 20,
          height: 20,
          borderRadius: 10,
          borderWidth: 2,
          borderColor: colors.muted,
          alignItems: 'center',
          justifyContent: 'center',
        },
        radioSelected: {
          borderColor: colors.primary.default,
        },
        radioDot: {
          width: 10,
          height: 10,
          borderRadius: 5,
          backgroundColor: colors.primary.default,
        },
        optionTextWrap: {
          flex: 1,
        },
        optionLabel: {
          ...typography.subtitleSmall,
          color: colors.text.primary,
        },
        optionDescription: {
          ...typography.bodyMedium,
          color: colors.text.tertiary,
          marginTop: 2,
        },
      }),
    [colors],
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <BackButton label="Back" />

      <Text style={styles.pageTitle}>Settings</Text>
      <Text style={styles.pageDescription}>
        Customize how Dungeon Pad looks and behaves.
      </Text>

      <Text style={styles.sectionLabel}>Appearance</Text>
      <View style={styles.optionList}>
        {THEME_OPTIONS.map((option) => {
          const isSelected = preference === option.value;
          return (
            <Pressable
              key={option.value}
              onPress={() => setPreference(option.value)}
              style={[styles.option, isSelected && styles.optionSelected]}
            >
              <View style={[styles.radio, isSelected && styles.radioSelected]}>
                {isSelected ? <View style={styles.radioDot} /> : null}
              </View>
              <View style={styles.optionTextWrap}>
                <Text style={styles.optionLabel}>{option.label}</Text>
                <Text style={styles.optionDescription}>{option.description}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}
