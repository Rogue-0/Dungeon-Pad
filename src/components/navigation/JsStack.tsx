import {
  createStackNavigator,
  type StackCardInterpolationProps,
  type StackNavigationOptions,
  TransitionPresets,
} from '@react-navigation/stack';
import type { ParamListBase, StackNavigationState } from '@react-navigation/native';
import { withLayoutContext } from 'expo-router';
import { Animated } from 'react-native';

const { Navigator } = createStackNavigator();

/**
 * JS-based stack navigator — used instead of expo-router's native Stack because
 * iOS native-stack forces parallax (outgoing screen lags behind incoming), which
 * looks wrong against our static AppBackground. This interpolator paired-slides
 * both screens at the same rate, so they never overlap.
 */
export const JsStack = withLayoutContext<
  StackNavigationOptions,
  typeof Navigator,
  StackNavigationState<ParamListBase>,
  any
>(Navigator);

export const pairedSlideInterpolator = ({
  current,
  next,
  layouts,
}: StackCardInterpolationProps) => {
  const translateFocused = current.progress.interpolate({
    inputRange: [0, 1],
    outputRange: [layouts.screen.width, 0],
  });

  const translateUnfocused = next
    ? next.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -layouts.screen.width],
      })
    : 0;

  return {
    cardStyle: {
      transform: [
        {
          translateX: Animated.add(translateFocused, translateUnfocused),
        },
      ],
    },
  };
};

export const PAIRED_SLIDE_PRESET: StackNavigationOptions = {
  ...TransitionPresets.SlideFromRightIOS,
  cardStyleInterpolator: pairedSlideInterpolator,
  transitionSpec: {
    open: { animation: 'timing', config: { duration: 260 } },
    close: { animation: 'timing', config: { duration: 260 } },
  },
  cardStyle: { backgroundColor: 'transparent' },
  cardOverlayEnabled: false,
};
