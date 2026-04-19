import React, { useMemo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { usePathname } from 'expo-router';

import { useBackgroundStore } from '@/theme/background-store';
import { typography, spacing, radii } from '@/theme/tokens';
import { useColors, useThemeMode } from '@/theme/use-theme';

const DAY_SCENE = require('../../../assets/images/campaigns-day.webp');
const NIGHT_SCENE = require('../../../assets/images/campaigns-night.webp');

/**
 * App-wide background layer. Shows the day/night fantasy scene by default,
 * or a per-page custom image the user has uploaded. Keyed by pathname so
 * each route can have its own override.
 */
export default function AppBackground() {
  const mode = useThemeMode();
  const colors = useColors();
  const pathname = usePathname();
  const customByPath = useBackgroundStore((s) => s.customByPath);
  const setCustom = useBackgroundStore((s) => s.setCustom);

  const customUri = customByPath[pathname] ?? null;
  const defaultSource = mode === 'dark' ? NIGHT_SCENE : DAY_SCENE;

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 0.85,
    });
    if (!result.canceled && result.assets[0]) {
      setCustom(pathname, result.assets[0].uri);
    }
  };

  const resetBackground = () => setCustom(pathname, null);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          ...StyleSheet.absoluteFillObject,
          overflow: 'hidden',
        },
        tint: {
          ...StyleSheet.absoluteFillObject,
          backgroundColor: colors.sceneTint,
        },
        controls: {
          position: 'absolute',
          bottom: spacing.lg,
          right: spacing.lg,
          flexDirection: 'row',
          gap: spacing.sm,
        },
        button: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.xs,
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.md,
          borderRadius: radii.button,
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 6,
          elevation: 3,
          opacity: 0.92,
        },
        buttonIcon: {
          ...typography.bodyMedium,
          color: colors.text.secondary,
        },
        buttonLabel: {
          ...typography.bodySmall,
          color: colors.text.secondary,
        },
      }),
    [colors],
  );

  return (
    <>
      <View style={styles.container} pointerEvents="none">
        <Image
          key={customUri ?? `default-${mode}`}
          source={customUri ? { uri: customUri } : defaultSource}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={220}
        />
        <View style={styles.tint} />
      </View>

      <View style={styles.controls}>
        {customUri ? (
          <Pressable style={styles.button} onPress={resetBackground}>
            <Text style={styles.buttonIcon}>{'\u21BA'}</Text>
            <Text style={styles.buttonLabel}>Reset</Text>
          </Pressable>
        ) : null}
        <Pressable style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonIcon}>{'\u{1F5BC}'}</Text>
          <Text style={styles.buttonLabel}>
            {customUri ? 'Change Background' : 'Edit Background'}
          </Text>
        </Pressable>
      </View>
    </>
  );
}
