import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  StyleSheet,
  type ViewStyle,
} from 'react-native';

import { Card } from '@/components/ui';
import { typography, spacing, radii, componentSizes } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';

interface AddResourceMenuProps {
  resourceType: string;
  onAddFromCampaign: () => void;
  onAddFromCompendium: () => void;
  style?: ViewStyle;
}

/** "Add" card that shows a context menu with Campaign / Compendium options */
export default function AddResourceMenu({
  resourceType,
  onAddFromCampaign,
  onAddFromCompendium,
  style,
}: AddResourceMenuProps) {
  const colors = useColors();
  const [menuVisible, setMenuVisible] = useState(false);

  const handleOption = (callback: () => void) => {
    setMenuVisible(false);
    callback();
  };

  const styles = useMemo(
    () =>
      StyleSheet.create({
        addCard: {
          justifyContent: 'center',
          alignItems: 'center',
        },
        addIcon: {
          fontSize: 32,
          color: colors.muted,
          marginBottom: spacing.xs,
        },
        addText: {
          ...typography.bodySmall,
          color: colors.muted,
          textAlign: 'center',
        },
        overlay: {
          flex: 1,
          backgroundColor: colors.overlay,
          justifyContent: 'center',
          alignItems: 'center',
        },
        menu: {
          width: 340,
          backgroundColor: colors.surface,
          borderRadius: radii.card,
          borderWidth: componentSizes.strokeWidth,
          borderColor: colors.foreground,
          padding: spacing.lg,
        },
        menuTitle: {
          ...typography.subtitleMedium,
          color: colors.text.primary,
          marginBottom: spacing.md,
        },
        menuItem: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.md,
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.sm,
          borderRadius: radii.input,
        },
        menuItemIcon: {
          fontSize: 24,
          width: 32,
          textAlign: 'center',
          color: colors.text.primary,
        },
        menuItemText: {
          flex: 1,
        },
        menuItemLabel: {
          ...typography.subtitleSmall,
          color: colors.text.primary,
        },
        menuItemDesc: {
          ...typography.bodySmall,
          color: colors.muted,
          marginTop: 2,
        },
        menuDivider: {
          height: 1,
          backgroundColor: colors.border,
        },
      }),
    [colors],
  );

  return (
    <View style={style}>
      <Card
        width={160}
        height={180}
        onPress={() => setMenuVisible(true)}
        style={styles.addCard}
      >
        <Text style={styles.addIcon}>+</Text>
        <Text style={styles.addText}>Add {resourceType}</Text>
      </Card>

      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable
          style={styles.overlay}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menu}>
            <Text style={styles.menuTitle}>Add {resourceType}</Text>

            <Pressable
              style={styles.menuItem}
              onPress={() => handleOption(onAddFromCampaign)}
            >
              <Text style={styles.menuItemIcon}>{'\u2630'}</Text>
              <View style={styles.menuItemText}>
                <Text style={styles.menuItemLabel}>From Campaign</Text>
                <Text style={styles.menuItemDesc}>
                  Choose from this campaign's resources
                </Text>
              </View>
            </Pressable>

            <View style={styles.menuDivider} />

            <Pressable
              style={styles.menuItem}
              onPress={() => handleOption(onAddFromCompendium)}
            >
              <Text style={styles.menuItemIcon}>{'\u2605'}</Text>
              <View style={styles.menuItemText}>
                <Text style={styles.menuItemLabel}>From Compendium</Text>
                <Text style={styles.menuItemDesc}>
                  Search the full SRD compendium
                </Text>
              </View>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
