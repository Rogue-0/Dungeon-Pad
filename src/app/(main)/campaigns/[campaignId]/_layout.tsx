import { Stack } from 'expo-router';

import { colors } from '@/theme/tokens';

/** Campaign-level stack — dashboard, sessions, NPCs, combat, heroes, maps */
export default function CampaignLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    />
  );
}
