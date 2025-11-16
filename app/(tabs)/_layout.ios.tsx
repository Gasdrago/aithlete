
import React from 'react';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger key="home" name="(home)">
        <Icon sf="house.fill" />
        <Label>Home</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger key="workout" name="workout">
        <Icon sf="figure.strengthtraining.traditional" />
        <Label>Workout</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger key="posture" name="posture">
        <Icon sf="figure.stand" />
        <Label>Posture</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger key="projection" name="projection">
        <Icon sf="eye.fill" />
        <Label>Projection</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger key="progress" name="progress">
        <Icon sf="chart.line.uptrend.xyaxis" />
        <Label>Progress</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger key="profile" name="profile">
        <Icon sf="person.fill" />
        <Label>Profile</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
