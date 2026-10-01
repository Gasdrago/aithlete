import React from 'react';
import { Stack } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';
import { palette } from '@/styles/olympus';

const tabs: TabBarItem[] = [
  { name: '(home)', route: '/(tabs)/(home)', icon: 'pillar', label: 'Olympus' },
  { name: 'trials', route: '/(tabs)/trials', icon: 'sword-cross', label: 'Trials' },
  { name: 'ascension', route: '/(tabs)/ascension', icon: 'stairs-up', label: 'Ascension' },
  { name: 'prophecy', route: '/(tabs)/prophecy', icon: 'crystal-ball', label: 'Prophecy' },
  { name: 'oracle', route: '/(tabs)/oracle', icon: 'eye-outline', label: 'Oracle' },
];

export default function TabLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: { backgroundColor: palette.night },
        }}
      >
        <Stack.Screen name="(home)" />
        <Stack.Screen name="trials" />
        <Stack.Screen name="ascension" />
        <Stack.Screen name="prophecy" />
        <Stack.Screen name="oracle" />
      </Stack>
      <FloatingTabBar tabs={tabs} />
    </>
  );
}
