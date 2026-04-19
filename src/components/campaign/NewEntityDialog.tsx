import React, { useEffect, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Button, InputField } from '@/components/ui';
import { componentSizes, radii, spacing, typography } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';

interface NewEntityDialogProps {
  visible: boolean;
  title: string;
  description?: string;
  primaryLabel: string;
  primaryPlaceholder?: string;
  secondaryLabel: string;
  secondaryPlaceholder?: string;
  submitLabel?: string;
  onClose: () => void;
  onSubmit: (primary: string, secondary: string) => Promise<void> | void;
}

/**
 * Generic two-field create dialog used by the campaign dashboard. Captures a
 * primary (name/title) and a secondary data point (class, description, etc.);
 * everything else is edited on the detail screen.
 */
export default function NewEntityDialog({
  visible,
  title,
  description,
  primaryLabel,
  primaryPlaceholder,
  secondaryLabel,
  secondaryPlaceholder,
  submitLabel = 'Create',
  onClose,
  onSubmit,
}: NewEntityDialogProps) {
  const colors = useColors();
  const [primary, setPrimary] = useState('');
  const [secondary, setSecondary] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!visible) {
      setPrimary('');
      setSecondary('');
      setSubmitting(false);
    }
  }, [visible]);

  const handleClose = () => {
    if (submitting) return;
    onClose();
  };

  const handleSubmit = async () => {
    const trimmedPrimary = primary.trim();
    const trimmedSecondary = secondary.trim();
    if (!trimmedPrimary || submitting) return;
    setSubmitting(true);
    try {
      await onSubmit(trimmedPrimary, trimmedSecondary);
    } finally {
      setSubmitting(false);
    }
  };

  const styles = useMemo(
    () =>
      StyleSheet.create({
        overlay: {
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          alignItems: 'center',
          justifyContent: 'center',
          padding: spacing.lg,
        },
        dialog: {
          width: '100%',
          maxWidth: 480,
          borderRadius: radii.card,
          borderWidth: componentSizes.strokeWidth,
          borderColor: colors.border,
          backgroundColor: colors.surface,
          padding: spacing.lg,
          gap: spacing.md,
        },
        title: {
          ...typography.subtitleLarge,
          color: colors.text.primary,
        },
        description: {
          ...typography.bodyMedium,
          color: colors.text.tertiary,
        },
        actions: {
          flexDirection: 'row',
          gap: spacing.sm,
          justifyContent: 'flex-end',
          marginTop: spacing.sm,
        },
      }),
    [colors],
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable style={styles.overlay} onPress={handleClose}>
          <Pressable style={styles.dialog} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.title}>{title}</Text>
            {description ? <Text style={styles.description}>{description}</Text> : null}
            <InputField
              label={primaryLabel}
              value={primary}
              onChangeText={setPrimary}
              placeholder={primaryPlaceholder}
              autoFocus
              returnKeyType="next"
            />
            <InputField
              label={secondaryLabel}
              value={secondary}
              onChangeText={setSecondary}
              placeholder={secondaryPlaceholder}
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
            />
            <View style={styles.actions}>
              <Button
                label="Cancel"
                variant="tertiary"
                onPress={handleClose}
                disabled={submitting}
              />
              <Button
                label={submitting ? 'Creating…' : submitLabel}
                variant="primary"
                onPress={handleSubmit}
                disabled={submitting || primary.trim().length === 0}
              />
            </View>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}
