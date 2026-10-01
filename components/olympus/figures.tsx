import React, { useMemo } from 'react';
import { Image, View } from 'react-native';
import Svg, { Defs, Ellipse, RadialGradient, Stop } from 'react-native-svg';

import { STATUE_IMAGES } from '@/data/statueImages';

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
  const photo = STATUE_IMAGES[deity.id];
  if (photo && !material) {
    // same footprint as an SVG statue so photos and drawings line up side by side
    const height = width * 1.78;
    return (
      <View style={{ width, height, alignItems: 'center', justifyContent: 'flex-end', opacity: veiled ? 0.32 : 1 }}>
        {halo && (
          <Svg width={width} height={width} style={{ position: 'absolute', top: -width * 0.12 }} pointerEvents="none">
            <Defs>
              <RadialGradient id={`halo-${deity.id}`} cx="50%" cy="50%" r="50%">
                <Stop offset={0} stopColor="#F3D9A0" stopOpacity={0.45} />
                <Stop offset={0.55} stopColor="#D4AF6A" stopOpacity={0.1} />
                <Stop offset={1} stopColor="#D4AF6A" stopOpacity={0} />
              </RadialGradient>
            </Defs>
            <Ellipse cx={width / 2} cy={width / 2} rx={width / 2} ry={width / 2} fill={`url(#halo-${deity.id})`} />
          </Svg>
        )}
        <Image
          source={photo.full}
          style={{ height, width: Math.min(width * 1.15, height * photo.aspect) }}
          resizeMode="contain"
          accessibilityLabel={`Statue of ${deity.name}`}
        />
      </View>
    );
  }
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
