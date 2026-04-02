import { Stack } from 'expo-router';

import { colors } from '@/theme/tokens';

/** Main app stack — all authenticated screens live here */
export default function MainLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    />
  );
}
