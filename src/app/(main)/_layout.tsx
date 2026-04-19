import React from 'react';
import { View, StyleSheet } from 'react-native';

import AppBackground from '@/components/ui/AppBackground';
import { JsStack, PAIRED_SLIDE_PRESET } from '@/components/navigation/JsStack';

export default function MainLayout() {
  return (
    <View style={styles.root}>
      <AppBackground />
      <JsStack
        screenOptions={{
          headerShown: false,
          ...PAIRED_SLIDE_PRESET,
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
