import { useFonts, Magra_400Regular, Magra_700Bold } from '@expo-google-fonts/magra';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useMemo } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

import { useDatabase } from '@/hooks/useDatabase';
import { useColors } from '@/theme/use-theme';
import { useThemeStore } from '@/theme/theme-store';
import { useBackgroundStore } from '@/theme/background-store';

// Keep splash screen visible while fonts load
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Magra-Regular': Magra_400Regular,
    'Magra-Bold': Magra_700Bold,
  });

  const dbReady = useDatabase();
  const hydrateTheme = useThemeStore((s) => s.hydrate);
  const hydrateBackgrounds = useBackgroundStore((s) => s.hydrate);
  const colors = useColors();

  const navTheme = useMemo(
    () => ({
      ...DefaultTheme,
      colors: { ...DefaultTheme.colors, background: 'transparent', card: 'transparent' },
    }),
    [],
  );

  useEffect(() => {
    hydrateTheme();
    hydrateBackgrounds();
  }, [hydrateTheme, hydrateBackgrounds]);

  useEffect(() => {
    if (fontsLoaded && dbReady) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, dbReady]);

  if (!fontsLoaded || !dbReady) {
    return (
      <View style={[styles.loading, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary.default} />
      </View>
    );
  }

  return (
    <ThemeProvider value={navTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
        }}
      />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
