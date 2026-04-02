import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';

import CampaignCard from '@/components/campaign/CampaignCard';
import NewCampaignCard from '@/components/campaign/NewCampaignCard';
import { colors, typography, spacing } from '@/theme/tokens';
import { MOCK_CAMPAIGNS } from '@/utils/mock-data';

/** Home screen — list of campaigns */
export default function CampaignsScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.title}>Campaigns</Text>

      {MOCK_CAMPAIGNS.map((campaign) => (
        <CampaignCard key={campaign.id} campaign={campaign} />
      ))}

      <NewCampaignCard onPress={() => {}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing['3xl'],
    maxWidth: 800,
  },
  title: {
    ...typography.titleMedium,
    color: colors.foreground,
    marginBottom: spacing.xl,
  },
});
