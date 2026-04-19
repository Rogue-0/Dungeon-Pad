import * as ImagePicker from 'expo-image-picker';
import { useCallback } from 'react';
import { Alert, Platform } from 'react-native';

/**
 * Shared "pick an image from the library" flow for background pickers.
 * Handles permission prompt + the library dialog, hands the chosen URI
 * back to the caller.
 */
export function useBackgroundPicker(onPicked: (uri: string) => void) {
  return useCallback(async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      const msg =
        'Photo library access is needed to choose a background. Enable it in Settings.';
      if (Platform.OS === 'web') window.alert(msg);
      else Alert.alert('Permission needed', msg);
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 0.85,
    });
    if (!result.canceled && result.assets[0]) {
      onPicked(result.assets[0].uri);
    }
  }, [onPicked]);
}
