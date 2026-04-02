import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { View, StyleSheet, LayoutAnimation, Platform, UIManager } from 'react-native';

import Sidebar from '@/components/navigation/Sidebar';
import { colors } from '@/theme/tokens';
import { MOCK_CAMPAIGNS } from '@/utils/mock-data';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function CampaignLayout() {
  const { campaignId } = useLocalSearchParams<{ campaignId: string }>();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const campaign = MOCK_CAMPAIGNS.find((c) => c.id === campaignId);

  const toggleSidebar = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSidebarCollapsed((prev) => !prev);
  };

  return (
    <View style={styles.container}>
      <Sidebar
        campaignId={campaignId ?? ''}
        campaignName={campaign?.name ?? 'Campaign'}
        collapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
      />
      <View style={styles.content}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
});
