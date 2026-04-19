import { useRouter, usePathname } from 'expo-router';
import React, { useMemo } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
  UIManager,
} from 'react-native';

import { typography, spacing, radii, componentSizes } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface SidebarProps {
  campaignId: string;
  campaignName: string;
  collapsed: boolean;
  onToggle: () => void;
}

interface NavItem {
  label: string;
  path: string;
  icon: string;
}

export default function Sidebar({
  campaignId,
  campaignName,
  collapsed,
  onToggle,
}: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const colors = useColors();

  const navItems: NavItem[] = [
    { label: 'Dashboard', path: `/(main)/campaigns/${campaignId}`, icon: '\u2302' },
    { label: 'Sessions', path: `/(main)/campaigns/${campaignId}`, icon: '\u2630' },
    { label: 'Heroes', path: `/(main)/campaigns/${campaignId}`, icon: '\u2694' },
    { label: 'Combat Modules', path: `/(main)/campaigns/${campaignId}`, icon: '\u2620' },
    { label: 'NPC Profiles', path: `/(main)/campaigns/${campaignId}`, icon: '\u263A' },
    { label: 'Maps', path: `/(main)/campaigns/${campaignId}`, icon: '\u2690' },
  ];

  const handleNav = (item: NavItem) => {
    router.push(item.path as never);
  };

  const isActive = (item: NavItem) => {
    return pathname === item.path || pathname.startsWith(item.path + '/');
  };

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          width: 240,
          backgroundColor: colors.surface,
          borderRightWidth: componentSizes.strokeWidth,
          borderRightColor: colors.border,
          paddingVertical: spacing.lg,
          paddingHorizontal: spacing.md,
          justifyContent: 'flex-start',
        },
        collapsed: {
          width: 48,
          alignItems: 'center',
          paddingHorizontal: spacing.xs,
        },
        toggleButton: {
          alignSelf: 'flex-end',
          padding: spacing.sm,
          marginBottom: spacing.md,
        },
        toggleIcon: {
          ...typography.bodyMedium,
          color: colors.muted,
        },
        campaignName: {
          ...typography.subtitleMedium,
          color: colors.text.primary,
          marginBottom: spacing.xl,
          paddingHorizontal: spacing.sm,
        },
        navList: {
          gap: spacing.xs,
          flex: 1,
        },
        navItem: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.sm,
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.sm,
          borderRadius: radii.input,
        },
        navItemActive: {
          backgroundColor: colors.surfaceHover,
        },
        navIcon: {
          fontSize: 18,
          width: 24,
          textAlign: 'center',
          color: colors.text.secondary,
        },
        navLabel: {
          ...typography.bodyMedium,
          color: colors.text.secondary,
        },
        navLabelActive: {
          fontFamily: 'Magra-Bold',
          color: colors.text.primary,
        },
        bottomGroup: {
          marginTop: spacing.md,
          borderTopWidth: 1,
          borderTopColor: colors.border,
        },
        bottomLink: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.sm,
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.sm,
        },
        bottomIcon: {
          ...typography.bodyLarge,
          color: colors.muted,
        },
        bottomLabel: {
          ...typography.bodyMedium,
          color: colors.muted,
        },
      }),
    [colors],
  );

  return (
    <View style={[styles.container, collapsed && styles.collapsed]}>
      <Pressable onPress={onToggle} style={styles.toggleButton}>
        <Text style={styles.toggleIcon}>{collapsed ? '\u25B6' : '\u25C0'}</Text>
      </Pressable>

      {!collapsed && (
        <>
          <Text style={styles.campaignName} numberOfLines={2}>
            {campaignName}
          </Text>

          <View style={styles.navList}>
            {navItems.map((item) => (
              <Pressable
                key={item.label}
                onPress={() => handleNav(item)}
                style={[
                  styles.navItem,
                  isActive(item) && styles.navItemActive,
                ]}
              >
                <Text style={styles.navIcon}>{item.icon}</Text>
                <Text
                  style={[
                    styles.navLabel,
                    isActive(item) && styles.navLabelActive,
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.bottomGroup}>
            <Pressable
              onPress={() => router.push('/(main)/settings' as never)}
              style={styles.bottomLink}
            >
              <Text style={styles.bottomIcon}>{'\u2699'}</Text>
              <Text style={styles.bottomLabel}>Settings</Text>
            </Pressable>
            <Pressable
              onPress={() => router.push('/(main)/campaigns')}
              style={styles.bottomLink}
            >
              <Text style={styles.bottomIcon}>{'\u2190'}</Text>
              <Text style={styles.bottomLabel}>All Campaigns</Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}
