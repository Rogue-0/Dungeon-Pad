import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Platform, Dimensions, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';

import Badge from '@/components/ui/Badge';
import { Card, Button } from '@/components/ui';
import { typography, spacing, radii, componentSizes } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';
import { paletteForId } from '@/theme/gradients';
import type { CampaignWithStats } from '@/types';

interface CampaignCardProps {
  campaign: CampaignWithStats;
  onDelete?: (campaignId: string) => void;
}

export default function CampaignCard({ campaign, onDelete }: CampaignCardProps) {
  const router = useRouter();
  const colors = useColors();
  const [imageUri, setImageUri] = useState<string | null>(campaign.imageUri);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const pickImage = async () => {
    setShowContextMenu(false);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const openContextMenu = (pageX: number, pageY: number) => {
    const hasCoords = pageX > 0 && pageY > 0;
    if (hasCoords) {
      setMenuPosition({ x: pageX, y: pageY });
    } else {
      const { width: w, height: h } = Dimensions.get('window');
      setMenuPosition({ x: w / 2 - 100, y: h / 2 - 60 });
    }
    setShowContextMenu(true);
  };

  const handleDeletePress = () => {
    setShowContextMenu(false);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    setShowDeleteConfirm(false);
    onDelete?.(campaign.id);
  };

  const stats = [
    { label: 'Sessions', value: campaign.sessionCount },
    { label: 'Combat', value: campaign.combatModuleCount },
    { label: 'NPCs', value: campaign.npcCount },
    { label: 'Heroes', value: campaign.heroCount },
    { label: 'Maps', value: campaign.mapCount },
  ];

  const fallbackPalette = paletteForId(campaign.id);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        card: {
          width: '100%',
          height: 'auto',
          padding: 0,
          marginBottom: spacing.lg,
        },
        row: {
          flexDirection: 'row',
          alignItems: 'stretch',
        },
        left: {
          flex: 1,
          paddingTop: spacing.xl,
          paddingBottom: spacing['2xl'],
          paddingLeft: spacing.xl,
          paddingRight: spacing.xl,
        },
        imageArea: {
          width: '70%',
          marginLeft: -spacing.xl,
          marginRight: -spacing.xl,
          transform: [{ skewX: '-6deg' }],
          overflow: 'hidden',
          borderLeftWidth: 2,
          borderLeftColor: colors.border,
        },
        gradient: {
          flex: 1,
          transform: [{ skewX: '6deg' }],
          marginLeft: -spacing['3xl'],
          marginRight: -spacing['3xl'],
        },
        image: {
          flex: 1,
          transform: [{ skewX: '6deg' }],
          marginLeft: -spacing['3xl'],
          marginRight: -spacing['3xl'],
        },
        name: {
          ...typography.subtitleLarge,
          color: colors.textVariant.default,
          marginBottom: spacing.md,
        },
        statsList: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: spacing.sm,
        },
        overlay: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        },
        contextMenu: {
          position: 'absolute',
          backgroundColor: colors.surface,
          borderRadius: radii.card,
          borderWidth: componentSizes.strokeWidth,
          borderColor: colors.border,
          paddingVertical: spacing.sm,
          minWidth: 200,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 8,
        },
        menuItem: {
          paddingVertical: spacing.sm + 4,
          paddingHorizontal: spacing.lg,
        },
        menuItemHovered: {
          backgroundColor: colors.surfaceHover,
        },
        menuItemText: {
          ...typography.bodyMedium,
          color: colors.text.secondary,
        },
        menuItemTextDestructive: {
          ...typography.bodyMedium,
          color: colors.destructive.default,
        },
        menuDivider: {
          height: 1,
          backgroundColor: colors.border,
          marginVertical: spacing.xs,
        },
        dialog: {
          backgroundColor: colors.surface,
          borderRadius: radii.card,
          borderWidth: componentSizes.strokeWidth,
          borderColor: colors.foreground,
          padding: spacing.xl,
          maxWidth: 420,
          width: '90%',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.2,
          shadowRadius: 24,
          elevation: 10,
        },
        dialogTitle: {
          ...typography.subtitleLarge,
          color: colors.text.primary,
          marginBottom: spacing.md,
        },
        dialogBody: {
          ...typography.bodyMedium,
          color: colors.muted,
          lineHeight: 24,
          marginBottom: spacing.xl,
        },
        dialogActions: {
          flexDirection: 'row',
          justifyContent: 'flex-end',
          gap: spacing.md,
        },
      }),
    [colors],
  );

  return (
    <>
      <Card
        width={undefined}
        height={undefined}
        style={styles.card}
        onPress={() => router.push(`/(main)/campaigns/${campaign.id}`)}
        onLongPress={(e) =>
          openContextMenu(e?.nativeEvent?.pageX ?? 0, e?.nativeEvent?.pageY ?? 0)
        }
      >
        <View style={styles.row}>
          <View style={styles.left}>
            <Text style={styles.name}>{campaign.name}</Text>
            <View style={styles.statsList}>
              {stats.map((stat) => (
                <Badge key={stat.label} label={stat.label} value={stat.value} />
              ))}
            </View>
          </View>
          <View
            style={styles.imageArea}
            {...(Platform.OS === 'web' ? {
              onContextMenu: (e: any) => {
                e.preventDefault();
                openContextMenu(e.nativeEvent.pageX, e.nativeEvent.pageY);
              },
            } : {})}
          >
            {imageUri ? (
              <Image
                source={{ uri: imageUri }}
                style={styles.image}
                contentFit="cover"
              />
            ) : (
              <LinearGradient
                colors={[...fallbackPalette]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
              />
            )}
          </View>
        </View>
      </Card>

      <Modal
        visible={showContextMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowContextMenu(false)}
      >
        <Pressable
          style={styles.overlay}
          onPress={() => setShowContextMenu(false)}
        >
          <View style={[styles.contextMenu, { top: menuPosition.y, left: menuPosition.x }]}>
            <Pressable
              style={({ hovered }) => [styles.menuItem, hovered && styles.menuItemHovered]}
              onPress={pickImage}
            >
              <Text style={styles.menuItemText}>Choose Image</Text>
            </Pressable>
            <View style={styles.menuDivider} />
            <Pressable
              style={({ hovered }) => [styles.menuItem, hovered && styles.menuItemHovered]}
              onPress={handleDeletePress}
            >
              <Text style={styles.menuItemTextDestructive}>Delete Campaign</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      <Modal
        visible={showDeleteConfirm}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteConfirm(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.dialog}>
            <Text style={styles.dialogTitle}>Delete Campaign?</Text>
            <Text style={styles.dialogBody}>
              Are you sure you want to delete "{campaign.name}"? This action cannot be undone and all sessions, NPCs, maps, and combat modules will be permanently removed.
            </Text>
            <View style={styles.dialogActions}>
              <Button
                label="Cancel"
                variant="secondary"
                onPress={() => setShowDeleteConfirm(false)}
              />
              <Button
                label="Delete"
                variant="destructive"
                onPress={confirmDelete}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
