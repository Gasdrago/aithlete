import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Svg, { Circle, Defs, LinearGradient, Line, Path, Stop } from 'react-native-svg';
import * as Haptics from 'expo-haptics';

import { useAthlete, useDivinity } from '@/contexts/AthleteContext';
import { findDeity, type Deity } from '@/data/pantheon';
import {
  type BodyMeasurements,
  type MeasureKey,
  compareTo,
  estimateBodyFat,
  statueParamsFrom,
} from '@/utils/divinity';
import { fonts, palette, radius, space } from '@/styles/olympus';
import { AthleteStatue, DeityStatue } from '@/components/olympus/figures';
import { Ornament } from '@/components/olympus/ornaments';
import {
  Chip,
  GoldBar,
  GoldButton,
  Panel,
  Screen,
  ScreenHeader,
  SectionTitle,
  Stepper,
  olympusText,
  tap,
} from '@/components/olympus/ui';

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];

export default function AscensionScreen() {
  const params = useLocalSearchParams<{ god?: string }>();
  const d = useDivinity();
  const { width } = useWindowDimensions();
  const contentW = Math.min(width, 640) - space.gutter * 2;
  const { profile, rank, latest } = d;

  const [godId, setGodId] = useState<string | null>(params.god ?? null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (params.god) setGodId(params.god);
  }, [params.god]);

  const god: Deity = useMemo(() => {
    const g = godId ? findDeity(godId) : undefined;
    return g && g.sex === profile.sex && g.tier > 0 ? g : rank.next ?? rank.ladder[rank.ladder.length - 1];
  }, [godId, profile.sex, rank]);

  const comparison = useMemo(() => compareTo(latest, profile.heightCm, profile.sex, god), [latest, profile, god]);
  const statueW = Math.min((contentW - space.xl * 2) / 2 - 6, 180);

  return (
    <Screen>
      <ScreenHeader greek="ΑΝΑΒΑΣΙΣ · ASCENSION" title="Ascension" subtitle="Measure yourself against the gods." />

      {/* Ladder */}
      <SectionTitle>The pantheon</SectionTitle>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: space.md, paddingRight: space.lg }} style={{ marginHorizontal: -space.gutter, paddingLeft: space.gutter }}>
        {rank.ladder.map((g) => {
          const reached = g.tier <= rank.current.tier;
          const isCurrent = g.tier === rank.current.tier;
          const selected = g.id === god.id;
          return (
            <Pressable
              key={g.id}
              onPress={() => {
                if (g.tier === 0) return;
                tap();
                setGodId(g.id);
              }}
              style={[styles.rung, reached && styles.rungReached, selected && styles.rungSelected]}
            >
              <Text style={styles.rungNumeral}>{ROMAN[g.tier]}</Text>
              <View style={{ height: 150, justifyContent: 'flex-end' }}>
                {isCurrent ? (
                  <AthleteStatue params={d.statue} sex={profile.sex} tier={rank.current.tier} material={d.material} width={74} />
                ) : (
                  <DeityStatue deity={g} width={74} veiled={!reached} />
                )}
              </View>
              <Text style={[styles.rungName, reached && { color: palette.goldBright }]}>{g.name}</Text>
              <Text style={styles.rungMeta}>{isCurrent ? 'You are here' : reached ? 'Ascended' : `${g.threshold} pts`}</Text>
              {!reached && <MaterialCommunityIcons name="lock-outline" size={12} color={palette.stoneDim} style={{ marginTop: 2 }} />}
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Versus */}
      <SectionTitle>Statue against statue</SectionTitle>
      <Panel variant="gold" style={{ paddingHorizontal: space.lg }}>
        <View style={styles.versusRow}>
          <View style={styles.versusCol}>
            <AthleteStatue params={d.statue} sex={profile.sex} tier={rank.current.tier} material={d.material} width={statueW} />
            <Text style={styles.versusName}>{profile.name}</Text>
            <Text style={olympusText.small}>{rank.current.tier === 0 ? 'Mortal' : `Rank of ${rank.current.name}`}</Text>
          </View>
          <View style={styles.versusMid}>
            <Text style={styles.versusPct}>{Math.round(comparison.similarity * 100)}%</Text>
            <Text style={styles.versusLabel}>LIKENESS</Text>
          </View>
          <View style={styles.versusCol}>
            <DeityStatue deity={god} width={statueW} halo />
            <Text style={[styles.versusName, { color: palette.goldBright }]}>{god.name}</Text>
            <Text style={olympusText.small}>{god.epithet}</Text>
          </View>
        </View>
        <Ornament width={160} style={{ marginVertical: space.lg }} />
        <Text style={[olympusText.bodyItalic, { textAlign: 'center' }]}>{god.lore}</Text>
      </Panel>

      {/* Metrics */}
      <SectionTitle>The divine measure</SectionTitle>
      <Panel>
        <Text style={[olympusText.small, { marginBottom: space.md }]}>
          {god.name}’s proportions, scaled to your height of {profile.heightCm} cm.
        </Text>
        {comparison.metrics.map((m) => {
          const delta = m.target - m.yours;
          const matched = m.match >= 0.97;
          const surpassed = !matched && ((m.better === 'higher' && delta < 0) || (m.better === 'lower' && delta > 0));
          const unit = m.unit ? ` ${m.unit}` : '';
          const f = m.key === 'adonis' ? (v: number) => v.toFixed(2) : fmt;
          const note = matched
            ? 'Worthy of the gods'
            : surpassed
              ? `Surpassed by ${f(Math.abs(delta))}${unit}`
              : `${delta > 0 ? '+' : '−'}${f(Math.abs(delta))}${unit} to match`;
          return (
            <View key={m.key} style={styles.metric}>
              <View style={styles.metricHead}>
                <Text style={styles.metricLabel}>{m.label}</Text>
                <Text style={styles.metricValues}>
                  {f(m.yours)}
                  <Text style={{ color: palette.stoneDim }}> → </Text>
                  <Text style={{ color: palette.goldBright }}>{f(m.target)}</Text>
                  <Text style={styles.metricUnit}>{unit}</Text>
                </Text>
              </View>
              <GoldBar progress={m.match} height={4} />
              <Text style={[styles.metricDelta, (matched || surpassed) && { color: palette.laurel }]}>{note}</Text>
            </View>
          );
        })}
      </Panel>

      {/* Evolution */}
      <SectionTitle action={editing ? undefined : 'Record'} onAction={() => setEditing(true)}>
        Your evolution
      </SectionTitle>
      {editing ? (
        <MeasureForm onDone={() => setEditing(false)} />
      ) : (
        <Evolution width={contentW} onRecord={() => setEditing(true)} />
      )}
    </Screen>
  );
}

const fmt = (v: number) => (Math.abs(v - Math.round(v)) < 0.05 ? `${Math.round(v)}` : v.toFixed(1));

function Evolution({ width, onRecord }: { width: number; onRecord: () => void }) {
  const d = useDivinity();
  const { history, profile, rank } = d;
  const firstParams = useMemo(() => statueParamsFrom(d.first, profile.heightCm, profile.sex), [d.first, profile]);
  const chartW = width - space.xl * 2;
  const chartH = 140;

  if (history.length < 2) {
    return (
      <Panel>
        <Text style={olympusText.body}>
          Your first statue has been carved. Record your measurements every few weeks and watch the clay turn to bronze, marble — and gold.
        </Text>
        <GoldButton label="Record measurements" icon="tape-measure" onPress={onRecord} style={{ marginTop: space.lg }} />
      </Panel>
    );
  }

  const scores = history.map((h) => h.score);
  const min = Math.max(0, Math.min(...scores) - 5);
  const max = Math.min(100, Math.max(...scores) + 5);
  const pts = scores.map((s, i) => [
    (i / (scores.length - 1)) * (chartW - 16) + 8,
    chartH - 10 - ((s - min) / Math.max(1, max - min)) * (chartH - 24),
  ]);
  const line = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x},${y}`).join(' ');
  const area = `${line} L${pts[pts.length - 1][0]},${chartH} L${pts[0][0]},${chartH} Z`;
  const gain = scores[scores.length - 1] - scores[0];

  return (
    <Panel>
      <View style={styles.evoHead}>
        <View>
          <Text style={olympusText.label}>Divinity over time</Text>
          <Text style={styles.evoGain}>
            {gain >= 0 ? '+' : ''}
            {gain.toFixed(1)} <Text style={olympusText.small}>since your first carving</Text>
          </Text>
        </View>
      </View>
      <Svg width={chartW} height={chartH}>
        <Defs>
          <LinearGradient id="evoFill" x1="0" y1="0" x2="0" y2="1">
            <Stop offset={0} stopColor={palette.gold} stopOpacity={0.35} />
            <Stop offset={1} stopColor={palette.gold} stopOpacity={0} />
          </LinearGradient>
        </Defs>
        {[0.25, 0.5, 0.75].map((f) => (
          <Line key={f} x1={0} x2={chartW} y1={chartH * f} y2={chartH * f} stroke={palette.hairline} strokeWidth={1} />
        ))}
        <Path d={area} fill="url(#evoFill)" />
        <Path d={line} stroke={palette.goldBright} strokeWidth={2} fill="none" strokeLinejoin="round" />
        {pts.map(([x, y], i) => (
          <Circle key={i} cx={x} cy={y} r={3.5} fill={palette.night} stroke={palette.goldBright} strokeWidth={1.5} />
        ))}
      </Svg>
      <View style={styles.timeline}>
        <View style={{ alignItems: 'center' }}>
          <AthleteStatue params={firstParams} sex={profile.sex} tier={0} material="clay" width={92} />
          <Text style={olympusText.small}>{new Date(d.first.date).toLocaleDateString()}</Text>
        </View>
        <MaterialCommunityIcons name="arrow-right-thin" size={28} color={palette.gold} />
        <View style={{ alignItems: 'center' }}>
          <AthleteStatue params={d.statue} sex={profile.sex} tier={rank.current.tier} material={d.material} width={92} />
          <Text style={olympusText.small}>Today</Text>
        </View>
      </View>
      <GoldButton label="New carving" icon="tape-measure" variant="outline" onPress={onRecord} style={{ marginTop: space.lg }} />
    </Panel>
  );
}

const FIELDS: { key: MeasureKey; label: string; hint?: string; step: number; unit: string }[] = [
  { key: 'weight', label: 'Weight', step: 0.5, unit: 'kg' },
  { key: 'shoulders', label: 'Shoulders', hint: 'Around the widest point of the deltoids', step: 0.5, unit: 'cm' },
  { key: 'chest', label: 'Chest', hint: 'At nipple height, relaxed', step: 0.5, unit: 'cm' },
  { key: 'waist', label: 'Waist', hint: 'At the navel', step: 0.5, unit: 'cm' },
  { key: 'hips', label: 'Hips', hint: 'Widest point of the glutes', step: 0.5, unit: 'cm' },
  { key: 'arm', label: 'Arm', hint: 'Flexed biceps', step: 0.5, unit: 'cm' },
  { key: 'thigh', label: 'Thigh', hint: 'Below the glute fold', step: 0.5, unit: 'cm' },
  { key: 'calf', label: 'Calf', step: 0.5, unit: 'cm' },
  { key: 'neck', label: 'Neck', hint: 'Below the larynx', step: 0.5, unit: 'cm' },
];

export function MeasureForm({ onDone }: { onDone: () => void }) {
  const { addMeasurement, state } = useAthlete();
  const d = useDivinity();
  const [m, setM] = useState<BodyMeasurements>({ ...d.latest, date: new Date().toISOString() });
  const [autoFat, setAutoFat] = useState(d.latest.bodyFat === undefined);
  const estimated = estimateBodyFat(m, state.profile.heightCm, state.profile.sex);

  const save = () => {
    const entry: BodyMeasurements = { ...m, date: new Date().toISOString() };
    if (autoFat) delete entry.bodyFat;
    addMeasurement(entry);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    onDone();
  };

  return (
    <Panel variant="gold">
      <Text style={styles.formTitle}>A new carving</Text>
      <Text style={[olympusText.small, { marginBottom: space.md }]}>Measure in the morning, relaxed, with a soft tape.</Text>
      {FIELDS.map((f) => (
        <Stepper
          key={f.key}
          label={f.label}
          hint={f.hint}
          unit={f.unit}
          step={f.step}
          value={m[f.key] as number}
          onChange={(v) => setM((prev) => ({ ...prev, [f.key]: v }))}
        />
      ))}
      <View style={{ marginTop: space.lg }}>
        <Text style={[olympusText.label, { marginBottom: 8 }]}>Body fat</Text>
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: space.sm }}>
          <Chip label={`Estimate (${estimated}%)`} active={autoFat} onPress={() => setAutoFat(true)} />
          <Chip label="I know mine" active={!autoFat} onPress={() => {
            setAutoFat(false);
            setM((prev) => ({ ...prev, bodyFat: prev.bodyFat ?? estimated }));
          }} />
        </View>
        {!autoFat && (
          <Stepper label="Body fat" unit="%" step={0.5} min={3} max={60} value={m.bodyFat ?? estimated} onChange={(v) => setM((prev) => ({ ...prev, bodyFat: v }))} />
        )}
      </View>
      <View style={{ flexDirection: 'row', gap: space.md, marginTop: space.xl }}>
        <GoldButton label="Cancel" variant="outline" onPress={onDone} style={{ flex: 1 }} />
        <GoldButton label="Carve" icon="hammer" onPress={save} style={{ flex: 1.4 }} />
      </View>
    </Panel>
  );
}

const styles = StyleSheet.create({
  rung: {
    width: 108,
    alignItems: 'center',
    paddingVertical: space.md,
    paddingHorizontal: space.sm,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: palette.hairline,
    backgroundColor: palette.surface,
  },
  rungReached: { borderColor: palette.border },
  rungSelected: { borderColor: palette.goldBright, backgroundColor: 'rgba(212,175,106,0.1)' },
  rungNumeral: { fontFamily: fonts.displaySemi, fontSize: 11, color: palette.gold, letterSpacing: 2, marginBottom: 6 },
  rungName: { fontFamily: fonts.display, fontSize: 13, color: palette.stone, marginTop: 8 },
  rungMeta: { fontFamily: fonts.sans, fontSize: 10, color: palette.stoneDim, marginTop: 2 },
  versusRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  versusCol: { alignItems: 'center', flex: 1 },
  versusName: { fontFamily: fonts.display, fontSize: 16, color: palette.ivory, marginTop: space.sm },
  versusMid: { position: 'absolute', left: 0, right: 0, top: '38%', alignItems: 'center' },
  versusPct: { fontFamily: fonts.display, fontSize: 22, color: palette.goldBright },
  versusLabel: { fontFamily: fonts.displaySemi, fontSize: 8, letterSpacing: 2, color: palette.gold },
  metric: { marginBottom: space.lg },
  metricHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 },
  metricLabel: { fontFamily: fonts.sansMedium, fontSize: 14, color: palette.ivory },
  metricValues: { fontFamily: fonts.sansSemi, fontSize: 14, color: palette.marble },
  metricUnit: { fontFamily: fonts.sans, fontSize: 11, color: palette.stone },
  metricDelta: { fontFamily: fonts.serifItalic, fontSize: 14, color: palette.stone, marginTop: 4 },
  evoHead: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: space.md },
  evoGain: { fontFamily: fonts.display, fontSize: 22, color: palette.goldBright, marginTop: 2 },
  timeline: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginTop: space.lg },
  formTitle: { fontFamily: fonts.display, fontSize: 20, color: palette.ivory },
});
