import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  type ViewStyle,
} from 'react-native';

import { colors, radii, componentSizes, shadows, spacing } from '@/theme/tokens';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  width?: number;
  height?: number;
  style?: ViewStyle;
}

export default function Card({
  children,
  onPress,
  width = componentSizes.card.width,
  height = componentSizes.card.height,
  style,
}: CardProps) {
  const [pressed, setPressed] = useState(false);
  const [hovered, setHovered] = useState(false);

  const borderColor = hovered && !pressed ? colors.muted : colors.foreground;

  const shadowStyle = !pressed && !hovered ? shadows.card : {};

  const innerShadowBorder =
    pressed
      ? { borderBottomWidth: 0, borderTopWidth: 4, borderTopColor: 'rgba(0,0,0,0.5)' }
      : {};

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      style={[
        styles.base,
        { width, height, borderColor },
        shadowStyle,
        innerShadowBorder,
        style,
      ]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.card,
    borderWidth: componentSizes.strokeWidth,
    backgroundColor: colors.surface,
    padding: spacing.md,
    overflow: 'hidden',
  } as ViewStyle,
});
