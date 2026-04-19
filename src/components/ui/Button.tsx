import React, { useMemo, useState } from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  type ViewStyle,
  type TextStyle,
} from 'react-native';

import { radii, componentSizes, typography, shadows } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'destructive';

interface ButtonProps {
  label: string;
  variant?: ButtonVariant;
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
}

export default function Button({
  label,
  variant = 'primary',
  onPress,
  disabled = false,
  style,
}: ButtonProps) {
  const colors = useColors();
  const [pressed, setPressed] = useState(false);
  const [hovered, setHovered] = useState(false);

  const fillColors: Record<ButtonVariant, { default: string; hover: string; pressed: string }> = {
    primary: colors.primary,
    secondary: colors.secondary,
    tertiary: { default: 'transparent', hover: 'transparent', pressed: 'transparent' },
    destructive: colors.destructive,
  };
  const textColors: Record<ButtonVariant, string> = {
    primary: colors.surface,
    secondary: colors.surface,
    tertiary: colors.foreground,
    destructive: colors.surface,
  };

  const fill = fillColors[variant];
  const backgroundColor = pressed ? fill.pressed : hovered ? fill.hover : fill.default;

  const shadowStyle = hovered && !pressed ? shadows.button : {};
  const innerShadowBorder =
    pressed && variant !== 'tertiary'
      ? { borderBottomWidth: 0, borderTopWidth: 4, borderTopColor: 'rgba(0,0,0,0.25)' }
      : {};

  const styles = useMemo(
    () =>
      StyleSheet.create({
        base: {
          height: componentSizes.button.height,
          borderRadius: radii.button,
          paddingVertical: componentSizes.button.paddingVertical,
          paddingHorizontal: componentSizes.button.paddingHorizontal,
          borderWidth: componentSizes.strokeWidth,
          borderColor: colors.foreground,
          alignItems: 'center',
          justifyContent: 'center',
        } as ViewStyle,
        label: {
          ...typography.subtitleSmall,
        } as TextStyle,
        disabled: {
          opacity: 0.5,
        } as ViewStyle,
      }),
    [colors],
  );

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      disabled={disabled}
      style={[
        styles.base,
        { backgroundColor },
        shadowStyle,
        innerShadowBorder,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text style={[styles.label, { color: textColors[variant] }]}>{label}</Text>
    </Pressable>
  );
}
