import React, { useMemo, useState } from 'react';
import { Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';

import BackButton from '@/components/navigation/BackButton';
import { Button } from '@/components/ui';
import { resetDatabase } from '@/db/database';
import { useBackgroundPicker } from '@/hooks/useBackgroundPicker';
import { useBackgroundStore } from '@/theme/background-store';
import { componentSizes, radii, spacing, typography } from '@/theme/tokens';
import { useColors, useThemeMode, useThemePreference } from '@/theme/use-theme';
import type { ThemePreference } from '@/theme/theme-store';

const DAY_SCENE = require('../../../../assets/images/campaigns-day.webp');
const NIGHT_SCENE = require('../../../../assets/images/campaigns-night.webp');

const THEME_OPTIONS: { value: ThemePreference; label: string; description: string }[] = [
  { value: 'system', label: 'System', description: 'Follow your device setting' },
  { value: 'light', label: 'Light', description: 'Warm parchment — daylight' },
  { value: 'dark', label: 'Dark', description: 'Brown-black — low light' },
];

export default function SettingsScreen() {
  const colors = useColors();
  const mode = useThemeMode();
  const [preference, setPreference] = useThemePreference();
  const customUri = useBackgroundStore((s) => s.customUri);
  const setCustom = useBackgroundStore((s) => s.setCustom);

  const pickBackground = useBackgroundPicker(setCustom);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [resetState, setResetState] = useState<'idle' | 'working' | 'done' | 'error'>(
    'idle',
  );
  const [resetError, setResetError] = useState<string | null>(null);

  const handleReset = async () => {
    setResetState('working');
    setResetError(null);
    try {
      await resetDatabase();
      setResetState('done');
    } catch (err) {
      setResetState('error');
      setResetError(err instanceof Error ? err.message : String(err));
    }
  };

  const closeConfirm = () => {
    if (resetState === 'working') return;
    setConfirmOpen(false);
    setResetState('idle');
    setResetError(null);
  };

  const previewSource = customUri ? { uri: customUri } : mode === 'dark' ? NIGHT_SCENE : DAY_SCENE;

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
        backgroundCard: {
          borderRadius: radii.card,
          borderWidth: componentSizes.strokeWidth,
          borderColor: colors.border,
          backgroundColor: colors.surface,
          padding: spacing.md,
          gap: spacing.md,
          marginBottom: spacing['2xl'],
        },
        preview: {
          width: '100%',
          aspectRatio: 16 / 9,
          borderRadius: radii.input,
          overflow: 'hidden',
          backgroundColor: colors.surfaceSecondary,
        },
        previewImage: {
          width: '100%',
          height: '100%',
        },
        backgroundStatus: {
          ...typography.bodyMedium,
          color: colors.text.tertiary,
        },
        actionsRow: {
          flexDirection: 'row',
          gap: spacing.sm,
          flexWrap: 'wrap',
        },
        dangerCard: {
          borderRadius: radii.card,
          borderWidth: componentSizes.strokeWidth,
          borderColor: colors.destructive.default,
          backgroundColor: colors.surface,
          padding: spacing.md,
          gap: spacing.sm,
          marginBottom: spacing['2xl'],
        },
        dangerTitle: {
          ...typography.subtitleSmall,
          color: colors.destructive.default,
        },
        dangerDescription: {
          ...typography.bodyMedium,
          color: colors.text.tertiary,
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
        modalBody: {
          ...typography.bodyMedium,
          color: colors.text.secondary,
        },
        modalStatusError: {
          ...typography.bodyMedium,
          color: colors.destructive.default,
        },
        modalStatusOk: {
          ...typography.bodyMedium,
          color: colors.primary.default,
        },
        modalActions: {
          flexDirection: 'row',
          gap: spacing.sm,
          flexWrap: 'wrap',
          justifyContent: 'flex-end',
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

      <Text style={styles.sectionLabel}>Background</Text>
      <View style={styles.backgroundCard}>
        <View style={styles.preview}>
          <Image source={previewSource} style={styles.previewImage} contentFit="cover" />
        </View>
        <Text style={styles.backgroundStatus}>
          {customUri
            ? 'Using your custom background.'
            : 'Using the default day/night scene.'}
        </Text>
        <View style={styles.actionsRow}>
          <Button
            variant="secondary"
            label={customUri ? 'Change Background' : 'Choose Background'}
            onPress={pickBackground}
          />
          {customUri ? (
            <Button
              variant="tertiary"
              label="Reset to Default"
              onPress={() => setCustom(null)}
            />
          ) : null}
        </View>
      </View>

      <Text style={styles.sectionLabel}>Developer</Text>
      <View style={styles.dangerCard}>
        <Text style={styles.dangerTitle}>Reset Database</Text>
        <Text style={styles.dangerDescription}>
          Deletes all campaigns, sessions, heroes, NPCs, and notes, then reseeds with the
          default sample content. Useful for testing migrations and seed data.
        </Text>
        <View style={styles.actionsRow}>
          <Button
            variant="destructive"
            label="Reset Database"
            onPress={() => setConfirmOpen(true)}
          />
        </View>
      </View>

      <Modal
        visible={confirmOpen}
        transparent
        animationType="fade"
        onRequestClose={closeConfirm}
      >
        <Pressable style={styles.modalOverlay} onPress={closeConfirm}>
          <Pressable style={styles.modalDialog} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>Reset database?</Text>
            <Text style={styles.modalBody}>
              This wipes everything in the local database and restores the default sample
              data (Curse of Strahd + Icewind Dale). This cannot be undone.
            </Text>
            {resetState === 'done' ? (
              <Text style={styles.modalStatusOk}>
                Done. {Platform.OS === 'web'
                  ? 'Reload the page to see the seeded data.'
                  : 'Fully quit and reopen the app (or reload in Expo Go) to pick up the fresh data.'}
              </Text>
            ) : null}
            {resetState === 'error' ? (
              <Text style={styles.modalStatusError}>Reset failed: {resetError}</Text>
            ) : null}
            <View style={styles.modalActions}>
              {resetState === 'done' ? (
                <Button variant="secondary" label="Close" onPress={closeConfirm} />
              ) : (
                <>
                  <Button
                    variant="tertiary"
                    label="Cancel"
                    onPress={closeConfirm}
                    disabled={resetState === 'working'}
                  />
                  <Button
                    variant="destructive"
                    label={resetState === 'working' ? 'Resetting…' : 'Reset'}
                    onPress={handleReset}
                    disabled={resetState === 'working'}
                  />
                </>
              )}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}
