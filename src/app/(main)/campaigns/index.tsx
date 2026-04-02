import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { colors, typography, spacing } from '@/theme/tokens';

/** Home screen — list of campaigns */
export default function CampaignsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Campaigns</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing['3xl'],
  },
  title: {
    ...typography.titleMedium,
    color: colors.foreground,
  },
});
