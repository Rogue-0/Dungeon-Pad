import React, { useMemo, useState } from 'react';
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

interface NewCampaignDialogProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (name: string, description: string) => Promise<void> | void;
}

export default function NewCampaignDialog({
  visible,
  onClose,
  onSubmit,
}: NewCampaignDialogProps) {
  const colors = useColors();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setName('');
    setDescription('');
    setSubmitting(false);
  };

  const handleClose = () => {
    if (submitting) return;
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    const trimmedName = name.trim();
    const trimmedDescription = description.trim();
    if (!trimmedName || submitting) return;
    setSubmitting(true);
    try {
      await onSubmit(trimmedName, trimmedDescription);
      reset();
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
        body: {
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
            <Text style={styles.title}>New campaign</Text>
            <Text style={styles.body}>
              Give it a name and a short description. You can add an image, heroes, and sessions after.
            </Text>
            <InputField
              label="Name"
              value={name}
              onChangeText={setName}
              placeholder="e.g. Curse of Strahd"
              autoFocus
              returnKeyType="next"
            />
            <InputField
              label="Description"
              value={description}
              onChangeText={setDescription}
              placeholder="e.g. A gothic horror campaign in Barovia"
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
                label={submitting ? 'Creating…' : 'Create'}
                variant="primary"
                onPress={handleSubmit}
                disabled={submitting || name.trim().length === 0}
              />
            </View>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}
