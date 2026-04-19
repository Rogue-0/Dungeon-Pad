import { useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, type TextStyle } from 'react-native';

import BackButton from '@/components/navigation/BackButton';
import { InputField } from '@/components/ui';
import { typography, spacing } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';
import { MOCK_COMPENDIUM_ITEMS } from '@/utils/mock-data';

function highlightText(
  text: string,
  query: string,
  highlightStyle: TextStyle,
): React.ReactNode {
  if (!query.trim()) return text;

  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);

  if (parts.length === 1) return text;

  return parts.map((part, i) =>
    regex.test(part) ? (
      <Text key={i} style={highlightStyle}>{part}</Text>
    ) : (
      part
    ),
  );
}

export default function DocumentViewerScreen() {
  const { itemId } = useLocalSearchParams<{ itemId: string }>();
  const colors = useColors();
  const [search, setSearch] = useState('');

  const item = MOCK_COMPENDIUM_ITEMS.find((i) => i.id === itemId);

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
        searchRow: {
          marginBottom: spacing.xl,
        },
        searchField: {
          maxWidth: 400,
        },
        documentBody: {
          gap: spacing.md,
        },
        heading1: {
          ...typography.subtitleLarge,
          color: colors.text.primary,
          marginTop: spacing.md,
        },
        heading2: {
          ...typography.subtitleMedium,
          color: colors.text.primary,
          marginTop: spacing.md,
        },
        heading3: {
          ...typography.subtitleSmall,
          color: colors.text.primary,
          marginTop: spacing.sm,
        },
        bodyText: {
          ...typography.bodyMedium,
          color: colors.text.secondary,
          lineHeight: 24,
        },
        highlight: {
          backgroundColor: '#FFEB3B',
          color: '#1A1A1A',
        },
      }),
    [colors],
  );

  const renderedBody = useMemo(() => {
    if (!item?.body) return null;
    const lines = item.body.split('\n');
    const elements: React.ReactElement[] = [];
    let paragraph = '';
    let key = 0;

    const flushParagraph = () => {
      if (paragraph.trim()) {
        elements.push(
          <Text key={key++} style={styles.bodyText}>
            {highlightText(paragraph.trim(), search, styles.highlight)}
          </Text>,
        );
      }
      paragraph = '';
    };

    for (const line of lines) {
      if (line.startsWith('### ')) {
        flushParagraph();
        elements.push(
          <Text key={key++} style={styles.heading3}>
            {highlightText(line.slice(4), search, styles.highlight)}
          </Text>,
        );
      } else if (line.startsWith('## ')) {
        flushParagraph();
        elements.push(
          <Text key={key++} style={styles.heading2}>
            {highlightText(line.slice(3), search, styles.highlight)}
          </Text>,
        );
      } else if (line.startsWith('# ')) {
        flushParagraph();
        elements.push(
          <Text key={key++} style={styles.heading1}>
            {highlightText(line.slice(2), search, styles.highlight)}
          </Text>,
        );
      } else if (line.trim() === '') {
        flushParagraph();
      } else {
        paragraph += (paragraph ? ' ' : '') + line;
      }
    }
    flushParagraph();

    return elements;
  }, [item?.body, search, styles]);

  if (!item) {
    return (
      <View style={styles.container}>
        <BackButton label="Compendium" />
        <Text style={styles.heading1}>Item not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <BackButton label="Compendium" />

      <Text style={styles.pageTitle}>Compendium</Text>
      <Text style={styles.viewingLabel}>Viewing: {item.title}</Text>

      <View style={styles.searchRow}>
        <InputField
          label="Search Document"
          placeholder="Search..."
          value={search}
          onChangeText={setSearch}
          containerStyle={styles.searchField}
        />
      </View>

      <View style={styles.documentBody}>
        {renderedBody}
      </View>
    </ScrollView>
  );
}
