import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';

import CampaignCard from '@/components/campaign/CampaignCard';
import NewCampaignCard from '@/components/campaign/NewCampaignCard';
import NewCampaignDialog from '@/components/campaign/NewCampaignDialog';
import { Button } from '@/components/ui';
import { getDatabase } from '@/db/database';
import { campaignsRepo } from '@/db/repos';
import { useCampaigns } from '@/hooks/data';
import { typography, spacing } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';

export default function CampaignsScreen() {
  const router = useRouter();
  const colors = useColors();
  const { data: campaigns, loading, refetch } = useCampaigns();
  const [newOpen, setNewOpen] = useState(false);

  const handleDelete = useCallback(
    async (id: string) => {
      const db = await getDatabase();
      await campaignsRepo.remove(db, id);
      await refetch();
    },
    [refetch],
  );

  const handleImageChange = useCallback(
    async (id: string, uri: string) => {
      const db = await getDatabase();
      await campaignsRepo.update(db, id, { imageUri: uri });
      await refetch();
    },
    [refetch],
  );

  const handleCreate = useCallback(
    async (name: string, description: string) => {
      const db = await getDatabase();
      const created = await campaignsRepo.create(db, {
        name,
        description: description || null,
      });
      setNewOpen(false);
      await refetch();
      router.push(`/(main)/campaigns/${created.id}`);
    },
    [refetch, router],
  );

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
        emptyMessage: {
          ...typography.bodyMedium,
          color: colors.text.tertiary,
          textAlign: 'center',
          marginBottom: spacing.lg,
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

        {!loading && campaigns && campaigns.length === 0 ? (
          <Text style={styles.emptyMessage}>
            No campaigns yet. Start your first one below.
          </Text>
        ) : null}

        {campaigns?.map((campaign) => (
          <CampaignCard
            key={campaign.id}
            campaign={campaign}
            onDelete={handleDelete}
            onImageChange={handleImageChange}
          />
        ))}

        <NewCampaignCard onPress={() => setNewOpen(true)} />
      </ScrollView>

      <NewCampaignDialog
        visible={newOpen}
        onClose={() => setNewOpen(false)}
        onSubmit={handleCreate}
      />
    </View>
  );
}
