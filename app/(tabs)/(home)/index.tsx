import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { useDivinity } from '@/contexts/AthleteContext';
import { ORACLE_SAYINGS } from '@/data/pantheon';
import { TRIALS, trialById } from '@/data/trials';
import { fonts, palette, space } from '@/styles/olympus';
import { AthleteStatue } from '@/components/olympus/figures';
import { DivinityRing, Laurel, Ornament, TempleFrame } from '@/components/olympus/ornaments';
import {
  DeityMedallion,
  Eyebrow,
  GoldBar,
  GoldButton,
  IconName,
  Panel,
  Screen,
  SectionTitle,
  Tablet,
  olympusText,
} from '@/components/olympus/ui';

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];

export default function OlympusScreen() {
  const d = useDivinity();
  const { width } = useWindowDimensions();
  const contentW = Math.min(width, 640) - space.gutter * 2;
  const { profile, rank, breakdown, closest, stats } = d;

  const saying = useMemo(() => ORACLE_SAYINGS[new Date().getDate() % ORACLE_SAYINGS.length], []);

  const trial = useMemo(() => {
    if (stats.trials < 3 || profile.level === 'Beginner') return trialById('hero-path')!;
    const byGoal: Record<string, string> = {
      muscle: rank.next?.trialId ?? 'twelve-labors',
      'fat-loss': 'winged-sandals',
      endurance: 'hunt-of-artemis',
      general: 'aegis-of-athena',
    };
    return trialById(byGoal[profile.goal]) ?? TRIALS[0];
  }, [stats.trials, profile.level, profile.goal, rank.next]);

  const pillars: { label: string; value: number; icon: IconName }[] = [
    { label: 'Might', value: breakdown.muscle, icon: 'arm-flex-outline' },
    { label: 'Leanness', value: breakdown.leanness, icon: 'water-outline' },
    { label: 'Harmony', value: breakdown.proportion, icon: 'triangle-outline' },
    { label: 'Devotion', value: breakdown.discipline, icon: 'fire' },
  ];

  const statueW = Math.min(contentW * 0.5, 210);
  const templeH = statueW * 1.95;

  return (
    <Screen>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Eyebrow>ΑΘΛΗΤΗΣ · AITHLETE</Eyebrow>
          <Text style={styles.hail}>Hail, {profile.name}</Text>
          <Text style={olympusText.bodyItalic}>The gods are watching your ascension.</Text>
        </View>
        <Pressable onPress={() => router.push('/profile')} style={styles.avatar} accessibilityLabel="Open profile">
          <View style={StyleSheet.absoluteFill}>
            <Laurel size={58} opacity={0.9} leaves={8} />
          </View>
          <Text style={styles.avatarLetter}>{profile.name.charAt(0).toUpperCase()}</Text>
        </Pressable>
      </View>

      {/* Temple hero */}
      <Panel variant="gold" style={styles.hero}>
        <View style={{ alignItems: 'center' }}>
          <TempleFrame width={contentW - 2} height={templeH}>
            <AthleteStatue
              params={d.statue}
              sex={profile.sex}
              tier={rank.current.tier}
              material={d.material}
              width={statueW}
              halo={rank.current.tier >= 2}
            />
          </TempleFrame>
        </View>
        <View style={styles.rankCaption}>
          <Text style={olympusText.greek}>{rank.current.greek}</Text>
          <Text style={styles.rankName}>
            {rank.current.tier === 0 ? 'Mortal' : rank.current.name}
          </Text>
          <Text style={styles.rankEpithet}>
            Rank {ROMAN[rank.current.tier]} of {ROMAN[rank.ladder.length - 1]} · {rank.current.epithet}
          </Text>
        </View>

        <Ornament width={180} style={{ marginVertical: space.lg }} />

        <View style={styles.scoreRow}>
          <DivinityRing size={128} progress={breakdown.score / 100}>
            <Text style={styles.scoreValue}>{Math.round(breakdown.score)}</Text>
            <Text style={styles.scoreLabel}>DIVINITY</Text>
          </DivinityRing>
          <View style={{ flex: 1, gap: 10 }}>
            {pillars.map((p) => (
              <View key={p.label}>
                <View style={styles.pillarHead}>
                  <MaterialCommunityIcons name={p.icon} size={13} color={palette.gold} />
                  <Text style={styles.pillarLabel}>{p.label}</Text>
                  <Text style={styles.pillarValue}>{Math.round(p.value * 100)}</Text>
                </View>
                <GoldBar progress={p.value} height={4} />
              </View>
            ))}
          </View>
        </View>

        {rank.next ? (
          <View style={styles.nextBox}>
            <View style={{ flex: 1 }}>
              <Text style={olympusText.label}>Next ascension</Text>
              <Text style={styles.nextName}>
                {rank.next.name} <Text style={styles.nextEpithet}>· {rank.next.epithet}</Text>
              </Text>
              <GoldBar progress={rank.progress} style={{ marginTop: 8 }} />
            </View>
            <View style={styles.pointsBadge}>
              <Text style={styles.pointsValue}>{rank.pointsToNext}</Text>
              <Text style={styles.pointsLabel}>pts</Text>
            </View>
          </View>
        ) : (
          <Text style={[olympusText.bodyItalic, { textAlign: 'center', marginTop: space.md }]}>
            You stand at the summit of Olympus. Hold your throne.
          </Text>
        )}
      </Panel>

      {/* Likeness */}
      <SectionTitle action="Compare" onAction={() => router.push({ pathname: '/ascension', params: { god: closest.deity.id } })}>
        Divine likeness
      </SectionTitle>
      <Panel onPress={() => router.push({ pathname: '/ascension', params: { god: closest.deity.id } })}>
        <View style={styles.likeRow}>
          <DeityMedallion deity={closest.deity} size={96} />
          <View style={{ flex: 1 }}>
            <Text style={olympusText.label}>Your physique echoes</Text>
            <Text style={styles.likeName}>{closest.deity.name}</Text>
            <Text style={styles.likePct}>
              {Math.round(closest.similarity * 100)}% <Text style={olympusText.small}>resemblance · {closest.deity.virtue}</Text>
            </Text>
            <GoldBar progress={closest.similarity} height={4} style={{ marginTop: 8 }} />
          </View>
        </View>
      </Panel>

      {/* Today */}
      <SectionTitle action="All trials" onAction={() => router.push('/trials')}>
        Today’s trial
      </SectionTitle>
      <Panel>
        <Text style={olympusText.greek}>UNDER THE GAZE OF {trial.patron.toUpperCase()}</Text>
        <Text style={styles.trialTitle}>{trial.title}</Text>
        <Text style={[olympusText.bodyItalic, { marginTop: 4 }]}>{trial.description}</Text>
        <View style={styles.metaRow}>
          <Meta icon="timer-sand" text={`${trial.durationMin} min`} />
          <Meta icon="sword" text={trial.difficulty} />
          <Meta icon="arm-flex-outline" text={trial.builds} />
        </View>
        <GoldButton label="Begin the trial" icon="fire" onPress={() => router.push({ pathname: '/trials', params: { trial: trial.id } })} />
      </Panel>

      {/* Chronicle */}
      <SectionTitle>Chronicle</SectionTitle>
      <View style={styles.tablets}>
        <Tablet value={stats.trials} label="Trials" icon="sword-cross" />
        <Tablet value={stats.streak} label="Day streak" icon="fire" />
        <Tablet value={stats.calories > 9999 ? `${Math.round(stats.calories / 1000)}k` : stats.calories} label="Ambrosia kcal" icon="flask-outline" />
      </View>

      {/* Sanctuaries */}
      <SectionTitle>Sanctuaries</SectionTitle>
      <View style={styles.portals}>
        <Portal icon="crystal-ball" title="Prophecy" text="See the body the Fates have woven for you" onPress={() => router.push('/prophecy')} />
        <Portal icon="eye-outline" title="Oracle" text="Let Delphi judge your posture" onPress={() => router.push('/oracle')} />
      </View>

      {/* Saying */}
      <View style={styles.saying}>
        <Ornament width={120} />
        <Text style={styles.sayingText}>“{saying.text}”</Text>
        <Text style={olympusText.greek}>— {saying.author.toUpperCase()}</Text>
      </View>
    </Screen>
  );
}

function Meta({ icon, text }: { icon: IconName; text: string }) {
  return (
    <View style={styles.meta}>
      <MaterialCommunityIcons name={icon} size={13} color={palette.gold} />
      <Text style={styles.metaText}>{text}</Text>
    </View>
  );
}

function Portal({ icon, title, text, onPress }: { icon: IconName; title: string; text: string; onPress: () => void }) {
  return (
    <Panel style={{ flex: 1, padding: space.lg }} onPress={onPress}>
      <View style={styles.portalIcon}>
        <MaterialCommunityIcons name={icon} size={22} color={palette.goldBright} />
      </View>
      <Text style={styles.portalTitle}>{title}</Text>
      <Text style={olympusText.small}>{text}</Text>
    </Panel>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: space.xl, gap: space.md },
  hail: { fontFamily: fonts.display, fontSize: 28, letterSpacing: 1, color: palette.ivory, marginBottom: 2 },
  avatar: { width: 58, height: 58, alignItems: 'center', justifyContent: 'center' },
  avatarLetter: { fontFamily: fonts.display, fontSize: 20, color: palette.goldBright, marginTop: -2 },
  hero: { paddingHorizontal: 0, paddingTop: space.lg, paddingBottom: space.xl },
  rankCaption: { alignItems: 'center', marginTop: space.md, paddingHorizontal: space.xl },
  rankName: { fontFamily: fonts.displayBlack, fontSize: 30, letterSpacing: 3, color: palette.goldBright, marginTop: 4 },
  rankEpithet: { fontFamily: fonts.serifItalic, fontSize: 16, color: palette.stone, marginTop: 2 },
  scoreRow: { flexDirection: 'row', alignItems: 'center', gap: space.xl, paddingHorizontal: space.xl },
  scoreValue: { fontFamily: fonts.display, fontSize: 38, color: palette.ivory },
  scoreLabel: { fontFamily: fonts.displaySemi, fontSize: 8, letterSpacing: 2.5, color: palette.gold, marginTop: -2 },
  pillarHead: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  pillarLabel: { flex: 1, fontFamily: fonts.sansMedium, fontSize: 12, color: palette.marble },
  pillarValue: { fontFamily: fonts.sansSemi, fontSize: 12, color: palette.goldBright },
  nextBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.lg,
    marginTop: space.xl,
    marginHorizontal: space.xl,
    padding: space.lg,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: palette.border,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  nextName: { fontFamily: fonts.display, fontSize: 18, color: palette.ivory, marginTop: 4 },
  nextEpithet: { fontFamily: fonts.serifItalic, fontSize: 15, color: palette.stone },
  pointsBadge: { alignItems: 'center' },
  pointsValue: { fontFamily: fonts.display, fontSize: 26, color: palette.goldBright },
  pointsLabel: { fontFamily: fonts.sansMedium, fontSize: 10, color: palette.stone, letterSpacing: 1 },
  likeRow: { flexDirection: 'row', alignItems: 'center', gap: space.lg },
  likeName: { fontFamily: fonts.display, fontSize: 24, color: palette.goldBright, marginTop: 2 },
  likePct: { fontFamily: fonts.sansSemi, fontSize: 16, color: palette.ivory, marginTop: 2 },
  trialTitle: { fontFamily: fonts.display, fontSize: 22, color: palette.ivory, marginTop: 6 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: space.lg, marginBottom: space.lg },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: palette.border,
  },
  metaText: { fontFamily: fonts.sansMedium, fontSize: 11, color: palette.marble },
  tablets: { flexDirection: 'row', gap: space.md },
  portals: { flexDirection: 'row', gap: space.md },
  portalIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.surfaceGold,
    marginBottom: space.md,
  },
  portalTitle: { fontFamily: fonts.display, fontSize: 16, letterSpacing: 1, color: palette.ivory, marginBottom: 4 },
  saying: { alignItems: 'center', marginTop: space.huge, gap: space.md, paddingHorizontal: space.lg },
  sayingText: { fontFamily: fonts.serifItalic, fontSize: 21, lineHeight: 28, color: palette.marble, textAlign: 'center' },
});
