import React, { useMemo, useState } from 'react';
import { Text, View, StyleSheet, Pressable, Platform, Dimensions, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';

import { Card, Button } from '@/components/ui';
import { typography, spacing, radii, componentSizes } from '@/theme/tokens';
import { paletteByIndex } from '@/theme/gradients';
import { useColors } from '@/theme/use-theme';

type PlaceholderType = 'session' | 'combat' | 'npc' | 'map' | 'hero' | 'default';

interface MiniCardProps {
  title: string;
  description?: string | null;
  imageUri?: string | null;
  onPress?: () => void;
  onImageChange?: (uri: string) => void;
  onDelete?: () => void;
  isAddCard?: boolean;
  gradientIndex?: number;
  placeholderType?: PlaceholderType;
  sessionNumber?: number | null;
}

/** Card used in horizontal scroll rows on the Campaign Overview */
export default function MiniCard({
  title,
  description,
  imageUri: initialImageUri,
  onPress,
  onImageChange,
  onDelete,
  isAddCard,
  gradientIndex = 0,
  placeholderType = 'default',
  sessionNumber,
}: MiniCardProps) {
  const colors = useColors();
  const [imageUri, setImageUri] = useState<string | null>(initialImageUri ?? null);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const palette = paletteByIndex(gradientIndex);

  const pickImage = async () => {
    setShowContextMenu(false);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
      onImageChange?.(result.assets[0].uri);
    }
  };

  const openContextMenu = (pageX: number, pageY: number) => {
    const hasCoords = pageX > 0 && pageY > 0;
    if (hasCoords) {
      setMenuPosition({ x: pageX, y: pageY });
    } else {
      const { width: w, height: h } = Dimensions.get('window');
      setMenuPosition({ x: w / 2 - 90, y: h / 2 - 60 });
    }
    setShowContextMenu(true);
  };

  const handleDeletePress = () => {
    setShowContextMenu(false);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    setShowDeleteConfirm(false);
    onDelete?.();
  };

  const styles = useMemo(
    () =>
      StyleSheet.create({
        card: {
          padding: 0,
        },
        imageArea: {
          flex: 1,
          borderTopLeftRadius: 14,
          borderTopRightRadius: 14,
          overflow: 'hidden',
        },
        textArea: {
          paddingHorizontal: spacing.md,
          paddingTop: spacing.sm + 4,
          paddingBottom: spacing.md,
        },
        title: {
          ...typography.subtitleSmall,
          color: colors.text.primary,
        },
        description: {
          ...typography.bodySmall,
          color: colors.text.tertiary,
          marginTop: 4,
        },
        placeholderContent: {
          ...StyleSheet.absoluteFillObject,
          justifyContent: 'center',
          alignItems: 'center',
        },
        sessionNumber: {
          fontFamily: 'Magra-Bold',
          fontSize: 72,
          color: 'rgba(255,255,255,0.85)',
        },
        placeholderIcon: {
          fontSize: 56,
        },
        bustIcon: {
          alignItems: 'center',
          opacity: 0.7,
        },
        bustHead: {
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: 'rgba(255,255,255,0.75)',
          marginBottom: 4,
        },
        bustShoulders: {
          width: 72,
          height: 36,
          borderTopLeftRadius: 36,
          borderTopRightRadius: 36,
          backgroundColor: 'rgba(255,255,255,0.75)',
        },
        mapIcon: {
          alignItems: 'center',
          opacity: 0.7,
        },
        mapBody: {
          width: 64,
          height: 48,
          borderRadius: 6,
          backgroundColor: 'rgba(255,255,255,0.75)',
          flexDirection: 'row',
          overflow: 'hidden',
        },
        mapFoldLeft: {
          flex: 1,
          borderRightWidth: 1,
          borderRightColor: 'rgba(0,0,0,0.15)',
        },
        mapFoldRight: {
          flex: 1,
          borderLeftWidth: 1,
          borderLeftColor: 'rgba(0,0,0,0.15)',
        },
        mapPin: {
          width: 12,
          height: 12,
          borderRadius: 6,
          backgroundColor: 'rgba(255,255,255,0.9)',
          marginTop: -8,
          borderWidth: 2,
          borderColor: 'rgba(0,0,0,0.2)',
        },
        addCard: {
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.surfaceSecondary,
        },
        addIcon: {
          fontSize: 40,
          color: colors.muted,
          marginBottom: spacing.xs,
        },
        addText: {
          ...typography.bodyMedium,
          color: colors.text.tertiary,
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
          minWidth: 180,
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
          maxWidth: 380,
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

  if (isAddCard) {
    return (
      <Card
        width={240}
        height={280}
        onPress={onPress}
        style={styles.addCard}
      >
        <Text style={styles.addIcon}>+</Text>
        <Text style={styles.addText}>{title}</Text>
      </Card>
    );
  }

  return (
    <>
      <Card
        width={240}
        height={280}
        onPress={onPress}
        onLongPress={(e) =>
          openContextMenu(e?.nativeEvent?.pageX ?? 0, e?.nativeEvent?.pageY ?? 0)
        }
        style={styles.card}
      >
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
              style={StyleSheet.absoluteFill}
              contentFit="cover"
            />
          ) : (
            <View style={StyleSheet.absoluteFill}>
              <LinearGradient
                colors={[...palette]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <View style={styles.placeholderContent}>
                {placeholderType === 'session' && sessionNumber != null && (
                  <Text style={styles.sessionNumber}>{sessionNumber}</Text>
                )}
                {placeholderType === 'combat' && (
                  <Text style={styles.placeholderIcon}>&#x2694;&#xFE0F;</Text>
                )}
                {placeholderType === 'npc' && (
                  <View style={styles.bustIcon}>
                    <View style={styles.bustHead} />
                    <View style={styles.bustShoulders} />
                  </View>
                )}
                {placeholderType === 'hero' && (
                  <View style={styles.bustIcon}>
                    <View style={styles.bustHead} />
                    <View style={styles.bustShoulders} />
                  </View>
                )}
                {placeholderType === 'map' && (
                  <View style={styles.mapIcon}>
                    <View style={styles.mapBody}>
                      <View style={styles.mapFoldLeft} />
                      <View style={styles.mapFoldRight} />
                    </View>
                    <View style={styles.mapPin} />
                  </View>
                )}
              </View>
            </View>
          )}
        </View>
        <View style={styles.textArea}>
          <Text style={styles.title} numberOfLines={2}>{title}</Text>
          {description ? (
            <Text style={styles.description} numberOfLines={2}>{description}</Text>
          ) : null}
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
              <Text style={styles.menuItemTextDestructive}>Delete</Text>
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
            <Text style={styles.dialogTitle}>Delete "{title}"?</Text>
            <Text style={styles.dialogBody}>
              Are you sure? This action cannot be undone.
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
