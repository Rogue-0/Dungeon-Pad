import React, { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Button } from '@/components/ui';
import { componentSizes, radii, spacing, typography } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';

interface SessionsPlayedCounterProps {
  count: number;
  lastPlayedLabel?: string;
  onCountChange?: (count: number) => void;
}

export default function SessionsPlayedCounter({
  count,
  lastPlayedLabel,
  onCountChange,
}: SessionsPlayedCounterProps) {
  const colors = useColors();
  const [value, setValue] = useState(count);
  const [editOpen, setEditOpen] = useState(false);
  const [draft, setDraft] = useState(String(count));

  useEffect(() => {
    setValue(count);
  }, [count]);

  const openEdit = () => {
    setDraft(String(value));
    setEditOpen(true);
  };

  const save = () => {
    const next = Math.max(0, parseInt(draft, 10) || 0);
    setValue(next);
    onCountChange?.(next);
    setEditOpen(false);
  };

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          borderRadius: radii.card,
          borderWidth: componentSizes.strokeWidth,
          borderColor: colors.foreground,
          backgroundColor: colors.surface,
          padding: spacing.xl,
          alignItems: 'center',
          justifyContent: 'space-between',
          minWidth: 200,
        },
        containerHovered: {
          borderColor: colors.muted,
        },
        label: {
          ...typography.bodyMedium,
          color: colors.text.secondary,
        },
        count: {
          ...typography.titleLarge,
          color: colors.text.primary,
          marginVertical: spacing.sm,
        },
        subLabel: {
          ...typography.bodySmall,
          color: colors.text.tertiary,
          textAlign: 'center',
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
          maxWidth: 420,
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
        dialogBody: {
          ...typography.bodyMedium,
          color: colors.text.secondary,
          lineHeight: 22,
          marginBottom: spacing.lg,
        },
        input: {
          ...typography.subtitleLarge,
          color: colors.text.primary,
          borderWidth: componentSizes.strokeWidth,
          borderColor: colors.foreground,
          borderRadius: radii.input,
          backgroundColor: colors.surface,
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.md,
          textAlign: 'center',
          marginBottom: spacing.xl,
        },
        dialogActions: {
          flexDirection: 'row',
          justifyContent: 'flex-end',
          gap: spacing.md,
        },
      }),
    [colors],
  );

  return (
    <>
      <Pressable
        onPress={openEdit}
        style={({ hovered }) => [styles.container, hovered && styles.containerHovered]}
      >
        <Text style={styles.label}>Sessions Played</Text>
        <Text style={styles.count}>{value}</Text>
        <Text style={styles.subLabel}>
          {lastPlayedLabel ? `Last played · ${lastPlayedLabel}` : 'Tap to edit'}
        </Text>
      </Pressable>

      <Modal
        visible={editOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setEditOpen(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.dialog}>
            <Text style={styles.dialogTitle}>Edit Sessions Played</Text>
            <Text style={styles.dialogBody}>
              Set the total number of sessions played, including any not recorded in the app.
            </Text>
            <TextInput
              value={draft}
              onChangeText={(t) => setDraft(t.replace(/[^0-9]/g, ''))}
              keyboardType="number-pad"
              inputMode="numeric"
              style={styles.input}
              autoFocus
              selectTextOnFocus
              onSubmitEditing={save}
            />
            <View style={styles.dialogActions}>
              <Button label="Cancel" variant="secondary" onPress={() => setEditOpen(false)} />
              <Button label="Save" variant="primary" onPress={save} />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
