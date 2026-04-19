import React, { useMemo, useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  type ViewStyle,
} from 'react-native';

import { radii, componentSizes, shadows, spacing } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  onLongPress?: (e: any) => void;
  width?: number;
  height?: number;
  style?: ViewStyle;
}

const webTransition = Platform.select({
  web: {
    transitionProperty: 'box-shadow, border-color, transform',
    transitionDuration: '140ms',
    transitionTimingFunction: 'ease',
  } as any,
  default: {},
});

export default function Card({
  children,
  onPress,
  onLongPress,
  width = componentSizes.card.width,
  height = componentSizes.card.height,
  style,
}: CardProps) {
  const colors = useColors();
  const [pressed, setPressed] = useState(false);
  const [hovered, setHovered] = useState(false);

  const borderColor = hovered && !pressed ? colors.muted : colors.foreground;

  const shadowStyle = !pressed && !hovered ? shadows.card : {};

  const innerShadowBorder =
    pressed
      ? { borderBottomWidth: 0, borderTopWidth: 4, borderTopColor: 'rgba(0,0,0,0.5)' }
      : {};

  const styles = useMemo(
    () =>
      StyleSheet.create({
        base: {
          borderRadius: radii.card,
          borderWidth: componentSizes.strokeWidth,
          backgroundColor: colors.surface,
          padding: spacing.md,
          overflow: 'hidden',
        } as ViewStyle,
      }),
    [colors],
  );

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      style={[
        styles.base,
        webTransition,
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
