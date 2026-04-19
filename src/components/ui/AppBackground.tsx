import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { usePathname } from 'expo-router';

import { useBackgroundStore } from '@/theme/background-store';
import { useColors, useThemeMode } from '@/theme/use-theme';

const DAY_SCENE = require('../../../assets/images/campaigns-day.webp');
const NIGHT_SCENE = require('../../../assets/images/campaigns-night.webp');

function extractCampaignId(pathname: string): string | null {
  const match = pathname.match(/\/campaigns\/([^/]+)/);
  if (!match) return null;
  const id = match[1];
  if (id === 'index' || id.startsWith('[')) return null;
  return id;
}

export default function AppBackground() {
  const mode = useThemeMode();
  const colors = useColors();
  const pathname = usePathname();
  const customUri = useBackgroundStore((s) => s.customUri);
  const customByCampaignId = useBackgroundStore((s) => s.customByCampaignId);

  const campaignId = extractCampaignId(pathname);
  const campaignUri = campaignId ? customByCampaignId[campaignId] ?? null : null;
  const activeUri = campaignUri ?? customUri;

  const defaultSource = mode === 'dark' ? NIGHT_SCENE : DAY_SCENE;

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
      }),
    [colors],
  );

  return (
    <View style={styles.container} pointerEvents="none">
      <Image
        key={activeUri ?? `default-${mode}`}
        source={activeUri ? { uri: activeUri } : defaultSource}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        transition={220}
      />
      <View style={styles.tint} />
    </View>
  );
}
