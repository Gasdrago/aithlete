import React, { useState } from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Svg, { Path } from 'react-native-svg';
import * as Haptics from 'expo-haptics';

import { useAthlete, useDivinity } from '@/contexts/AthleteContext';
import { fonts, palette, space } from '@/styles/olympus';
import { DivinityRing, Ornament } from '@/components/olympus/ornaments';
import { GoldButton, Panel, Screen, ScreenHeader, SectionTitle, olympusText } from '@/components/olympus/ui';

/** The Pythia's counsel, by posture score. */
function prophecyFor(score: number): { verdict: string; advice: string[] } {
  if (score >= 90) {
    return {
      verdict: 'Your bearing is worthy of a temple frieze.',
      advice: [
        'Hold this alignment through every repetition.',
        'Breathe low into the belly to keep the torso stable.',
        'Keep the core braced as if wearing bronze armour.',
      ],
    };
  }
  if (score >= 80) {
    return {
      verdict: 'A noble stance, with a few flaws in the marble.',
      advice: [
        'Draw the shoulder blades down and back.',
        'Engage the core more actively.',
        'Track the knees over the second toe.',
      ],
    };
  }
  if (score >= 70) {
    return {
      verdict: 'The Oracle sees a statue still being carved.',
      advice: [
        'Lift the chest and stop the shoulders from rounding.',
        'Keep the spine long and neutral — crown to the sky.',
        'Spread your weight evenly through both feet.',
      ],
    };
  }
  return {
    verdict: 'The omens are troubled. Reset your stance.',
    advice: [
      'Return to a neutral stance before continuing.',
      'Stack ribs over pelvis; tuck the chin slightly.',
      'Review the form of each movement slowly.',
    ],
  };
}

export default function OracleScreen() {
  const { logPosture } = useAthlete();
  const d = useDivinity();
  const { width } = useWindowDimensions();
  const contentW = Math.min(width, 640) - space.gutter * 2;
  const [facing, setFacing] = useState<CameraType>('front');
  const [permission, requestPermission] = useCameraPermissions();
  const [analyzing, setAnalyzing] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const analyze = () => {
    setAnalyzing(true);
    // Placeholder for on-device pose estimation (MoveNet / MediaPipe).
    setTimeout(() => {
      const s = Math.floor(Math.random() * 30) + 70;
      setScore(s);
      logPosture(s);
      setAnalyzing(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }, 1800);
  };

  const archW = contentW - 2;
  const archH = archW * 1.25;
  const prophecy = score !== null ? prophecyFor(score) : null;

  return (
    <Screen>
      <ScreenHeader greek="ΔΕΛΦΟΙ · DELPHI" title="The Oracle" subtitle="Stand before the Pythia. She sees how you carry yourself." />

      <Panel variant="gold" style={{ padding: 0 }} corners={false}>
        <View style={{ width: archW, height: archH, overflow: 'hidden', borderRadius: 20 }}>
          {permission?.granted ? (
            <CameraView style={StyleSheet.absoluteFill} facing={facing} />
          ) : (
            <View style={styles.veil}>
              <MaterialCommunityIcons name="eye-outline" size={48} color={palette.gold} />
              <Text style={styles.veilTitle}>The Oracle’s eye is closed</Text>
              <Text style={[olympusText.small, { textAlign: 'center', marginBottom: space.lg }]}>
                Allow the camera so the Pythia can read your stance. Nothing leaves your device.
              </Text>
              <GoldButton label="Open the eye" icon="camera-outline" onPress={requestPermission} />
            </View>
          )}
          {/* golden arch and figure guide */}
          <Svg width={archW} height={archH} style={StyleSheet.absoluteFill} pointerEvents="none">
            <Path
              d={`M${archW * 0.12},${archH * 0.96} L${archW * 0.12},${archH * 0.32} A${archW * 0.38},${archW * 0.38} 0 0 1 ${archW * 0.88},${archH * 0.32} L${archW * 0.88},${archH * 0.96}`}
              stroke={score !== null && score < 80 ? palette.wine : palette.gold}
              strokeWidth={1.5}
              strokeDasharray="6 6"
              fill="none"
              opacity={0.8}
            />
            <Path d={`M${archW * 0.5},${archH * 0.1} L${archW * 0.5},${archH * 0.92}`} stroke={palette.goldBright} strokeWidth={0.8} opacity={0.35} />
          </Svg>
          {score !== null && (
            <View style={styles.scoreBadge}>
              <Text style={styles.scoreBadgeText}>{score}%</Text>
            </View>
          )}
        </View>
      </Panel>

      <View style={styles.controls}>
        <GoldButton
          label="Flip"
          variant="outline"
          icon="camera-flip-outline"
          compact
          disabled={!permission?.granted}
          onPress={() => setFacing((f) => (f === 'back' ? 'front' : 'back'))}
        />
        <GoldButton
          label={analyzing ? 'The Pythia gazes…' : 'Ask the Oracle'}
          icon="eye-outline"
          loading={analyzing}
          disabled={!permission?.granted}
          onPress={analyze}
          style={{ flex: 1 }}
        />
      </View>

      {prophecy && score !== null && (
        <>
          <SectionTitle>The prophecy</SectionTitle>
          <Panel>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.lg }}>
              <DivinityRing size={96} progress={score / 100} stroke={5}>
                <Text style={styles.ringValue}>{score}</Text>
              </DivinityRing>
              <Text style={[styles.verdict, { flex: 1 }]}>{prophecy.verdict}</Text>
            </View>
            <Ornament width={140} style={{ marginVertical: space.lg }} />
            {prophecy.advice.map((a, i) => (
              <View key={i} style={styles.adviceRow}>
                <View style={styles.adviceGem} />
                <Text style={[olympusText.body, { flex: 1 }]}>{a}</Text>
              </View>
            ))}
          </Panel>
        </>
      )}

      <SectionTitle>The rite</SectionTitle>
      <Panel>
        {[
          'Stand inside the golden arch, full body visible.',
          'Take the starting position of your exercise.',
          'Ask the Oracle and hold still while she gazes.',
          'Follow her counsel, then ask again.',
        ].map((s, i) => (
          <View key={i} style={styles.adviceRow}>
            <Text style={styles.riteNum}>{['I', 'II', 'III', 'IV'][i]}</Text>
            <Text style={[olympusText.body, { flex: 1 }]}>{s}</Text>
          </View>
        ))}
        {d.stats.lastPosture !== null && (
          <Text style={[olympusText.small, { marginTop: space.md }]}>Last reading: {d.stats.lastPosture}%</Text>
        )}
      </Panel>
    </Screen>
  );
}

const styles = StyleSheet.create({
  veil: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: space.xxl, gap: space.sm, backgroundColor: '#0C0A0D' },
  veilTitle: { fontFamily: fonts.display, fontSize: 18, color: palette.ivory, textAlign: 'center' },
  scoreBadge: {
    position: 'absolute',
    top: 16,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(8,7,10,0.75)',
    borderWidth: 1,
    borderColor: palette.borderStrong,
  },
  scoreBadgeText: { fontFamily: fonts.display, fontSize: 20, color: palette.goldBright },
  controls: { flexDirection: 'row', gap: space.md, marginTop: space.lg, alignItems: 'center' },
  ringValue: { fontFamily: fonts.display, fontSize: 26, color: palette.ivory },
  verdict: { fontFamily: fonts.serifItalic, fontSize: 19, lineHeight: 25, color: palette.marble },
  adviceRow: { flexDirection: 'row', alignItems: 'flex-start', gap: space.md, marginBottom: space.md },
  adviceGem: { width: 6, height: 6, marginTop: 9, backgroundColor: palette.gold, transform: [{ rotate: '45deg' }] },
  riteNum: { fontFamily: fonts.displaySemi, fontSize: 13, color: palette.gold, width: 24, marginTop: 3 },
});
