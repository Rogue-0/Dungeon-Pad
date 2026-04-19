import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

interface FadeMaskProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Start of the fade as a 0-1 fraction of width. Default 0.9 (last 10% fades) */
  fadeStart?: number;
}

/**
 * Horizontally fades its children out at the right edge using a gradient mask.
 * Content is fully opaque from 0 to `fadeStart` and fades to transparent at 1.
 */
export default function FadeMask({ children, style, fadeStart = 0.9 }: FadeMaskProps) {
  return (
    <MaskedView
      style={style}
      maskElement={
        <LinearGradient
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          colors={['#000', '#000', 'rgba(0,0,0,0)']}
          locations={[0, fadeStart, 1]}
          style={StyleSheet.absoluteFill}
        />
      }
    >
      {children}
    </MaskedView>
  );
}
