import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';

import CompendiumTable from '@/components/compendium/CompendiumTable';
import Pagination from '@/components/compendium/Pagination';
import BackButton from '@/components/navigation/BackButton';
import { InputField } from '@/components/ui';
import { typography, spacing, radii, componentSizes } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';
import type { CompendiumItem } from '@/types';
import { MOCK_COMPENDIUM_ITEMS, MOCK_CAMPAIGNS } from '@/utils/mock-data';

const ITEMS_PER_PAGE = 4;
const SORT_OPTIONS = ['Alphabetical', 'Newest', 'Type'] as const;

export default function FullCompendiumScreen() {
  const router = useRouter();
  const colors = useColors();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<(typeof SORT_OPTIONS)[number]>('Alphabetical');
  const [filterCampaignId, setFilterCampaignId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredItems = useMemo(() => {
    let items = [...MOCK_COMPENDIUM_ITEMS];

    if (filterCampaignId) {
      items = items.filter((item) => item.campaignId === filterCampaignId);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.summary.toLowerCase().includes(q) ||
          item.type.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'Alphabetical') {
      items.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'Newest') {
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'Type') {
      items.sort((a, b) => a.type.localeCompare(b.type));
    }

    return items;
  }, [search, sortBy, filterCampaignId]);

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const pagedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const filterCampaign = filterCampaignId
    ? MOCK_CAMPAIGNS.find((c) => c.id === filterCampaignId)
    : null;

  const handleItemPress = (item: CompendiumItem) => {
    if (item.body) {
      router.push(`/(main)/compendium/${item.id}`);
    }
  };

  const cycleCampaignFilter = () => {
    const campaignIds = [null, ...MOCK_CAMPAIGNS.map((c) => c.id)];
    const currentIndex = campaignIds.indexOf(filterCampaignId);
    const nextIndex = (currentIndex + 1) % campaignIds.length;
    setFilterCampaignId(campaignIds[nextIndex]);
    setCurrentPage(1);
  };

  const cycleSortBy = () => {
    const currentIndex = SORT_OPTIONS.indexOf(sortBy);
    const nextIndex = (currentIndex + 1) % SORT_OPTIONS.length;
    setSortBy(SORT_OPTIONS[nextIndex]);
  };

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: 'transparent',
        },
        content: {
          padding: spacing['3xl'],
        },
        pageTitle: {
          ...typography.titleSmall,
          color: colors.text.primary,
          marginBottom: spacing.sm,
        },
        viewingLabel: {
          ...typography.subtitleLarge,
          color: colors.text.primary,
          marginBottom: spacing.xl,
        },
        controlsRow: {
          flexDirection: 'row',
          gap: spacing.lg,
          marginBottom: spacing.xl,
          alignItems: 'flex-end',
        },
        searchField: {
          flex: 1,
        },
        controlField: {
          gap: spacing.sm,
        },
        controlLabel: {
          ...typography.subtitleSmall,
          color: colors.text.primary,
        },
        controlBox: {
          flexDirection: 'row',
          alignItems: 'center',
          height: componentSizes.input.height,
          borderRadius: radii.input,
          borderWidth: componentSizes.strokeWidth,
          borderColor: colors.foreground,
          backgroundColor: colors.surface,
          paddingHorizontal: spacing.md,
          minWidth: 180,
        },
        controlValue: {
          ...typography.bodyLarge,
          color: colors.text.secondary,
          flex: 1,
        },
        chevron: {
          ...typography.subtitleLarge,
          color: colors.foreground,
          marginLeft: spacing.sm,
        },
      }),
    [colors],
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <BackButton label="Campaigns" />

      <Text style={styles.pageTitle}>Compendium</Text>
      <Text style={styles.viewingLabel}>
        Viewing: {filterCampaign ? filterCampaign.name : 'All Campaigns'}
      </Text>

      <View style={styles.controlsRow}>
        <View style={styles.searchField}>
          <InputField
            label="Search Compendium"
            placeholder="Search..."
            value={search}
            onChangeText={(text) => {
              setSearch(text);
              setCurrentPage(1);
            }}
          />
        </View>

        <View style={styles.controlField}>
          <Text style={styles.controlLabel}>Sort by:</Text>
          <View style={styles.controlBox}>
            <Text style={styles.controlValue} onPress={cycleSortBy}>{sortBy}</Text>
          </View>
        </View>

        <View style={styles.controlField}>
          <Text style={styles.controlLabel}>Filter by:</Text>
          <View style={styles.controlBox}>
            <Text style={styles.controlValue} onPress={cycleCampaignFilter}>
              {filterCampaign ? filterCampaign.name : 'All Campaigns'}
            </Text>
            <Text style={styles.chevron}>{'\u2304'}</Text>
          </View>
        </View>
      </View>

      <CompendiumTable items={pagedItems} onItemPress={handleItemPress} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </ScrollView>
  );
}
