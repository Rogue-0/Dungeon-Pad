import { Image } from 'expo-image';
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, type ViewStyle } from 'react-native';

import { typography } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';

interface AvatarProps {
  imageUri?: string | null;
  name?: string;
  size?: number;
  style?: ViewStyle;
}

/** Circular avatar for heroes/NPCs in initiative tracker and session headers */
export default function Avatar({
  imageUri,
  name,
  size = 48,
  style,
}: AvatarProps) {
  const colors = useColors();
  const borderRadius = size / 2;

  const styles = useMemo(
    () =>
      StyleSheet.create({
        image: {
          borderWidth: 2,
          borderColor: colors.foreground,
        },
        fallback: {
          borderWidth: 2,
          borderColor: colors.foreground,
          backgroundColor: colors.surfaceSecondary,
          alignItems: 'center',
          justifyContent: 'center',
        },
        initial: {
          ...typography.subtitleMedium,
          color: colors.text.primary,
        },
      }),
    [colors],
  );

  if (imageUri) {
    return (
      <Image
        source={{ uri: imageUri }}
        style={[
          styles.image,
          { width: size, height: size, borderRadius },
          style,
        ]}
      />
    );
  }

  const initial = name ? name[0].toUpperCase() : '?';

  return (
    <View
      style={[
        styles.fallback,
        { width: size, height: size, borderRadius },
        style,
      ]}
    >
      <Text style={[styles.initial, { fontSize: size * 0.4 }]}>{initial}</Text>
    </View>
  );
}
