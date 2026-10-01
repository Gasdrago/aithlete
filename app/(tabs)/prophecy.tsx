import React, { useMemo, useState } from 'react';
import { Alert, Image, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';

import { useDivinity } from '@/contexts/AthleteContext';
import {
  type Goal,
  bodyFatOf,
  divinityOf,
  materialForTier,
  projectBody,
  rankFor,
  compareTo,
  statueParamsFrom,
} from '@/utils/divinity';
import { fonts, palette, space } from '@/styles/olympus';
import { AthleteStatue } from '@/components/olympus/figures';
import { CoinRim, Ornament } from '@/components/olympus/ornaments';
import {
  Chip,
  DeityMedallion,
  GoldBar,
  GoldButton,
  Panel,
  Screen,
  ScreenHeader,
  SectionTitle,
  olympusText,
} from '@/components/olympus/ui';

const HORIZONS = [3, 6, 12] as const;
const DEVOTION = [
  { label: 'Casual · 2×/wk', value: 0.35 },
  { label: 'Devoted · 4×/wk', value: 0.75 },
  { label: 'Fanatic · 6×/wk', value: 1 },
];
const GOALS: { key: Goal; label: string }[] = [
  { key: 'muscle', label: 'Build muscle' },
  { key: 'fat-loss', label: 'Lose fat' },
  { key: 'endurance', label: 'Endurance' },
  { key: 'general', label: 'Balance' },
];

const GOAL_TRIAL: Record<Goal, string> = {
  muscle: 'apollo-canon',
  'fat-loss': 'winged-sandals',
  endurance: 'hunt-of-artemis',
  general: 'aegis-of-athena',
};

export default function ProphecyScreen() {
  const d = useDivinity();
  const { profile, latest, rank } = d;
  const { width } = useWindowDimensions();
  const contentW = Math.min(width, 640) - space.gutter * 2;

  const [months, setMonths] = useState<(typeof HORIZONS)[number]>(6);
  const [devotion, setDevotion] = useState(0.75);
  const [goal, setGoal] = useState<Goal>(profile.goal);
  const [photo, setPhoto] = useState<string | null>(null);

  const future = useMemo(() => {
    const body = projectBody(latest, months, { sex: profile.sex, heightCm: profile.heightCm, goal, level: profile.level, adherence: devotion });
    const breakdown = divinityOf(body, profile.heightCm, profile.sex, devotion);
    const futureRank = rankFor(breakdown.score, profile.sex);
    return {
      body,
      breakdown,
      rank: futureRank,
      material: materialForTier(futureRank.current.tier, futureRank.ladder.length),
      params: statueParamsFrom(body, profile.heightCm, profile.sex),
    };
  }, [latest, months, profile, goal, devotion]);

  const statueW = Math.min((contentW - space.lg * 2) / 2 - 10, 170);

  const pick = async (camera: boolean) => {
    try {
      if (camera) {
        const perm = await ImagePicker.requestCameraPermissionsAsync();
        if (!perm.granted) {
          Alert.alert('Permission required', 'Camera access is needed to take your portrait.');
          return;
        }
      }
      const opts: ImagePicker.ImagePickerOptions = { mediaTypes: ['images'], allowsEditing: true, aspect: [3, 4], quality: 0.8 };
      const result = camera ? await ImagePicker.launchCameraAsync(opts) : await ImagePicker.launchImageLibraryAsync(opts);
      if (!result.canceled) setPhoto(result.assets[0].uri);
    } catch (e) {
      console.warn('Image picker failed', e);
    }
  };

  const bf0 = bodyFatOf(latest, profile.heightCm, profile.sex);
  const rows = [
    { label: 'Weight', unit: 'kg', from: latest.weight, to: future.body.weight },
    { label: 'Body fat', unit: '%', from: bf0, to: future.body.bodyFat ?? bf0 },
    { label: 'Shoulders', unit: 'cm', from: latest.shoulders, to: future.body.shoulders },
    { label: 'Chest', unit: 'cm', from: latest.chest, to: future.body.chest },
    { label: 'Waist', unit: 'cm', from: latest.waist, to: future.body.waist },
    { label: 'Arms', unit: 'cm', from: latest.arm, to: future.body.arm },
    { label: 'Thighs', unit: 'cm', from: latest.thigh, to: future.body.thigh },
  ];

  const ascends = future.rank.current.tier > rank.current.tier;

  // the god this path leads to: the rank foretold, or the next one when standing still
  const target = future.rank.current.tier > rank.current.tier ? future.rank.current : rank.next ?? rank.current;
  const likenessNow = compareTo(latest, profile.heightCm, profile.sex, target).similarity;
  const likenessThen = compareTo(future.body, profile.heightCm, profile.sex, target).similarity;

  return (
    <Screen>
      <ScreenHeader greek="ΜΟΙΡΑΙ · THE FATES" title="Prophecy" subtitle="The Fates have spun your thread. Behold what it holds." />

      {/* Portrait */}
      <Panel style={{ marginBottom: space.md }}>
        <View style={styles.portraitRow}>
          <View style={styles.portrait}>
            {photo ? (
              <Image source={{ uri: photo }} style={StyleSheet.absoluteFill} resizeMode="cover" />
            ) : (
              <MaterialCommunityIcons name="account-outline" size={40} color={palette.stoneDim} />
            )}
            <CoinRim size={92} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.portraitTitle}>{photo ? 'Your mortal portrait' : 'Offer your portrait'}</Text>
            <Text style={olympusText.small}>Kept on your device, beside your statue, to remember where the ascent began.</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: space.md }}>
              <GoldButton compact variant="outline" icon="camera-outline" label="Capture" onPress={() => pick(true)} />
              <GoldButton compact variant="outline" icon="image-outline" label="Library" onPress={() => pick(false)} />
            </View>
          </View>
        </View>
      </Panel>

      {/* Parameters */}
      <SectionTitle>Consult the Fates</SectionTitle>
      <Text style={[olympusText.label, styles.paramLabel]}>Horizon</Text>
      <View style={styles.chips}>
        {HORIZONS.map((h) => (
          <Chip key={h} label={`${h} months`} active={months === h} onPress={() => setMonths(h)} />
        ))}
      </View>
      <Text style={[olympusText.label, styles.paramLabel]}>Path</Text>
      <View style={styles.chips}>
        {GOALS.map((g) => (
          <Chip key={g.key} label={g.label} active={goal === g.key} onPress={() => setGoal(g.key)} />
        ))}
      </View>
      <Text style={[olympusText.label, styles.paramLabel]}>Devotion</Text>
      <View style={styles.chips}>
        {DEVOTION.map((v) => (
          <Chip key={v.label} label={v.label} active={devotion === v.value} onPress={() => setDevotion(v.value)} />
        ))}
      </View>

      {/* Vision */}
      <SectionTitle>The vision</SectionTitle>
      <Panel variant="gold" style={{ paddingHorizontal: space.lg }}>
        <View style={styles.versus}>
          <View style={styles.col}>
            <Text style={olympusText.greek}>TODAY</Text>
            <AthleteStatue params={d.statue} sex={profile.sex} tier={rank.current.tier} material={d.material} width={statueW} />
            <Text style={styles.colName}>{rank.current.tier === 0 ? 'Mortal' : rank.current.name}</Text>
            <Text style={olympusText.small}>Divinity {Math.round(d.breakdown.score)}</Text>
          </View>
          <View style={styles.col}>
            <Text style={olympusText.greek}>IN {months} MONTHS</Text>
            <AthleteStatue params={future.params} sex={profile.sex} tier={future.rank.current.tier} material={future.material} width={statueW} halo />
            <Text style={[styles.colName, { color: palette.goldBright }]}>{future.rank.current.tier === 0 ? 'Mortal' : future.rank.current.name}</Text>
            <Text style={olympusText.small}>Divinity {Math.round(future.breakdown.score)}</Text>
          </View>
        </View>
        <Ornament width={160} style={{ marginVertical: space.lg }} />
        <Text style={styles.verdict}>
          {ascends
            ? `Hold this path and you will ascend to the rank of ${future.rank.current.name}.`
            : future.rank.next
              ? `You will stand ${future.rank.pointsToNext} points from ${future.rank.next.name}. Push your devotion further.`
              : 'You will hold the throne of Olympus.'}
        </Text>
      </Panel>

      {/* Numbers */}
      <SectionTitle>Foretold measures</SectionTitle>
      <Panel>
        {rows.map((r) => {
          const delta = Math.round((r.to - r.from) * 10) / 10;
          return (
            <View key={r.label} style={styles.row}>
              <Text style={styles.rowLabel}>{r.label}</Text>
              <Text style={styles.rowFrom}>
                {r.from.toFixed(1)} → <Text style={{ color: palette.ivory }}>{r.to.toFixed(1)}</Text>
                <Text style={olympusText.small}> {r.unit}</Text>
              </Text>
              <Text style={[styles.rowDelta, { color: delta === 0 ? palette.stone : palette.goldBright }]}>
                {delta > 0 ? '+' : delta < 0 ? '−' : ''}
                {Math.abs(delta).toFixed(1)}
              </Text>
            </View>
          );
        })}
      </Panel>

      {/* Future likeness */}
      <SectionTitle>Your future likeness</SectionTitle>
      <Panel>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.lg }}>
          <DeityMedallion deity={target} size={88} />
          <View style={{ flex: 1 }}>
            <Text style={olympusText.label}>Likeness to</Text>
            <Text style={styles.likeName}>{target.name}</Text>
            <Text style={olympusText.small}>
              Today {Math.round(likenessNow * 100)}% → <Text style={{ color: palette.goldBright }}>{Math.round(likenessThen * 100)}%</Text> in {months} months
            </Text>
            <GoldBar progress={likenessThen} height={4} style={{ marginTop: 8 }} />
          </View>
        </View>
      </Panel>

      <GoldButton
        label="Walk this path"
        icon="sword-cross"
        onPress={() => router.push({ pathname: '/trials', params: { trial: GOAL_TRIAL[goal] } })}
        style={{ marginTop: space.xl }}
      />
      <Text style={styles.disclaimer}>
        Prophecies are estimates from typical progress rates for your level — not guarantees. Consistency, sleep and nutrition write the rest.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  portraitRow: { flexDirection: 'row', alignItems: 'center', gap: space.lg },
  portrait: {
    width: 92,
    height: 92,
    borderRadius: 46,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#15110C',
  },
  portraitTitle: { fontFamily: fonts.display, fontSize: 17, color: palette.ivory, marginBottom: 4 },
  paramLabel: { marginBottom: 8 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: space.lg },
  versus: { flexDirection: 'row', alignItems: 'flex-end' },
  col: { flex: 1, alignItems: 'center', gap: 6 },
  colName: { fontFamily: fonts.display, fontSize: 16, color: palette.ivory, marginTop: 4 },
  verdict: { fontFamily: fonts.serifItalic, fontSize: 18, lineHeight: 25, textAlign: 'center', color: palette.marble },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: palette.hairline,
  },
  rowLabel: { flex: 1, fontFamily: fonts.sansMedium, fontSize: 14, color: palette.marble },
  rowFrom: { fontFamily: fonts.sans, fontSize: 13, color: palette.stone },
  rowDelta: { width: 56, textAlign: 'right', fontFamily: fonts.sansSemi, fontSize: 13 },
  likeName: { fontFamily: fonts.display, fontSize: 22, color: palette.goldBright, marginVertical: 2 },
  disclaimer: { ...olympusText.small, textAlign: 'center', marginTop: space.lg, color: palette.stoneDim },
});
