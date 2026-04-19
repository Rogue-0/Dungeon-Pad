import React, { useMemo, useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  View,
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

  const borderColor = pressed
    ? colors.primary.pressed
    : hovered
      ? colors.muted
      : colors.foreground;

  const shadowStyle = !pressed && !hovered ? shadows.card : {};

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
        pressShadow: {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          backgroundColor: 'rgba(0,0,0,0.5)',
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
        style,
      ]}
    >
      {pressed ? <View pointerEvents="none" style={styles.pressShadow} /> : null}
      {children}
    </Pressable>
  );
}
