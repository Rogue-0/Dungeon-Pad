import { Stack } from 'expo-router';
import React from 'react';

export default function CampaignLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: 'transparent' },
      }}
    />
  );
}
