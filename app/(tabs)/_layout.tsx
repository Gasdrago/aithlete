
import React from 'react';
import { Stack } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';

export default function TabLayout() {
  // Define the tabs configuration for AITHLETE with proper icon mappings
  const tabs: TabBarItem[] = [
    {
      name: '(home)',
      route: '/(tabs)/(home)/',
      icon: 'home',
      label: 'Home',
    },
    {
      name: 'workout',
      route: '/(tabs)/workout',
      icon: 'fitness_center',
      label: 'Workout',
    },
    {
      name: 'posture',
      route: '/(tabs)/posture',
      icon: 'accessibility_new',
      label: 'Posture',
    },
    {
      name: 'projection',
      route: '/(tabs)/projection',
      icon: 'visibility',
      label: 'Projection',
    },
    {
      name: 'progress',
      route: '/(tabs)/progress',
      icon: 'trending_up',
      label: 'Progress',
    },
    {
      name: 'profile',
      route: '/(tabs)/profile',
      icon: 'person',
      label: 'Profile',
    },
  ];

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'none',
        }}
      >
        <Stack.Screen name="(home)" />
        <Stack.Screen name="workout" />
        <Stack.Screen name="posture" />
        <Stack.Screen name="projection" />
        <Stack.Screen name="progress" />
        <Stack.Screen name="profile" />
      </Stack>
      <FloatingTabBar tabs={tabs} />
    </>
  );
}
