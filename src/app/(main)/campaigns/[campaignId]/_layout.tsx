import React from 'react';

import { JsStack, PAIRED_SLIDE_PRESET } from '@/components/navigation/JsStack';

export default function CampaignLayout() {
  return (
    <JsStack
      screenOptions={{
        headerShown: false,
        ...PAIRED_SLIDE_PRESET,
      }}
    />
  );
}
