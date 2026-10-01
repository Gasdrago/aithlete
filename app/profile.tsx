import React, { useState } from 'react';
import { Alert, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { useAthlete, useDivinity } from '@/contexts/AthleteContext';
import type { Goal, Level } from '@/utils/divinity';
import { fonts, palette, radius, space } from '@/styles/olympus';
import { Laurel, Ornament } from '@/components/olympus/ornaments';
import {
  Chip,
  Eyebrow,
  GoldButton,
  IconName,
  Panel,
  Screen,
  SectionTitle,
  Stepper,
  Tablet,
  olympusText,
} from '@/components/olympus/ui';

const GOALS: { key: Goal; label: string }[] = [
  { key: 'muscle', label: 'Build muscle' },
  { key: 'fat-loss', label: 'Lose fat' },
  { key: 'endurance', label: 'Endurance' },
  { key: 'general', label: 'Balance' },
];

export default function ProfileScreen() {
  const { state, updateProfile, reset } = useAthlete();
  const d = useDivinity();
  const { profile, rank, stats } = d;
  const [name, setName] = useState(profile.name);

  const honours: { title: string; text: string; icon: IconName; earned: boolean }[] = [
    { title: 'First Blood', text: 'Complete a trial', icon: 'sword', earned: stats.trials >= 1 },
    { title: 'Seven Dawns', text: '7-day streak', icon: 'weather-sunset-up', earned: stats.streak >= 7 },
    { title: 'The Ten Labors', text: '10 trials completed', icon: 'shield-sword-outline', earned: stats.trials >= 10 },
    { title: 'Sculptor', text: 'Record a new carving', icon: 'hammer', earned: state.measurements.length >= 2 },
    { title: 'Heard at Delphi', text: 'Consult the Oracle', icon: 'eye-outline', earned: state.posture.length >= 1 },
    { title: 'Bronze Skin', text: 'Ascend to rank II', icon: 'star-four-points-outline', earned: rank.current.tier >= 1 },
    { title: 'Marble Flesh', text: 'Ascend to rank III', icon: 'star-four-points', earned: rank.current.tier >= 2 },
    { title: 'Golden Idol', text: 'Earn a statue of gold', icon: 'crown-outline', earned: d.material === 'gold' },
  ];
  const earned = honours.filter((h) => h.earned).length;

  const confirmReset = () => {
    const run = () => {
      reset();
      router.replace('/onboarding');
    };
    const message = 'All trials, measurements and honours will be erased. Your statue returns to clay.';
    if (Platform.OS === 'web') {
      if (globalThis.confirm?.(message)) run();
      return;
    }
    Alert.alert('Begin anew?', message, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Erase', style: 'destructive', onPress: run },
    ]);
  };

  return (
    <Screen tabBar={false}>
      <Pressable onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))} style={styles.back} hitSlop={12}>
        <MaterialCommunityIcons name="chevron-left" size={20} color={palette.gold} />
        <Text style={styles.backText}>Olympus</Text>
      </Pressable>

      <View style={{ alignItems: 'center', marginBottom: space.xl }}>
        <View style={styles.avatar}>
          <View style={StyleSheet.absoluteFill}>
            <Laurel size={150} />
          </View>
          <Text style={styles.avatarLetter}>{profile.name.charAt(0).toUpperCase()}</Text>
        </View>
        <Eyebrow center>ΗΡΩΟΝ · HALL OF THE HERO</Eyebrow>
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={olympusText.bodyItalic}>
          {rank.current.tier === 0 ? 'Mortal' : `Rank of ${rank.current.name}`} · since {new Date(profile.createdAt).toLocaleDateString()}
        </Text>
      </View>

      <View style={styles.tablets}>
        <Tablet value={stats.trials} label="Trials" icon="sword-cross" />
        <Tablet value={stats.streak} label="Streak" icon="fire" />
        <Tablet value={`${earned}/${honours.length}`} label="Laurels" icon="star-four-points-outline" />
      </View>

      <SectionTitle>Laurels</SectionTitle>
      <View style={styles.honours}>
        {honours.map((h) => (
          <View key={h.title} style={[styles.honour, h.earned && styles.honourOn]}>
            <View style={[styles.honourIcon, h.earned && { borderColor: palette.goldBright, backgroundColor: 'rgba(212,175,106,0.15)' }]}>
              <MaterialCommunityIcons name={h.icon} size={20} color={h.earned ? palette.goldBright : palette.stoneDim} />
            </View>
            <Text style={[styles.honourTitle, !h.earned && { color: palette.stone }]}>{h.title}</Text>
            <Text style={[olympusText.small, { textAlign: 'center', fontSize: 11 }]}>{h.text}</Text>
          </View>
        ))}
      </View>

      <SectionTitle>The hero</SectionTitle>
      <Panel>
        <Text style={[olympusText.label, { marginBottom: 8 }]}>Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          onEndEditing={() => name.trim() && updateProfile({ name: name.trim() })}
          onBlur={() => name.trim() && updateProfile({ name: name.trim() })}
          style={styles.input}
          maxLength={24}
          placeholderTextColor={palette.stoneDim}
        />
        <Stepper label="Height" unit="cm" step={1} min={130} max={230} value={profile.heightCm} onChange={(v) => updateProfile({ heightCm: v })} />
        <Text style={[olympusText.label, { marginTop: space.lg, marginBottom: 8 }]}>Aim</Text>
        <View style={styles.chips}>
          {GOALS.map((g) => (
            <Chip key={g.key} label={g.label} active={profile.goal === g.key} onPress={() => updateProfile({ goal: g.key })} />
          ))}
        </View>
        <Text style={[olympusText.label, { marginTop: space.md, marginBottom: 8 }]}>Experience</Text>
        <View style={styles.chips}>
          {(['Beginner', 'Intermediate', 'Advanced'] as Level[]).map((l) => (
            <Chip key={l} label={l} active={profile.level === l} onPress={() => updateProfile({ level: l })} />
          ))}
        </View>
        <Text style={[olympusText.small, { marginTop: space.md }]}>
          Pantheon: {profile.sex === 'female' ? 'the Goddesses' : 'the Gods'}. To change it, begin anew.
        </Text>
      </Panel>

      <SectionTitle>Sanctuary</SectionTitle>
      <Panel style={{ gap: space.md }}>
        <Text style={olympusText.body}>
          Your chronicle lives only on this device. No account, no cloud — what happens on Olympus stays on Olympus.
        </Text>
        <GoldButton label="Begin anew" icon="restore" variant="outline" onPress={confirmReset} />
      </Panel>

      <View style={styles.footer}>
        <Ornament width={120} />
        <Text style={styles.version}>AITHLETE · v2.0</Text>
        <Text style={olympusText.small}>Forged with discipline · Inspired by the gods</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  back: { flexDirection: 'row', alignItems: 'center', marginBottom: space.lg },
  backText: { fontFamily: fonts.displaySemi, fontSize: 12, letterSpacing: 2, color: palette.gold, textTransform: 'uppercase' },
  avatar: { width: 150, height: 150, alignItems: 'center', justifyContent: 'center', marginBottom: space.md },
  avatarLetter: { fontFamily: fonts.displayBlack, fontSize: 52, color: palette.goldBright, marginTop: -6 },
  name: { fontFamily: fonts.display, fontSize: 30, color: palette.ivory, letterSpacing: 2, marginVertical: 4 },
  tablets: { flexDirection: 'row', gap: space.md },
  honours: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  honour: {
    width: '31.5%',
    flexGrow: 1,
    alignItems: 'center',
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: palette.hairline,
    backgroundColor: palette.surface,
    gap: 4,
  },
  honourOn: { borderColor: palette.border },
  honourIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: palette.hairline,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  honourTitle: { fontFamily: fonts.displaySemi, fontSize: 11, color: palette.goldBright, textAlign: 'center', letterSpacing: 0.5 },
  input: {
    height: 50,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
    paddingHorizontal: space.lg,
    color: palette.ivory,
    fontFamily: fonts.display,
    fontSize: 18,
    marginBottom: space.sm,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  footer: { alignItems: 'center', gap: 6, marginTop: space.huge },
  version: { fontFamily: fonts.displaySemi, fontSize: 12, letterSpacing: 3, color: palette.gold, marginTop: space.sm },
});
