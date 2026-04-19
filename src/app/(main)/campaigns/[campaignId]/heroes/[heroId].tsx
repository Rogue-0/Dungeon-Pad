import * as DocumentPicker from 'expo-document-picker';
import { useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Modal,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';

import BackButton from '@/components/navigation/BackButton';
import { Badge, Button, PaginationDots } from '@/components/ui';
import { typography, spacing, radii, componentSizes } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';
import { MOCK_HEROES } from '@/utils/mock-data';

type EditableField =
  | 'name'
  | 'playerName'
  | 'race'
  | 'class'
  | 'level'
  | 'hp'
  | 'ac'
  | 'speed'
  | 'backstory'
  | 'notableAbilities'
  | 'strength'
  | 'dexterity'
  | 'constitution'
  | 'intelligence'
  | 'wisdom'
  | 'charisma';

const STAT_LABELS: { key: string; label: string; abbr: string }[] = [
  { key: 'strength', label: 'Strength', abbr: 'STR' },
  { key: 'dexterity', label: 'Dexterity', abbr: 'DEX' },
  { key: 'constitution', label: 'Constitution', abbr: 'CON' },
  { key: 'intelligence', label: 'Intelligence', abbr: 'INT' },
  { key: 'wisdom', label: 'Wisdom', abbr: 'WIS' },
  { key: 'charisma', label: 'Charisma', abbr: 'CHA' },
];

function getModifier(score: number | null): string {
  if (score == null) return '—';
  const mod = Math.floor((score - 10) / 2);
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

export default function HeroProfileScreen() {
  const { campaignId, heroId } = useLocalSearchParams<{
    campaignId: string;
    heroId: string;
  }>();
  const colors = useColors();

  const campaignHeroes = MOCK_HEROES.filter((h) => h.campaignId === campaignId);
  const initialIndex = campaignHeroes.findIndex((h) => h.id === heroId);
  const [activeIndex, setActiveIndex] = useState(initialIndex >= 0 ? initialIndex : 0);

  // Edit modal state
  const [editField, setEditField] = useState<EditableField | null>(null);
  const [editValue, setEditValue] = useState('');
  const [editLabel, setEditLabel] = useState('');

  const hero = campaignHeroes[activeIndex];

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: 'transparent',
        },
        scrollContent: {
          padding: spacing['3xl'],
          paddingBottom: spacing['4xl'],
        },
        topBar: {
          flexDirection: 'row',
          gap: spacing.md,
          alignItems: 'center',
          marginBottom: spacing.md,
        },
        nameBar: {
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: radii.card,
          borderWidth: componentSizes.strokeWidth,
          borderColor: colors.foreground,
          backgroundColor: colors.surface,
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.lg,
        },
        heroName: {
          ...typography.subtitleLarge,
          color: colors.text.primary,
        },
        editHint: {
          ...typography.bodySmall,
          color: colors.primary.default,
        },
        infoRow: {
          flexDirection: 'row',
          gap: spacing.sm,
          marginBottom: spacing.md,
        },
        infoChip: {
          flex: 1,
          borderRadius: radii.card,
          borderWidth: componentSizes.strokeWidth,
          borderColor: colors.foreground,
          backgroundColor: colors.surface,
          padding: spacing.sm,
          alignItems: 'center',
        },
        infoLabel: {
          ...typography.bodySmall,
          color: colors.muted,
        },
        infoValue: {
          ...typography.subtitleSmall,
          color: colors.text.primary,
          marginTop: 2,
        },
        columns: {
          flexDirection: 'row',
          gap: spacing.md,
          marginBottom: spacing.md,
        },
        leftColumn: {
          flex: 1,
          gap: spacing.md,
        },
        rightColumn: {
          flex: 1,
          gap: spacing.md,
        },
        imageContainer: {
          flex: 1,
          minHeight: 300,
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
        combatStats: {
          flexDirection: 'row',
          gap: spacing.sm,
          justifyContent: 'center',
        },
        textBox: {
          flex: 1,
          borderRadius: radii.card,
          borderWidth: componentSizes.strokeWidth,
          borderColor: colors.foreground,
          backgroundColor: colors.surface,
          padding: spacing.md,
        },
        fieldHeader: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: spacing.sm,
        },
        fieldLabel: {
          ...typography.subtitleSmall,
          color: colors.text.primary,
        },
        fieldText: {
          ...typography.bodyMedium,
          color: colors.text.secondary,
          lineHeight: 22,
        },
        statsSection: {
          marginBottom: spacing.md,
        },
        statsSectionTitle: {
          ...typography.subtitleSmall,
          color: colors.text.primary,
          marginBottom: spacing.sm,
        },
        statsRow: {
          flexDirection: 'row',
          gap: spacing.sm,
          justifyContent: 'center',
        },
        statCard: {
          borderRadius: radii.card,
          borderWidth: componentSizes.strokeWidth,
          borderColor: colors.foreground,
          backgroundColor: colors.surface,
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.md,
          alignItems: 'center',
          minWidth: 80,
        },
        statAbbr: {
          ...typography.bodySmall,
          color: colors.muted,
          fontFamily: 'Magra-Bold',
        },
        statScore: {
          ...typography.subtitleLarge,
          color: colors.text.primary,
        },
        statMod: {
          ...typography.bodySmall,
          color: colors.text.secondary,
          marginTop: 2,
        },
        pagination: {
          alignItems: 'center',
          paddingTop: spacing.lg,
        },
        overlay: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.overlay,
        },
        dialog: {
          backgroundColor: colors.surface,
          borderRadius: radii.card,
          borderWidth: componentSizes.strokeWidth,
          borderColor: colors.foreground,
          padding: spacing.xl,
          maxWidth: 480,
          width: '90%',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.2,
          shadowRadius: 24,
          elevation: 10,
        },
        dialogTitle: {
          ...typography.subtitleLarge,
          color: colors.text.primary,
          marginBottom: spacing.md,
        },
        dialogInput: {
          ...typography.bodyMedium,
          borderRadius: radii.input,
          borderWidth: componentSizes.strokeWidth,
          borderColor: colors.border,
          backgroundColor: colors.background,
          padding: spacing.md,
          color: colors.text.primary,
          marginBottom: spacing.lg,
        },
        dialogInputMultiline: {
          minHeight: 120,
          textAlignVertical: 'top',
        },
        dialogActions: {
          flexDirection: 'row',
          justifyContent: 'flex-end',
          gap: spacing.md,
        },
        dialogButton: {
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.lg,
          borderRadius: radii.button,
        },
        dialogButtonSave: {
          backgroundColor: colors.primary.default,
        },
        dialogButtonTextCancel: {
          ...typography.bodyMedium,
          color: colors.text.secondary,
        },
        dialogButtonTextSave: {
          ...typography.bodyMedium,
          color: '#FFFFFF',
          fontFamily: 'Magra-Bold',
        },
      }),
    [colors],
  );

  if (!hero) {
    return (
      <View style={styles.container}>
        <Text style={styles.heroName}>Hero not found</Text>
      </View>
    );
  }

  const openEdit = (field: EditableField, label: string, currentValue: string) => {
    setEditField(field);
    setEditLabel(label);
    setEditValue(currentValue);
  };

  const saveEdit = () => {
    // In the future this will persist to the database
    // For now we just close the modal
    setEditField(null);
  };

  const [importing, setImporting] = useState(false);

  const handleImportPdf = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets?.[0]) return;

      setImporting(true);
      const fileUri = result.assets[0].uri;
      const { parseCharacterPdf } = await import('@/utils/parse-character-pdf');
      const parsed = await parseCharacterPdf(fileUri);

      // Build a summary of what was found
      const fields: string[] = [];
      if (parsed.name) fields.push(`Name: ${parsed.name}`);
      if (parsed.race) fields.push(`Race: ${parsed.race}`);
      if (parsed.class) fields.push(`Class: ${parsed.class}`);
      if (parsed.level) fields.push(`Level: ${parsed.level}`);
      if (parsed.hp) fields.push(`HP: ${parsed.hp}`);
      if (parsed.ac) fields.push(`AC: ${parsed.ac}`);
      if (parsed.speed) fields.push(`Speed: ${parsed.speed}`);
      if (parsed.stats) fields.push('Ability Scores found');
      if (parsed.backstory) fields.push('Backstory found');

      if (fields.length === 0) {
        const msg = 'Could not extract character data from this PDF. Try a standard D&D 5e character sheet with form fields.';
        if (Platform.OS === 'web') {
          window.alert(msg);
        } else {
          Alert.alert('No Data Found', msg);
        }
      } else {
        // In the future, this will auto-fill and persist the hero fields
        const msg = `Extracted ${fields.length} fields:\n\n${fields.join('\n')}\n\nPersistence coming soon — fields will auto-fill once database is connected.`;
        if (Platform.OS === 'web') {
          window.alert(msg);
        } else {
          Alert.alert('Character Data Found', msg);
        }
      }
    } catch (err) {
      const msg = 'Failed to read PDF. Please try a different file.';
      if (Platform.OS === 'web') {
        window.alert(msg);
      } else {
        Alert.alert('Import Error', msg);
      }
    } finally {
      setImporting(false);
    }
  };

  const isMultiline = editField === 'backstory' || editField === 'notableAbilities';

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <BackButton label="Dashboard" />

        {/* Name Bar + Import */}
        <View style={styles.topBar}>
          <Pressable
            style={styles.nameBar}
            onPress={() => openEdit('name', 'Character Name', hero.name)}
          >
            <Text style={styles.heroName}>{hero.name}</Text>
            <Text style={styles.editHint}>Edit</Text>
          </Pressable>
          <Button
            label={importing ? 'Importing...' : 'Import Character Sheet'}
            variant="secondary"
            onPress={handleImportPdf}
          />
        </View>

        {/* Info Row: Race, Class, Level, Player */}
        <View style={styles.infoRow}>
          <Pressable
            style={styles.infoChip}
            onPress={() => openEdit('race', 'Race', hero.race ?? '')}
          >
            <Text style={styles.infoLabel}>Race</Text>
            <Text style={styles.infoValue}>{hero.race || '—'}</Text>
          </Pressable>
          <Pressable
            style={styles.infoChip}
            onPress={() => openEdit('class', 'Class', hero.class ?? '')}
          >
            <Text style={styles.infoLabel}>Class</Text>
            <Text style={styles.infoValue}>{hero.class || '—'}</Text>
          </Pressable>
          <Pressable
            style={styles.infoChip}
            onPress={() => openEdit('level', 'Level', String(hero.level ?? ''))}
          >
            <Text style={styles.infoLabel}>Level</Text>
            <Text style={styles.infoValue}>{hero.level ?? '—'}</Text>
          </Pressable>
          <Pressable
            style={styles.infoChip}
            onPress={() => openEdit('playerName', 'Player Name', hero.playerName ?? '')}
          >
            <Text style={styles.infoLabel}>Player</Text>
            <Text style={styles.infoValue}>{hero.playerName || '—'}</Text>
          </Pressable>
        </View>

        {/* Two-column layout */}
        <View style={styles.columns}>
          {/* Left: Image + Combat Stats */}
          <View style={styles.leftColumn}>
            <View style={styles.imageContainer}>
              <Text style={styles.imagePlaceholder}>Character Image</Text>
            </View>

            {/* Combat Stats: HP, AC, Speed */}
            <View style={styles.combatStats}>
              <Pressable onPress={() => openEdit('hp', 'Hit Points', String(hero.hp ?? ''))}>
                <Badge label="HP" value={hero.hp ?? '—'} />
              </Pressable>
              <Pressable onPress={() => openEdit('ac', 'Armor Class', String(hero.ac ?? ''))}>
                <Badge label="AC" value={hero.ac ?? '—'} />
              </Pressable>
              <Pressable onPress={() => openEdit('speed', 'Speed', hero.speed ?? '')}>
                <Badge label="Speed" value={hero.speed ?? '—'} />
              </Pressable>
            </View>
          </View>

          {/* Right: Backstory + Abilities */}
          <View style={styles.rightColumn}>
            <Pressable
              style={styles.textBox}
              onPress={() => openEdit('backstory', 'Backstory', hero.backstory ?? '')}
            >
              <View style={styles.fieldHeader}>
                <Text style={styles.fieldLabel}>Backstory</Text>
                <Text style={styles.editHint}>Edit</Text>
              </View>
              <Text style={styles.fieldText}>
                {hero.backstory || 'No backstory yet. Tap to add one.'}
              </Text>
            </Pressable>

            <Pressable
              style={styles.textBox}
              onPress={() =>
                openEdit('notableAbilities', 'Notable Abilities', hero.notableAbilities ?? '')
              }
            >
              <View style={styles.fieldHeader}>
                <Text style={styles.fieldLabel}>Notable Abilities</Text>
                <Text style={styles.editHint}>Edit</Text>
              </View>
              <Text style={styles.fieldText}>
                {hero.notableAbilities || 'No abilities listed. Tap to add some.'}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Ability Scores */}
        <View style={styles.statsSection}>
          <Text style={styles.statsSectionTitle}>Ability Scores</Text>
          <View style={styles.statsRow}>
            {STAT_LABELS.map(({ key, abbr }) => {
              const score = hero.stats?.[key as keyof typeof hero.stats] ?? null;
              return (
                <Pressable
                  key={key}
                  onPress={() =>
                    openEdit(key as EditableField, abbr, String(score ?? ''))
                  }
                >
                  <View style={styles.statCard}>
                    <Text style={styles.statAbbr}>{abbr}</Text>
                    <Text style={styles.statScore}>{score ?? '—'}</Text>
                    <Text style={styles.statMod}>{getModifier(score)}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Pagination */}
        <View style={styles.pagination}>
          {campaignHeroes.map((_, i) => (
            <Pressable key={i} onPress={() => setActiveIndex(i)}>
              <View />
            </Pressable>
          ))}
          <PaginationDots total={campaignHeroes.length} activeIndex={activeIndex} />
        </View>
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        visible={editField !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setEditField(null)}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <Pressable style={styles.overlay} onPress={() => setEditField(null)}>
            <Pressable style={styles.dialog} onPress={(e) => e.stopPropagation()}>
              <Text style={styles.dialogTitle}>Edit {editLabel}</Text>
              <TextInput
                style={[styles.dialogInput, isMultiline && styles.dialogInputMultiline]}
                value={editValue}
                onChangeText={setEditValue}
                multiline={isMultiline}
                autoFocus
                placeholder={`Enter ${editLabel.toLowerCase()}`}
                placeholderTextColor={colors.muted}
              />
              <View style={styles.dialogActions}>
                <Pressable style={styles.dialogButton} onPress={() => setEditField(null)}>
                  <Text style={styles.dialogButtonTextCancel}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={[styles.dialogButton, styles.dialogButtonSave]}
                  onPress={saveEdit}
                >
                  <Text style={styles.dialogButtonTextSave}>Save</Text>
                </Pressable>
              </View>
            </Pressable>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

