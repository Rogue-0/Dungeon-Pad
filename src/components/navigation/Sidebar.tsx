import { useRouter, usePathname } from 'expo-router';
import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';

import { colors, typography, spacing, radii, componentSizes } from '@/theme/tokens';

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

  return (
    <View style={[styles.container, collapsed && styles.collapsed]}>
      {/* Toggle button */}
      <Pressable onPress={onToggle} style={styles.toggleButton}>
        <Text style={styles.toggleIcon}>{collapsed ? '\u25B6' : '\u25C0'}</Text>
      </Pressable>

      {!collapsed && (
        <>
          {/* Campaign name */}
          <Text style={styles.campaignName} numberOfLines={2}>
            {campaignName}
          </Text>

          {/* Nav items */}
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

          {/* Back to campaigns */}
          <Pressable
            onPress={() => router.push('/(main)/campaigns')}
            style={styles.backToCampaigns}
          >
            <Text style={styles.backIcon}>{'\u2190'}</Text>
            <Text style={styles.backLabel}>All Campaigns</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
    color: colors.foreground,
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
  },
  navLabel: {
    ...typography.bodyMedium,
    color: colors.foreground,
  },
  navLabelActive: {
    fontFamily: 'Magra-Bold',
  },
  backToCampaigns: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: spacing.md,
  },
  backIcon: {
    ...typography.bodyLarge,
    color: colors.muted,
  },
  backLabel: {
    ...typography.bodyMedium,
    color: colors.muted,
  },
});
