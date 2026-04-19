import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';

import CampaignCard from '@/components/campaign/CampaignCard';
import NewCampaignCard from '@/components/campaign/NewCampaignCard';
import { Button } from '@/components/ui';
import { typography, spacing } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';
import { MOCK_CAMPAIGNS } from '@/utils/mock-data';

/** Home screen — list of campaigns */
export default function CampaignsScreen() {
  const router = useRouter();
  const colors = useColors();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: 'transparent',
        },
        content: {
          padding: spacing['3xl'],
          maxWidth: 900,
          alignSelf: 'center',
          width: '100%',
        },
        header: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: spacing.xl,
        },
        headerActions: {
          flexDirection: 'row',
          gap: spacing.sm,
          alignItems: 'center',
        },
        title: {
          ...typography.titleMedium,
          color: colors.text.primary,
        },
      }),
    [colors],
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Campaigns</Text>
          <View style={styles.headerActions}>
            <Button
              label="Settings"
              variant="tertiary"
              onPress={() => router.push('/(main)/settings')}
            />
            <Button
              label="Full Compendium"
              variant="secondary"
              onPress={() => router.push('/(main)/compendium')}
            />
          </View>
        </View>

        {MOCK_CAMPAIGNS.map((campaign) => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))}

        <NewCampaignCard onPress={() => {}} />
      </ScrollView>
    </View>
  );
}
