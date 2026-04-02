import { useFonts, Magra_400Regular, Magra_700Bold } from '@expo-google-fonts/magra';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

import { useDatabase } from '@/hooks/useDatabase';
import { colors } from '@/theme/tokens';

// Keep splash screen visible while fonts load
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Magra-Regular': Magra_400Regular,
    'Magra-Bold': Magra_700Bold,
  });

  const dbReady = useDatabase();

  useEffect(() => {
    if (fontsLoaded && dbReady) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, dbReady]);

  if (!fontsLoaded || !dbReady) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary.default} />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    />
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});
