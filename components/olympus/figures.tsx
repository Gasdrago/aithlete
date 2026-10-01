import React, { useMemo } from 'react';

import type { Deity } from '@/data/pantheon';
import type { Sex } from '@/utils/divinity';
import { statueParamsFrom } from '@/utils/divinity';
import Statue from './Statue';
import type { StatueMaterial, StatueParams, StatueStyle } from './statueGeometry';

/** What the athlete's statue wears: honours accumulate with each ascension. */
export function athleteStyle(sex: Sex, tier: number): StatueStyle {
  if (tier >= 2) return { headGear: 'laurel', attribute: 'none' };
  if (tier === 1) return { headGear: 'ribbon', attribute: 'none' };
  return { headGear: sex === 'female' ? 'none' : 'curls', attribute: 'none' };
}

export function AthleteStatue({
  params,
  sex,
  tier,
  material,
  width,
  pedestal = true,
  halo,
}: {
  params: StatueParams;
  sex: Sex;
  tier: number;
  material: StatueMaterial;
  width: number;
  pedestal?: boolean;
  halo?: boolean;
}) {
  const style = useMemo(() => athleteStyle(sex, tier), [sex, tier]);
  return <Statue params={params} styleSpec={style} material={material} width={width} pedestal={pedestal} halo={halo} />;
}

export function DeityStatue({
  deity,
  width,
  veiled,
  pedestal = true,
  halo,
  material,
}: {
  deity: Deity;
  width: number;
  veiled?: boolean;
  pedestal?: boolean;
  halo?: boolean;
  material?: StatueMaterial;
}) {
  const params = useMemo(() => statueParamsFrom(deity.body, deity.heightCm, deity.sex), [deity]);
  return (
    <Statue
      params={params}
      styleSpec={deity.style}
      material={material ?? (deity.tier === 0 ? 'clay' : 'marble')}
      width={width}
      veiled={veiled}
      pedestal={pedestal}
      halo={halo}
    />
  );
}
