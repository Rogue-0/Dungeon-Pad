import React, { useState } from 'react';
import {
  Pressable,
  View,
  Text,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
  type ViewStyle,
} from 'react-native';

import { colors, radii, componentSizes, typography, spacing, shadows } from '@/theme/tokens';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  style?: ViewStyle;
}

export default function Accordion({
  title,
  children,
  defaultExpanded = false,
  style,
}: AccordionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [pressed, setPressed] = useState(false);
  const [hovered, setHovered] = useState(false);

  const borderColor = hovered || pressed ? colors.foreground : colors.muted;
  const shadowStyle = hovered && !pressed ? shadows.accordion : {};
  const innerShadowBorder =
    pressed
      ? { borderBottomWidth: 0, borderTopWidth: 4, borderTopColor: 'rgba(0,0,0,0.25)' }
      : {};

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => !prev);
  };

  return (
    <View style={[styles.container, { borderColor }, shadowStyle, innerShadowBorder, style]}>
      <Pressable
        onPress={toggle}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        onHoverIn={() => setHovered(true)}
        onHoverOut={() => setHovered(false)}
        style={styles.header}
      >
        <Text style={styles.headerText}>{title}</Text>
        <Text style={styles.chevron}>{expanded ? '\u25B2' : '\u25BC'}</Text>
      </Pressable>

      {expanded && <View style={styles.body}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radii.accordion,
    borderWidth: componentSizes.strokeWidth,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  } as ViewStyle,
  header: {
    height: componentSizes.accordion.collapsedHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
  },
  headerText: {
    ...typography.subtitleMedium,
    color: colors.foreground,
  },
  chevron: {
    ...typography.bodyMedium,
    color: colors.foreground,
  },
  body: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
});
