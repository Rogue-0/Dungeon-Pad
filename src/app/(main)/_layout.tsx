import { Stack } from 'expo-router';
import React from 'react';
import { View, StyleSheet } from 'react-native';

import AppBackground from '@/components/ui/AppBackground';

/** Main app stack — all authenticated screens live here */
export default function MainLayout() {
  return (
    <View style={styles.root}>
      <AppBackground />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
