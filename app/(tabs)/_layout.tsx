
import React from 'react';
import { Stack } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';

export default function TabLayout() {
  // Define the tabs configuration for AITHLETE
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
        <Stack.Screen key="home" name="(home)" />
        <Stack.Screen key="workout" name="workout" />
        <Stack.Screen key="posture" name="posture" />
        <Stack.Screen key="progress" name="progress" />
        <Stack.Screen key="profile" name="profile" />
      </Stack>
      <FloatingTabBar tabs={tabs} />
    </>
  );
}
