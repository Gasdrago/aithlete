import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as Haptics from 'expo-haptics';

import { useAthlete, useDivinity } from '@/contexts/AthleteContext';
import { findDeity, GODS } from '@/data/pantheon';
import { TRIALS, patronIdFor, type Trial } from '@/data/trials';
import { estimateCalories, type Goal, type Level } from '@/utils/divinity';
import { generateWorkoutPlan } from '@/utils/workoutGenerator';
import { fonts, palette, space } from '@/styles/olympus';
import { Laurel, Ornament } from '@/components/olympus/ornaments';
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
  tap,
} from '@/components/olympus/ui';

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

const GOAL_LABEL: Record<Goal, string> = {
  muscle: 'Muscle gain',
  'fat-loss': 'Fat loss',
  endurance: 'Endurance',
  general: 'General fitness',
};
const EQUIPMENT = ['Bodyweight', 'Dumbbells', 'Barbell', 'All'];

export default function TrialsScreen() {
  const params = useLocalSearchParams<{ trial?: string }>();
  const { state } = useAthlete();
  const [activeId, setActiveId] = useState<string | null>(params.trial ?? null);
  const [custom, setCustom] = useState<Trial | null>(null);

  useEffect(() => {
    if (params.trial) setActiveId(params.trial);
  }, [params.trial]);

  const active = activeId === 'oracle-custom' ? custom : TRIALS.find((t) => t.id === activeId) ?? null;

  if (active) {
    return (
      <TrialSession
        key={active.id}
        trial={active}
        onClose={() => {
          setActiveId(null);
          router.setParams({ trial: undefined });
        }}
      />
    );
  }

  return (
    <Screen>
      <ScreenHeader greek="ΑΘΛΟΙ · THE TRIALS" title="The Trials" subtitle="Each labor carves you closer to Olympus." />

      {TRIALS.map((t) => (
        <TrialCard key={t.id} trial={t} onPress={() => setActiveId(t.id)} />
      ))}

      <OracleForge
        initialGoal={state.profile.goal}
        initialLevel={state.profile.level}
        onForged={(t) => {
          setCustom(t);
          setActiveId('oracle-custom');
        }}
      />
    </Screen>
  );
}

function TrialCard({ trial, onPress }: { trial: Trial; onPress: () => void }) {
  const { state } = useAthlete();
  const patron = findDeity(patronIdFor(trial, state.profile.sex)) ?? GODS[1];
  return (
    <Panel style={styles.card} onPress={onPress}>
      <View style={styles.cardRow}>
        <DeityMedallion deity={patron} size={72} />
        <View style={{ flex: 1 }}>
          <Text style={olympusText.greek}>{trial.focus.toUpperCase()}</Text>
          <Text style={styles.cardTitle}>{trial.title}</Text>
          <Text style={olympusText.small}>Patron · {trial.patron}</Text>
          <View style={styles.tags}>
            <Tag icon="timer-sand" text={`${trial.durationMin} min`} />
            <Tag icon="sword" text={trial.difficulty} />
          </View>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={22} color={palette.gold} />
      </View>
    </Panel>
  );
}

function Tag({ icon, text }: { icon: keyof typeof MaterialCommunityIcons.glyphMap; text: string }) {
  return (
    <View style={styles.tag}>
      <MaterialCommunityIcons name={icon} size={12} color={palette.gold} />
      <Text style={styles.tagText}>{text}</Text>
    </View>
  );
}

function OracleForge({
  initialGoal,
  initialLevel,
  onForged,
}: {
  initialGoal: Goal;
  initialLevel: Level;
  onForged: (t: Trial) => void;
}) {
  const [goal, setGoal] = useState<Goal>(initialGoal);
  const [level, setLevel] = useState<Level>(initialLevel);
  const [equipment, setEquipment] = useState('Bodyweight');
  const [forging, setForging] = useState(false);

  const forge = () => {
    setForging(true);
    setTimeout(() => {
      const plan = generateWorkoutPlan({ goal: GOAL_LABEL[goal], experience: level, equipment });
      setForging(false);
      onForged({
        id: 'oracle-custom',
        title: `The Oracle’s ${plan.name}`,
        patronId: 'apollo',
        patronIdFemale: 'artemis',
        patron: 'Apollo of Delphi',
        focus: GOAL_LABEL[goal],
        builds: GOAL_LABEL[goal],
        durationMin: parseInt(plan.duration, 10) || 40,
        difficulty: level,
        intensity: goal === 'fat-loss' || goal === 'endurance' ? 'high' : 'medium',
        description: `Forged for you at Delphi — ${equipment.toLowerCase()} only, tuned for ${GOAL_LABEL[goal].toLowerCase()}.`,
        exercises: plan.exercises.map((e) => ({ name: e.name, sets: e.sets, reps: e.reps, rest: e.rest, cue: e.exercise?.description })),
      });
    }, 900);
  };

  return (
    <>
      <SectionTitle>Consult the oracle</SectionTitle>
      <Panel variant="gold">
        <Text style={styles.forgeTitle}>Forge a custom trial</Text>
        <Text style={[olympusText.bodyItalic, { marginBottom: space.lg }]}>
          Tell the Pythia your aim; she will answer with a labor made for you.
        </Text>
        <Text style={styles.forgeLabel}>Aim</Text>
        <View style={styles.chips}>
          {(Object.keys(GOAL_LABEL) as Goal[]).map((g) => (
            <Chip key={g} label={GOAL_LABEL[g]} active={goal === g} onPress={() => setGoal(g)} />
          ))}
        </View>
        <Text style={styles.forgeLabel}>Experience</Text>
        <View style={styles.chips}>
          {(['Beginner', 'Intermediate', 'Advanced'] as Level[]).map((l) => (
            <Chip key={l} label={l} active={level === l} onPress={() => setLevel(l)} />
          ))}
        </View>
        <Text style={styles.forgeLabel}>Arsenal</Text>
        <View style={styles.chips}>
          {EQUIPMENT.map((e) => (
            <Chip key={e} label={e} active={equipment === e} onPress={() => setEquipment(e)} />
          ))}
        </View>
        <GoldButton label={forging ? 'The oracle speaks…' : 'Reveal my trial'} icon="crystal-ball" loading={forging} onPress={forge} style={{ marginTop: space.lg }} />
      </Panel>
    </>
  );
}

function TrialSession({ trial, onClose }: { trial: Trial; onClose: () => void }) {
  const { logWorkout } = useAthlete();
  const d = useDivinity();
  const patron = findDeity(patronIdFor(trial, d.profile.sex)) ?? GODS[1];
  const [done, setDone] = useState<boolean[]>(() => trial.exercises.map(() => false));
  const [victory, setVictory] = useState<{ calories: number; minutes: number } | null>(null);
  const count = done.filter(Boolean).length;
  const fraction = count / trial.exercises.length;

  const totalSets = useMemo(() => trial.exercises.reduce((a, e) => a + e.sets, 0), [trial]);

  const complete = () => {
    const minutes = Math.max(5, Math.round(trial.durationMin * fraction));
    const calories = estimateCalories(minutes, trial.intensity, d.latest.weight);
    logWorkout({ trialId: trial.id, name: trial.title, durationMin: minutes, calories });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    setVictory({ calories, minutes });
  };

  if (victory) {
    return (
      <Screen glow="center">
        <View style={styles.victory}>
          <View style={styles.victoryLaurel}>
            <Laurel size={240} />
            <View style={styles.victoryCenter}>
              <Text style={olympusText.greek}>ΝΙΚΗ</Text>
              <Text style={styles.victoryTitle}>Victory</Text>
            </View>
          </View>
          <Text style={[olympusText.bodyItalic, { textAlign: 'center', fontSize: 19 }]}>
            {trial.title} is complete. {patron.name} nods from Olympus.
          </Text>
          <Ornament width={160} style={{ marginVertical: space.xl }} />
          <View style={styles.victoryStats}>
            <VictoryStat value={`${victory.minutes}`} label="minutes" />
            <VictoryStat value={`${victory.calories}`} label="kcal ambrosia" />
            <VictoryStat value={`${d.stats.streak}`} label="day streak" />
          </View>
          <Text style={[olympusText.small, { textAlign: 'center', marginTop: space.lg }]}>
            Your devotion feeds your divinity score. Keep the streak alive.
          </Text>
          <GoldButton label="Return to Olympus" icon="pillar" onPress={() => router.navigate('/')} style={{ marginTop: space.xxl, alignSelf: 'stretch' }} />
          <GoldButton label="More trials" variant="ghost" onPress={onClose} style={{ marginTop: space.sm }} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <Pressable onPress={onClose} style={styles.back} hitSlop={10}>
        <MaterialCommunityIcons name="chevron-left" size={20} color={palette.gold} />
        <Text style={styles.backText}>All trials</Text>
      </Pressable>

      <Panel variant="gold" style={{ alignItems: 'center' }}>
        <DeityMedallion deity={patron} size={120} />
        <Text style={[olympusText.greek, { marginTop: space.lg }]}>{patron.greek} · {trial.focus.toUpperCase()}</Text>
        <Text style={styles.sessionTitle}>{trial.title}</Text>
        <Text style={[olympusText.bodyItalic, { textAlign: 'center' }]}>{trial.description}</Text>
        <View style={[styles.tags, { justifyContent: 'center', marginTop: space.lg }]}>
          <Tag icon="timer-sand" text={`${trial.durationMin} min`} />
          <Tag icon="sword" text={trial.difficulty} />
          <Tag icon="layers-triple-outline" text={`${totalSets} sets`} />
        </View>
      </Panel>

      <SectionTitle>The labors</SectionTitle>
      {trial.exercises.map((e, i) => (
        <Pressable
          key={`${e.name}-${i}`}
          onPress={() => {
            tap();
            setDone((prev) => prev.map((v, j) => (j === i ? !v : v)));
          }}
          style={[styles.exercise, done[i] && styles.exerciseDone]}
        >
          <View style={[styles.numeral, done[i] && styles.numeralDone]}>
            <Text style={[styles.numeralText, done[i] && { color: '#1A1206' }]}>{ROMAN[i] ?? i + 1}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.exName, done[i] && styles.exNameDone]}>{e.name}</Text>
            <Text style={styles.exMeta}>
              {e.sets} × {e.reps} · rest {e.rest}
            </Text>
            {e.cue ? <Text style={styles.exCue}>{e.cue}</Text> : null}
          </View>
          <MaterialCommunityIcons
            name={done[i] ? 'check-circle' : 'checkbox-blank-circle-outline'}
            size={24}
            color={done[i] ? palette.goldBright : palette.stoneDim}
          />
        </Pressable>
      ))}

      <View style={{ marginTop: space.xl }}>
        <View style={styles.progressHead}>
          <Text style={olympusText.label}>Progress</Text>
          <Text style={styles.progressValue}>
            {count}/{trial.exercises.length}
          </Text>
        </View>
        <GoldBar progress={fraction} />
      </View>

      <GoldButton
        label={count === 0 ? 'Mark your labors' : 'Complete the trial'}
        icon="trophy-outline"
        disabled={count === 0}
        onPress={complete}
        style={{ marginTop: space.xl }}
      />
    </Screen>
  );
}

function VictoryStat({ value, label }: { value: string; label: string }) {
  return (
    <View style={{ alignItems: 'center', flex: 1 }}>
      <Text style={styles.victoryValue}>{value}</Text>
      <Text style={olympusText.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: space.md, padding: space.lg },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: space.lg },
  cardTitle: { fontFamily: fonts.display, fontSize: 18, color: palette.ivory, marginTop: 3, marginBottom: 2 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: palette.border,
  },
  tagText: { fontFamily: fonts.sansMedium, fontSize: 11, color: palette.marble },
  forgeTitle: { fontFamily: fonts.display, fontSize: 20, color: palette.ivory },
  forgeLabel: { ...olympusText.label, marginBottom: 8, marginTop: 4 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: space.md },
  back: { flexDirection: 'row', alignItems: 'center', gap: 2, marginBottom: space.lg },
  backText: { fontFamily: fonts.displaySemi, fontSize: 12, letterSpacing: 2, color: palette.gold, textTransform: 'uppercase' },
  sessionTitle: { fontFamily: fonts.display, fontSize: 26, color: palette.ivory, textAlign: 'center', marginVertical: 6 },
  exercise: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    padding: space.lg,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: palette.hairline,
    backgroundColor: palette.surface,
    marginBottom: space.sm,
  },
  exerciseDone: { borderColor: palette.borderStrong, backgroundColor: 'rgba(212,175,106,0.07)' },
  numeral: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numeralDone: { backgroundColor: palette.gold, borderColor: palette.gold },
  numeralText: { fontFamily: fonts.displaySemi, fontSize: 12, color: palette.goldBright },
  exName: { fontFamily: fonts.sansSemi, fontSize: 15, color: palette.ivory },
  exNameDone: { color: palette.goldBright },
  exMeta: { fontFamily: fonts.sans, fontSize: 12, color: palette.stone, marginTop: 2 },
  exCue: { fontFamily: fonts.serifItalic, fontSize: 14, color: palette.stoneDim, marginTop: 4 },
  progressHead: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressValue: { fontFamily: fonts.sansSemi, fontSize: 12, color: palette.goldBright },
  victory: { alignItems: 'center', paddingTop: space.huge },
  victoryLaurel: { width: 240, height: 240, alignItems: 'center', justifyContent: 'center', marginBottom: space.xl },
  victoryCenter: { position: 'absolute', alignItems: 'center' },
  victoryTitle: { fontFamily: fonts.displayBlack, fontSize: 24, letterSpacing: 3, color: palette.goldBright, marginTop: 4 },
  victoryStats: { flexDirection: 'row', alignSelf: 'stretch' },
  victoryValue: { fontFamily: fonts.display, fontSize: 28, color: palette.ivory },
});
