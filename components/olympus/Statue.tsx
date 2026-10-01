import React, { useId, useMemo } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Svg, { ClipPath, Defs, Ellipse, G, LinearGradient, Path, RadialGradient, Rect, Stop } from 'react-native-svg';

import {
  MATERIALS,
  buildStatue,
  type Paint,
  type StatueMaterial,
  type StatueParams,
  type StatueStyle,
} from './statueGeometry';

interface StatueProps {
  params: StatueParams;
  styleSpec: StatueStyle;
  material?: StatueMaterial;
  width: number;
  pedestal?: boolean;
  crop?: 'full' | 'bust';
  /** Dim and desaturate (a locked god). */
  veiled?: boolean;
  halo?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** Renders a parametric marble / bronze / gold statue. */
export default function Statue({
  params,
  styleSpec,
  material = 'marble',
  width,
  pedestal = true,
  crop = 'full',
  veiled = false,
  halo = false,
  style,
}: StatueProps) {
  const rawId = useId();
  const id = useMemo(() => `st${rawId.replace(/[^a-zA-Z0-9]/g, '')}`, [rawId]);
  const scene = useMemo(() => buildStatue(params, styleSpec, { pedestal, crop }), [params, styleSpec, pedestal, crop]);
  const pal = MATERIALS[material];
  const [vx, vy, vw, vh] = scene.viewBox;
  const height = (width * vh) / vw;
  const [lx0, lx1] = scene.lightSpan;

  const paint = (p?: Paint): string => {
    switch (p) {
      case undefined:
      case 'none':
        return 'none';
      case 'skin':
      case 'cloth':
      case 'hair':
      case 'gold':
      case 'plinth':
        return `url(#${id}-${p})`;
      case 'line':
      case 'lineSoft':
        return pal.line;
      case 'light':
        return pal.light;
      case 'shadow':
        return '#1A1208';
      case 'void':
        return '#0B0906';
      case 'plinthTrim':
        return '#C9A55C';
    }
  };

  const ramp = (gid: string, stops: readonly string[]) => (
    <LinearGradient id={`${id}-${gid}`} gradientUnits="userSpaceOnUse" x1={lx0} y1={0} x2={lx1} y2={40}>
      {stops.map((c, i) => (
        <Stop key={i} offset={[0, 0.38, 0.75, 1][i]} stopColor={c} />
      ))}
    </LinearGradient>
  );

  const clipLayers = scene.layers.filter((l) => l.clip);

  return (
    <Svg width={width} height={height} viewBox={`${vx} ${vy} ${vw} ${vh}`} style={[veiled && { opacity: 0.32 }, style]}>
      <Defs>
        {ramp('skin', pal.skin)}
        {ramp('cloth', pal.cloth)}
        {ramp('hair', pal.hair)}
        <LinearGradient id={`${id}-gold`} gradientUnits="userSpaceOnUse" x1={40} y1={0} x2={160} y2={80}>
          <Stop offset={0} stopColor="#FFF3C4" />
          <Stop offset={0.35} stopColor="#E9C46A" />
          <Stop offset={0.7} stopColor="#B8862F" />
          <Stop offset={1} stopColor="#7A5518" />
        </LinearGradient>
        <LinearGradient id={`${id}-plinth`} x1="0" y1="0" x2="1" y2="0">
          <Stop offset={0} stopColor="#3A352F" />
          <Stop offset={0.4} stopColor="#26221E" />
          <Stop offset={1} stopColor="#12100D" />
        </LinearGradient>
        <LinearGradient id={`${id}-ao`} x1="0" y1="0" x2="0" y2="1">
          <Stop offset={0} stopColor="#FFFFFF" stopOpacity={0.16} />
          <Stop offset={0.35} stopColor="#000000" stopOpacity={0} />
          <Stop offset={1} stopColor="#000000" stopOpacity={0.38} />
        </LinearGradient>
        <RadialGradient id={`${id}-halo`} cx="50%" cy="50%" r="50%">
          <Stop offset={0} stopColor="#F3D9A0" stopOpacity={0.5} />
          <Stop offset={0.55} stopColor="#D4AF6A" stopOpacity={0.12} />
          <Stop offset={1} stopColor="#D4AF6A" stopOpacity={0} />
        </RadialGradient>
        <ClipPath id={`${id}-clip`}>
          {clipLayers.map((l, i) =>
            l.kind === 'path' ? (
              <Path key={i} d={l.d} />
            ) : (
              <Ellipse key={i} cx={l.cx} cy={l.cy} rx={l.rx} ry={l.ry} />
            ),
          )}
        </ClipPath>
      </Defs>

      {halo && <Ellipse cx={100} cy={crop === 'bust' ? 40 : 46} rx={crop === 'bust' ? 44 : 52} ry={crop === 'bust' ? 44 : 52} fill={`url(#${id}-halo)`} />}

      <G>
        {scene.layers.map((l, i) => {
          const common = {
            fill: paint(l.fill),
            stroke: paint(l.stroke),
            strokeWidth: l.strokeWidth ?? 0,
            opacity: l.opacity ?? 1,
            strokeLinecap: 'round' as const,
            strokeLinejoin: 'round' as const,
          };
          return l.kind === 'path' ? (
            <Path key={i} d={l.d} {...common} />
          ) : (
            <Ellipse key={i} cx={l.cx} cy={l.cy} rx={l.rx} ry={l.ry} {...common} />
          );
        })}
      </G>

      <Rect x={vx} y={vy} width={vw} height={vh} fill={`url(#${id}-ao)`} clipPath={`url(#${id}-clip)`} />
    </Svg>
  );
}
