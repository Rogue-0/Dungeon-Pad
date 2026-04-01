import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  type ViewStyle,
  type TextInputProps,
} from 'react-native';

import { colors, radii, componentSizes, typography, spacing, shadows } from '@/theme/tokens';

interface InputFieldProps extends Omit<TextInputProps, 'style'> {
  label: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export default function InputField({
  label,
  error,
  containerStyle,
  ...textInputProps
}: InputFieldProps) {
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);

  const hasError = !!error;

  // Border color logic
  const borderColor = hasError
    ? colors.error.stroke
    : focused || hovered
      ? colors.foreground
      : colors.muted;

  // Background color for error state
  const backgroundColor = hasError ? colors.error.background : colors.surface;

  // Shadow / inner shadow based on state
  const shadowStyle = hovered && !focused ? shadows.button : {};
  const innerShadowBorder =
    focused
      ? { borderBottomWidth: 0, borderTopWidth: 4, borderTopColor: 'rgba(0,0,0,0.25)' }
      : {};

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.inputWrapper,
          { borderColor, backgroundColor },
          shadowStyle,
          innerShadowBorder,
        ]}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <TextInput
          style={styles.input}
          placeholderTextColor={colors.muted}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...textInputProps}
        />
      </View>
      {hasError && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  label: {
    ...typography.subtitleSmall,
    color: colors.foreground,
  },
  inputWrapper: {
    height: componentSizes.input.height,
    borderRadius: radii.input,
    borderWidth: componentSizes.strokeWidth,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  } as ViewStyle,
  input: {
    ...typography.bodyLarge,
    color: colors.foreground,
    flex: 1,
  },
  errorText: {
    ...typography.bodySmall,
    color: colors.error.stroke,
  },
});
