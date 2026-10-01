import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { GODS, GODDESSES } from '@/data/pantheon';
import {
  type BodyMeasurements,
  type Goal,
  type Level,
  type Sex,
  type WorkoutLog,
  bodyFatOf,
  disciplineFrom,
  divinityOf,
  materialForTier,
  rankFor,
  resemblances,
  statueParamsFrom,
  streakOf,
} from '@/utils/divinity';

export interface AthleteProfile {
  name: string;
  sex: Sex;
  heightCm: number;
  goal: Goal;
  level: Level;
  onboarded: boolean;
  createdAt: string;
}

export interface PostureLog {
  date: string;
  score: number;
}

interface AthleteState {
  profile: AthleteProfile;
  measurements: BodyMeasurements[];
  workouts: WorkoutLog[];
  posture: PostureLog[];
}

const STORAGE_KEY = 'aithlete/state/v1';

/** A starting body: the mortal archetype of the chosen pantheon. */
export function defaultMeasurements(sex: Sex): BodyMeasurements {
  const base = (sex === 'female' ? GODDESSES : GODS)[0].body;
  const { bodyFat: _ignored, ...rest } = base;
  return { ...rest, date: new Date().toISOString() };
}

function initialState(): AthleteState {
  return {
    profile: {
      name: 'Athlete',
      sex: 'male',
      heightCm: 178,
      goal: 'general',
      level: 'Beginner',
      onboarded: false,
      createdAt: new Date().toISOString(),
    },
    measurements: [defaultMeasurements('male')],
    workouts: [],
    posture: [],
  };
}

interface AthleteContextValue {
  ready: boolean;
  state: AthleteState;
  completeOnboarding: (profile: Omit<AthleteProfile, 'onboarded' | 'createdAt'>, body: BodyMeasurements) => void;
  updateProfile: (patch: Partial<AthleteProfile>) => void;
  addMeasurement: (m: BodyMeasurements) => void;
  logWorkout: (w: Omit<WorkoutLog, 'id' | 'date'>) => WorkoutLog;
  logPosture: (score: number) => void;
  reset: () => void;
}

const AthleteContext = createContext<AthleteContextValue | null>(null);

export function AthleteProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AthleteState>(initialState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!raw) return;
        const saved = JSON.parse(raw) as Partial<AthleteState>;
        setState((s) => ({
          profile: { ...s.profile, ...saved.profile },
          measurements: saved.measurements?.length ? saved.measurements : s.measurements,
          workouts: saved.workouts ?? [],
          posture: saved.posture ?? [],
        }));
      })
      .catch((e) => console.warn('Could not restore athlete state', e))
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch((e) => console.warn('Could not save athlete state', e));
  }, [state, ready]);

  const completeOnboarding = useCallback<AthleteContextValue['completeOnboarding']>((profile, body) => {
    setState((s) => ({
      ...s,
      profile: { ...profile, onboarded: true, createdAt: s.profile.createdAt },
      measurements: [body],
    }));
  }, []);

  const updateProfile = useCallback((patch: Partial<AthleteProfile>) => {
    setState((s) => ({ ...s, profile: { ...s.profile, ...patch } }));
  }, []);

  const addMeasurement = useCallback((m: BodyMeasurements) => {
    setState((s) => ({ ...s, measurements: [...s.measurements, m] }));
  }, []);

  const logWorkout = useCallback((w: Omit<WorkoutLog, 'id' | 'date'>) => {
    const entry: WorkoutLog = { ...w, id: `${Date.now()}`, date: new Date().toISOString() };
    setState((s) => ({ ...s, workouts: [...s.workouts, entry] }));
    return entry;
  }, []);

  const logPosture = useCallback((score: number) => {
    setState((s) => ({ ...s, posture: [...s.posture, { date: new Date().toISOString(), score }] }));
  }, []);

  const reset = useCallback(() => {
    setState(initialState());
  }, []);

  const value = useMemo(
    () => ({ ready, state, completeOnboarding, updateProfile, addMeasurement, logWorkout, logPosture, reset }),
    [ready, state, completeOnboarding, updateProfile, addMeasurement, logWorkout, logPosture, reset],
  );

  // Screens wait for the saved chronicle so they never flash default data (the splash covers this).
  return <AthleteContext.Provider value={value}>{ready ? children : null}</AthleteContext.Provider>;
}

export function useAthlete() {
  const ctx = useContext(AthleteContext);
  if (!ctx) throw new Error('useAthlete must be used within AthleteProvider');
  return ctx;
}

/** Everything the screens need to know about the athlete's divine standing. */
export function useDivinity() {
  const { state } = useAthlete();
  return useMemo(() => {
    const { profile, measurements, workouts, posture } = state;
    const latest = measurements[measurements.length - 1];
    const first = measurements[0];
    const discipline = disciplineFrom(workouts);
    const breakdown = divinityOf(latest, profile.heightCm, profile.sex, discipline);
    const rank = rankFor(breakdown.score, profile.sex);
    const likeness = resemblances(latest, profile.heightCm, profile.sex);
    const material = materialForTier(rank.current.tier, rank.ladder.length);
    const statue = statueParamsFrom(latest, profile.heightCm, profile.sex);
    const history = measurements.map((m) => ({
      date: m.date,
      score: divinityOf(m, profile.heightCm, profile.sex, discipline).score,
    }));
    const weekAgo = Date.now() - 7 * 864e5;
    const week = workouts.filter((w) => new Date(w.date).getTime() > weekAgo);
    return {
      profile,
      latest,
      first,
      bodyFat: bodyFatOf(latest, profile.heightCm, profile.sex),
      breakdown,
      rank,
      likeness,
      closest: likeness[0],
      material,
      statue,
      history,
      stats: {
        trials: workouts.length,
        streak: streakOf(workouts),
        calories: workouts.reduce((a, w) => a + w.calories, 0),
        minutes: workouts.reduce((a, w) => a + w.durationMin, 0),
        weekTrials: week.length,
        weekDays: new Set(week.map((w) => new Date(w.date).toDateString())).size,
        weekMinutes: week.reduce((a, w) => a + w.durationMin, 0),
        weekCalories: week.reduce((a, w) => a + w.calories, 0),
        lastPosture: posture[posture.length - 1]?.score ?? null,
      },
      workouts,
    };
  }, [state]);
}
