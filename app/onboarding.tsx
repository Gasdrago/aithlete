import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as Haptics from 'expo-haptics';

import { defaultMeasurements, useAthlete } from '@/contexts/AthleteContext';
import { GODDESSES, GODS } from '@/data/pantheon';
import {
  type BodyMeasurements,
  type Goal,
  type Level,
  type MeasureKey,
  type Sex,
  divinityOf,
  materialForTier,
  rankFor,
  resemblances,
  statueParamsFrom,
} from '@/utils/divinity';
import { fonts, palette, radius, space } from '@/styles/olympus';
import { AthleteStatue, DeityStatue } from '@/components/olympus/figures';
import { DivinityRing, Meander, Ornament, TempleFrame } from '@/components/olympus/ornaments';
import {
  Chip,
  DeityMedallion,
  Eyebrow,
  GoldButton,
  IconName,
  Panel,
  Screen,
  Stepper,
  olympusText,
  tap,
} from '@/components/olympus/ui';

const GOALS: { key: Goal; title: string; text: string; icon: IconName }[] = [
  { key: 'muscle', title: 'Build muscle', text: 'Broaden the shoulders, fill the frame', icon: 'arm-flex-outline' },
  { key: 'fat-loss', title: 'Lose fat', text: 'Reveal the marble beneath', icon: 'fire' },
  { key: 'endurance', title: 'Endurance', text: 'Run like Pheidippides', icon: 'run-fast' },
  { key: 'general', title: 'Balance', text: 'Harmony of body and mind', icon: 'scale-balance' },
];
const LEVELS: Level[] = ['Beginner', 'Intermediate', 'Advanced'];

const BODY_FIELDS: { key: MeasureKey; label: string; unit: string; hint?: string }[] = [
  { key: 'weight', label: 'Weight', unit: 'kg' },
  { key: 'shoulders', label: 'Shoulders', unit: 'cm', hint: 'Around the deltoids' },
  { key: 'chest', label: 'Chest', unit: 'cm' },
  { key: 'waist', label: 'Waist', unit: 'cm', hint: 'At the navel' },
  { key: 'hips', label: 'Hips', unit: 'cm' },
  { key: 'arm', label: 'Arm', unit: 'cm', hint: 'Flexed' },
  { key: 'thigh', label: 'Thigh', unit: 'cm' },
  { key: 'calf', label: 'Calf', unit: 'cm' },
  { key: 'neck', label: 'Neck', unit: 'cm' },
];

export default function OnboardingScreen() {
  const { completeOnboarding } = useAthlete();
  const { width } = useWindowDimensions();
  const contentW = Math.min(width, 640) - space.gutter * 2;

  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [sex, setSex] = useState<Sex>('male');
  const [goal, setGoal] = useState<Goal>('muscle');
  const [level, setLevel] = useState<Level>('Beginner');
  const [height, setHeight] = useState(178);
  const [body, setBody] = useState<BodyMeasurements>(() => defaultMeasurements('male'));

  const chooseSex = (s: Sex) => {
    setSex(s);
    setBody(defaultMeasurements(s));
    setHeight(s === 'female' ? 166 : 178);
  };

  const params = useMemo(() => statueParamsFrom(body, height, sex), [body, height, sex]);
  const reveal = useMemo(() => {
    const breakdown = divinityOf(body, height, sex, 0);
    const rank = rankFor(breakdown.score, sex);
    return {
      breakdown,
      rank,
      material: materialForTier(rank.current.tier, rank.ladder.length),
      closest: resemblances({ ...body }, height, sex)[0],
    };
  }, [body, height, sex]);

  const next = () => {
    tap();
    setStep((s) => s + 1);
  };
  const back = () => setStep((s) => Math.max(0, s - 1));

  const finish = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    completeOnboarding(
      { name: name.trim() || (sex === 'female' ? 'Heroine' : 'Hero'), sex, heightCm: height, goal, level },
      { ...body, date: new Date().toISOString() },
    );
    router.replace('/');
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Screen tabBar={false} glow={step === 0 ? 'center' : 'top'}>
        {step > 0 && (
          <View style={styles.topBar}>
            <Pressable onPress={back} hitSlop={12} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialCommunityIcons name="chevron-left" size={20} color={palette.gold} />
              <Text style={styles.backText}>Back</Text>
            </Pressable>
            <View style={styles.gems}>
              {[1, 2, 3, 4].map((i) => (
                <View key={i} style={[styles.gem, i <= step && styles.gemOn]} />
              ))}
            </View>
          </View>
        )}

        {step === 0 && (
          <View style={{ alignItems: 'center' }}>
            <Eyebrow center>ΑΙΘΛΗΤΗΣ</Eyebrow>
            <Text style={styles.brand}>AITHLETE</Text>
            <Meander width={Math.min(contentW, 280)} height={9} />
            <Text style={styles.tagline}>From mortal clay to Olympian gold.</Text>
            <View style={{ marginVertical: space.xl }}>
              <TempleFrame width={contentW} height={Math.min(contentW * 1.25, 460)}>
                <View style={styles.trio}>
                  <DeityStatue deity={GODS[0]} width={Math.min(contentW * 0.26, 110)} />
                  <DeityStatue deity={GODS[3]} width={Math.min(contentW * 0.36, 150)} halo />
                  <DeityStatue deity={GODS[7]} width={Math.min(contentW * 0.26, 110)} />
                </View>
              </TempleFrame>
            </View>
            <Text style={[olympusText.body, { textAlign: 'center', marginBottom: space.xl }]}>
              Your body becomes a statue. Every trial carves it. Measure yourself against Hermes, Apollo, Heracles and Zeus — and ascend.
            </Text>
            <GoldButton label="Begin the ascent" icon="stairs-up" onPress={next} style={{ alignSelf: 'stretch' }} />
          </View>
        )}

        {step === 1 && (
          <View>
            <StepTitle greek="Ι · ΟΝΟΜΑ" title="Who climbs Olympus?" text="Name yourself, and choose the pantheon you will be measured against." />
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor={palette.stoneDim}
              style={styles.input}
              maxLength={24}
              autoCapitalize="words"
              returnKeyType="done"
            />
            <View style={styles.pantheonRow}>
              {([
                ['male', 'The Gods', 'Hermes · Apollo · Zeus', GODS[3]],
                ['female', 'The Goddesses', 'Nike · Artemis · Hera', GODDESSES[3]],
              ] as const).map(([key, title, sub, deity]) => (
                <Panel key={key} style={[styles.pantheonCard, sex === key && styles.pantheonCardOn]} onPress={() => chooseSex(key)}>
                  <DeityMedallion deity={deity} size={96} />
                  <Text style={styles.pantheonTitle}>{title}</Text>
                  <Text style={[olympusText.small, { textAlign: 'center' }]}>{sub}</Text>
                  {sex === key && <MaterialCommunityIcons name="check-circle" size={20} color={palette.goldBright} style={{ marginTop: 6 }} />}
                </Panel>
              ))}
            </View>
            <GoldButton label="Continue" onPress={next} style={{ marginTop: space.xxl }} />
          </View>
        )}

        {step === 2 && (
          <View>
            <StepTitle greek="ΙΙ · ΤΕΛΟΣ" title="What is your aim?" text="The Fates will shape your trials around it." />
            {GOALS.map((g) => (
              <Pressable
                key={g.key}
                onPress={() => {
                  tap();
                  setGoal(g.key);
                }}
                style={[styles.goal, goal === g.key && styles.goalOn]}
              >
                <View style={[styles.goalIcon, goal === g.key && { backgroundColor: palette.gold }]}>
                  <MaterialCommunityIcons name={g.icon} size={20} color={goal === g.key ? '#1A1206' : palette.goldBright} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.goalTitle}>{g.title}</Text>
                  <Text style={olympusText.small}>{g.text}</Text>
                </View>
              </Pressable>
            ))}
            <Text style={[olympusText.label, { marginTop: space.xl, marginBottom: space.sm }]}>Experience</Text>
            <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
              {LEVELS.map((l) => (
                <Chip key={l} label={l} active={level === l} onPress={() => setLevel(l)} />
              ))}
            </View>
            <GoldButton label="Continue" onPress={next} style={{ marginTop: space.xxl }} />
          </View>
        )}

        {step === 3 && (
          <View>
            <StepTitle greek="ΙΙΙ · ΜΕΤΡΟΝ" title="Carve your statue" text="Enter your measurements. The marble follows your numbers." />
            <View style={{ alignItems: 'center', marginBottom: space.lg }}>
              <AthleteStatue params={params} sex={sex} tier={0} material="clay" width={Math.min(contentW * 0.42, 170)} />
            </View>
            <Panel>
              <Stepper label="Height" unit="cm" step={1} min={130} max={230} value={height} onChange={setHeight} />
              {BODY_FIELDS.map((f) => (
                <Stepper
                  key={f.key}
                  label={f.label}
                  hint={f.hint}
                  unit={f.unit}
                  step={f.key === 'weight' ? 1 : 0.5}
                  value={body[f.key] as number}
                  onChange={(v) => setBody((b) => ({ ...b, [f.key]: v }))}
                />
              ))}
              <Text style={[olympusText.small, { marginTop: space.md }]}>
                No tape at hand? Keep the defaults and refine later from Ascension.
              </Text>
            </Panel>
            <GoldButton label="Reveal my statue" icon="hammer" onPress={next} style={{ marginTop: space.xl }} />
          </View>
        )}

        {step === 4 && (
          <View style={{ alignItems: 'center' }}>
            <StepTitle greek="IV · ΑΠΟΚΑΛΥΨΙΣ" title="Your statue is carved" text="This is where your legend begins." center />
            <TempleFrame width={contentW} height={Math.min(contentW * 1.15, 430)}>
              <AthleteStatue params={params} sex={sex} tier={reveal.rank.current.tier} material={reveal.material} width={Math.min(contentW * 0.42, 180)} halo />
            </TempleFrame>
            <Text style={styles.revealRank}>{reveal.rank.current.tier === 0 ? 'Mortal' : reveal.rank.current.name}</Text>
            <Text style={olympusText.bodyItalic}>{reveal.rank.current.epithet}</Text>
            <Ornament width={160} style={{ marginVertical: space.xl }} />
            <View style={styles.revealRow}>
              <DivinityRing size={112} progress={reveal.breakdown.score / 100}>
                <Text style={styles.revealScore}>{Math.round(reveal.breakdown.score)}</Text>
                <Text style={styles.revealLabel}>DIVINITY</Text>
              </DivinityRing>
              <View style={{ flex: 1 }}>
                <Text style={olympusText.label}>Closest likeness</Text>
                <Text style={styles.revealGod}>{reveal.closest.deity.name}</Text>
                <Text style={olympusText.small}>{Math.round(reveal.closest.similarity * 100)}% resemblance</Text>
                {reveal.rank.next && (
                  <Text style={[olympusText.small, { marginTop: 6 }]}>
                    {reveal.rank.pointsToNext} points to ascend to {reveal.rank.next.name}
                  </Text>
                )}
              </View>
            </View>
            <GoldButton label="Enter Olympus" icon="pillar" onPress={finish} style={{ alignSelf: 'stretch', marginTop: space.xxl }} />
          </View>
        )}
      </Screen>
    </KeyboardAvoidingView>
  );
}

function StepTitle({ greek, title, text, center }: { greek: string; title: string; text: string; center?: boolean }) {
  return (
    <View style={{ marginBottom: space.xl, alignItems: center ? 'center' : 'flex-start' }}>
      <Eyebrow center={center}>{greek}</Eyebrow>
      <Text style={[styles.stepTitle, center && { textAlign: 'center' }]}>{title}</Text>
      <Text style={[olympusText.bodyItalic, center && { textAlign: 'center' }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: space.xl },
  backText: { fontFamily: fonts.displaySemi, fontSize: 12, letterSpacing: 2, color: palette.gold, textTransform: 'uppercase' },
  gems: { flexDirection: 'row', gap: 8 },
  gem: { width: 8, height: 8, transform: [{ rotate: '45deg' }], borderWidth: 1, borderColor: palette.gold },
  gemOn: { backgroundColor: palette.gold },
  brand: { fontFamily: fonts.displayBlack, fontSize: 46, letterSpacing: 8, color: palette.goldBright, marginBottom: space.md },
  tagline: { fontFamily: fonts.serifItalic, fontSize: 20, color: palette.marble, marginTop: space.md },
  trio: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: 4 },
  stepTitle: { fontFamily: fonts.display, fontSize: 28, lineHeight: 34, color: palette.ivory, marginBottom: 4 },
  input: {
    height: 56,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
    paddingHorizontal: space.lg,
    color: palette.ivory,
    fontFamily: fonts.display,
    fontSize: 20,
    letterSpacing: 1,
    marginBottom: space.xl,
  },
  pantheonRow: { flexDirection: 'row', gap: space.md },
  pantheonCard: { flex: 1, alignItems: 'center', padding: space.lg, gap: 6 },
  pantheonCardOn: { borderColor: palette.goldBright, backgroundColor: 'rgba(212,175,106,0.1)' },
  pantheonTitle: { fontFamily: fonts.display, fontSize: 16, color: palette.ivory, marginTop: space.sm },
  goal: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.lg,
    padding: space.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: palette.hairline,
    backgroundColor: palette.surface,
    marginBottom: space.sm,
  },
  goalOn: { borderColor: palette.goldBright, backgroundColor: 'rgba(212,175,106,0.08)' },
  goalIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: palette.border,
  },
  goalTitle: { fontFamily: fonts.display, fontSize: 16, color: palette.ivory, marginBottom: 2 },
  revealRank: { fontFamily: fonts.displayBlack, fontSize: 32, letterSpacing: 3, color: palette.goldBright, marginTop: space.lg },
  revealRow: { flexDirection: 'row', alignItems: 'center', gap: space.xl, alignSelf: 'stretch' },
  revealScore: { fontFamily: fonts.display, fontSize: 32, color: palette.ivory },
  revealLabel: { fontFamily: fonts.displaySemi, fontSize: 8, letterSpacing: 2, color: palette.gold },
  revealGod: { fontFamily: fonts.display, fontSize: 24, color: palette.goldBright, marginVertical: 2 },
});
