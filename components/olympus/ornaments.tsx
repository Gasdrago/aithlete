import React, { useId, useMemo } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle, useWindowDimensions } from 'react-native';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Defs, Ellipse, G, Line, LinearGradient, Path, RadialGradient, Rect, Stop } from 'react-native-svg';

import { palette } from '@/styles/olympus';

const safeId = (raw: string) => raw.replace(/[^a-zA-Z0-9]/g, '');

/** Night sky over Olympus: obsidian gradient, golden dawn glow and faint marble veins. */
export function Backdrop({ glow = 'top' }: { glow?: 'top' | 'center' }) {
  const { width, height } = useWindowDimensions();
  const id = safeId(useId());
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <ExpoLinearGradient colors={['#110E12', palette.night, palette.nightDeep]} locations={[0, 0.45, 1]} style={StyleSheet.absoluteFill} />
      <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id={`${id}g`} cx="50%" cy={glow === 'top' ? '0%' : '38%'} r="75%">
            <Stop offset={0} stopColor={palette.gold} stopOpacity={0.2} />
            <Stop offset={0.45} stopColor={palette.gold} stopOpacity={0.05} />
            <Stop offset={1} stopColor={palette.gold} stopOpacity={0} />
          </RadialGradient>
          <RadialGradient id={`${id}b`} cx="0%" cy="100%" r="60%">
            <Stop offset={0} stopColor="#7FA6B8" stopOpacity={0.07} />
            <Stop offset={1} stopColor="#7FA6B8" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect x={0} y={0} width={width} height={height} fill={`url(#${id}g)`} />
        <Rect x={0} y={0} width={width} height={height} fill={`url(#${id}b)`} />
        <G stroke={palette.ivory} strokeWidth={0.6} fill="none" opacity={0.045}>
          <Path d={`M${-20},${height * 0.18} C${width * 0.25},${height * 0.12} ${width * 0.35},${height * 0.3} ${width * 0.62},${height * 0.24} S${width * 0.95},${height * 0.34} ${width + 20},${height * 0.28}`} />
          <Path d={`M${-20},${height * 0.62} C${width * 0.2},${height * 0.55} ${width * 0.45},${height * 0.72} ${width * 0.7},${height * 0.6} S${width},${height * 0.7} ${width + 20},${height * 0.66}`} />
          <Path d={`M${width * 0.1},${-10} C${width * 0.2},${height * 0.2} ${width * 0.05},${height * 0.4} ${width * 0.18},${height * 0.6}`} />
          <Path d={`M${width * 0.85},${height * 0.4} C${width * 0.78},${height * 0.55} ${width * 0.95},${height * 0.75} ${width * 0.82},${height + 10}`} />
        </G>
      </Svg>
    </View>
  );
}

/** Running Greek key (meander) band. */
export function Meander({ width, height = 10, color = palette.gold, opacity = 0.55 }: { width: number; height?: number; color?: string; opacity?: number }) {
  const d = useMemo(() => {
    const u = 10;
    const count = Math.ceil((width * 12) / height / u) + 1;
    let path = 'M0,8';
    for (let i = 0; i < count; i++) {
      const x = i * u;
      path += ` L${x},0 L${x + 8},0 L${x + 8},6 L${x + 4},6 L${x + 4},4 L${x + 6},4 L${x + 6},2 L${x + 2},2 L${x + 2},8 L${x + 10},8`;
    }
    return path;
  }, [width, height]);
  const scale = height / 12;
  return (
    <Svg width={width} height={height} viewBox={`0 -2 ${width / scale} 12`} opacity={opacity}>
      <Path d={d} stroke={color} strokeWidth={1} fill="none" strokeLinejoin="miter" />
      <Line x1={0} y1={-1.5} x2={width / scale} y2={-1.5} stroke={color} strokeWidth={0.6} />
      <Line x1={0} y1={9.5} x2={width / scale} y2={9.5} stroke={color} strokeWidth={0.6} />
    </Svg>
  );
}

function leafPath(cx: number, cy: number, angle: number, len: number, wid: number) {
  const ux = Math.cos(angle);
  const uy = Math.sin(angle);
  const tip = [cx + (ux * len) / 2, cy + (uy * len) / 2];
  const base = [cx - (ux * len) / 2, cy - (uy * len) / 2];
  const a = [cx - uy * wid, cy + ux * wid];
  const b = [cx + uy * wid, cy - ux * wid];
  return `M${base[0]},${base[1]} Q${a[0]},${a[1]} ${tip[0]},${tip[1]} Q${b[0]},${b[1]} ${base[0]},${base[1]} Z`;
}

/** Laurel wreath, open at the top. */
export function Laurel({ size, color = palette.gold, opacity = 1, leaves = 11 }: { size: number; color?: string; opacity?: number; leaves?: number }) {
  const id = safeId(useId());
  const paths = useMemo(() => {
    const out: string[] = [];
    const r = 40;
    for (const side of [-1, 1]) {
      for (let i = 0; i < leaves; i++) {
        // from the bottom (90°) up to ~-55° on each side
        const t = i / (leaves - 1);
        const ang = Math.PI / 2 + side * (0.18 + t * 2.35);
        const x = 50 + Math.cos(ang) * r;
        const y = 50 + Math.sin(ang) * r;
        const tangent = ang + side * (Math.PI / 2);
        const len = 11 - t * 3;
        out.push(leafPath(x + Math.cos(ang) * 3.2, y + Math.sin(ang) * 3.2, tangent - side * 0.55, len, 2.6));
        out.push(leafPath(x - Math.cos(ang) * 3.2, y - Math.sin(ang) * 3.2, tangent + side * 0.55, len, 2.6));
      }
    }
    return out;
  }, [leaves]);
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" opacity={opacity}>
      <Defs>
        <LinearGradient id={`${id}l`} x1="0" y1="0" x2="1" y2="1">
          <Stop offset={0} stopColor={palette.goldPale} />
          <Stop offset={0.5} stopColor={color} />
          <Stop offset={1} stopColor={palette.goldDeep} />
        </LinearGradient>
      </Defs>
      <Path
        d="M50,92 C26,92 9,72 10,48 C11,32 18,20 28,12 M50,92 C74,92 91,72 90,48 C89,32 82,20 72,12"
        stroke={color}
        strokeWidth={1}
        fill="none"
        opacity={0.7}
      />
      {paths.map((d, i) => (
        <Path key={i} d={d} fill={`url(#${id}l)`} />
      ))}
      <Circle cx={50} cy={93} r={2.4} fill={color} />
    </Svg>
  );
}

/** Thin gold rule with a central lozenge. */
export function Ornament({ width = 160, style }: { width?: number; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width, alignSelf: 'center' }, style]}>
      <ExpoLinearGradient colors={['transparent', palette.gold]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ flex: 1, height: StyleSheet.hairlineWidth * 2 }} />
      <View style={{ width: 5, height: 5, transform: [{ rotate: '45deg' }], borderWidth: 1, borderColor: palette.gold, marginHorizontal: 6 }} />
      <View style={{ width: 7, height: 7, transform: [{ rotate: '45deg' }], backgroundColor: palette.gold, marginHorizontal: 0 }} />
      <View style={{ width: 5, height: 5, transform: [{ rotate: '45deg' }], borderWidth: 1, borderColor: palette.gold, marginHorizontal: 6 }} />
      <ExpoLinearGradient colors={[palette.gold, 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ flex: 1, height: StyleSheet.hairlineWidth * 2 }} />
    </View>
  );
}

/** Line-art Ionic temple framing its children (usually a statue). */
export function TempleFrame({ width, height, children }: { width: number; height: number; children?: React.ReactNode }) {
  const id = safeId(useId());
  const w = width;
  const h = height;
  const colW = Math.max(14, w * 0.075);
  const pedH = h * 0.13;
  const entH = h * 0.05;
  const stepH = h * 0.035;
  const colTop = pedH + entH;
  const colBottom = h - stepH * 2;
  const columns = [w * 0.04, w * 0.96 - colW];
  return (
    <View style={{ width, height }}>
      <Svg width={w} height={h} style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id={`${id}c`} x1="0" y1="0" x2="1" y2="0">
            <Stop offset={0} stopColor={palette.gold} stopOpacity={0.1} />
            <Stop offset={0.5} stopColor={palette.gold} stopOpacity={0.22} />
            <Stop offset={1} stopColor={palette.gold} stopOpacity={0.05} />
          </LinearGradient>
          <RadialGradient id={`${id}r`} cx="50%" cy="45%" r="55%">
            <Stop offset={0} stopColor={palette.goldBright} stopOpacity={0.22} />
            <Stop offset={0.6} stopColor={palette.gold} stopOpacity={0.05} />
            <Stop offset={1} stopColor={palette.gold} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Ellipse cx={w / 2} cy={h * 0.48} rx={w * 0.42} ry={h * 0.42} fill={`url(#${id}r)`} />
        {/* pediment */}
        <Path d={`M${w * 0.02},${pedH} L${w / 2},${h * 0.015} L${w * 0.98},${pedH} Z`} fill={`url(#${id}c)`} stroke={palette.gold} strokeWidth={1} strokeOpacity={0.7} />
        <Path d={`M${w * 0.1},${pedH - 4} L${w / 2},${h * 0.04} L${w * 0.9},${pedH - 4}`} fill="none" stroke={palette.gold} strokeWidth={0.6} strokeOpacity={0.45} />
        {/* entablature */}
        <Rect x={w * 0.015} y={pedH} width={w * 0.97} height={entH} fill={`url(#${id}c)`} stroke={palette.gold} strokeWidth={0.8} strokeOpacity={0.6} />
        {Array.from({ length: Math.floor(w / 16) }).map((_, i) => (
          <Rect key={i} x={w * 0.03 + i * 16} y={pedH + entH * 0.3} width={6} height={entH * 0.4} fill={palette.gold} opacity={0.25} />
        ))}
        {/* columns */}
        {columns.map((x, i) => (
          <G key={i}>
            <Path
              d={`M${x - 3},${colTop + 7} C${x - 6},${colTop + 1} ${x + 2},${colTop - 2} ${x + 3},${colTop + 4} M${x + colW + 3},${colTop + 7} C${x + colW + 6},${colTop + 1} ${x + colW - 2},${colTop - 2} ${x + colW - 3},${colTop + 4}`}
              stroke={palette.gold}
              strokeWidth={1}
              fill="none"
              opacity={0.7}
            />
            <Rect x={x - 4} y={colTop} width={colW + 8} height={4} fill={palette.gold} opacity={0.45} />
            <Rect x={x} y={colTop + 6} width={colW} height={colBottom - colTop - 10} fill={`url(#${id}c)`} stroke={palette.gold} strokeWidth={0.8} strokeOpacity={0.55} />
            {[0.25, 0.5, 0.75].map((f) => (
              <Line key={f} x1={x + colW * f} y1={colTop + 8} x2={x + colW * f} y2={colBottom - 6} stroke={palette.gold} strokeWidth={0.6} opacity={0.4} />
            ))}
            <Rect x={x - 3} y={colBottom - 4} width={colW + 6} height={4} fill={palette.gold} opacity={0.45} />
          </G>
        ))}
        {/* steps */}
        <Rect x={w * 0.01} y={h - stepH * 2} width={w * 0.98} height={stepH} fill={`url(#${id}c)`} stroke={palette.gold} strokeWidth={0.6} strokeOpacity={0.5} />
        <Rect x={0} y={h - stepH} width={w} height={stepH} fill={`url(#${id}c)`} stroke={palette.gold} strokeWidth={0.6} strokeOpacity={0.5} />
      </Svg>
      <View style={{ position: 'absolute', left: 0, right: 0, top: colTop + 2, bottom: stepH * 2, alignItems: 'center', justifyContent: 'flex-end' }}>
        {children}
      </View>
    </View>
  );
}

/** Golden score ring, engraved like the rim of a drachma. */
export function DivinityRing({ size, progress, stroke = 6, children }: { size: number; progress: number; stroke?: number; children?: React.ReactNode }) {
  const id = safeId(useId());
  const r = size / 2 - stroke - 6;
  const c = 2 * Math.PI * r;
  const p = Math.min(1, Math.max(0, progress));
  const ticks = 48;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
            <Stop offset={0} stopColor={palette.goldPale} />
            <Stop offset={0.5} stopColor={palette.gold} />
            <Stop offset={1} stopColor={palette.goldDeep} />
          </LinearGradient>
          <RadialGradient id={`${id}f`} cx="50%" cy="40%" r="60%">
            <Stop offset={0} stopColor={palette.gold} stopOpacity={0.14} />
            <Stop offset={1} stopColor={palette.gold} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle cx={size / 2} cy={size / 2} r={r - stroke} fill={`url(#${id}f)`} />
        {Array.from({ length: ticks }).map((_, i) => {
          const a = (i / ticks) * Math.PI * 2;
          const r1 = size / 2 - 2;
          const r2 = size / 2 - (i % 4 === 0 ? 6 : 4);
          return (
            <Line
              key={i}
              x1={size / 2 + Math.cos(a) * r1}
              y1={size / 2 + Math.sin(a) * r1}
              x2={size / 2 + Math.cos(a) * r2}
              y2={size / 2 + Math.sin(a) * r2}
              stroke={palette.gold}
              strokeWidth={1}
              opacity={i / ticks <= p ? 0.8 : 0.25}
            />
          );
        })}
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={palette.hairline} strokeWidth={stroke} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={`url(#${id}g)`}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={`${c * p} ${c}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <Circle cx={size / 2} cy={size / 2} r={r - stroke - 3} stroke={palette.gold} strokeWidth={0.6} fill="none" opacity={0.35} />
      </Svg>
      {children}
    </View>
  );
}

/** Beaded coin rim used around statue busts. */
export function CoinRim({ size, beads = 36, color = palette.gold }: { size: number; beads?: number; color?: string }) {
  const id = safeId(useId());
  return (
    <Svg width={size} height={size} style={StyleSheet.absoluteFill} pointerEvents="none">
      <Defs>
        <LinearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
          <Stop offset={0} stopColor={palette.goldPale} />
          <Stop offset={0.5} stopColor={color} />
          <Stop offset={1} stopColor={palette.goldShadow} />
        </LinearGradient>
      </Defs>
      <Circle cx={size / 2} cy={size / 2} r={size / 2 - 1.5} stroke={`url(#${id}g)`} strokeWidth={2.5} fill="none" />
      {Array.from({ length: beads }).map((_, i) => {
        const a = (i / beads) * Math.PI * 2;
        const rr = size / 2 - 6;
        return <Circle key={i} cx={size / 2 + Math.cos(a) * rr} cy={size / 2 + Math.sin(a) * rr} r={1.1} fill={color} opacity={0.7} />;
      })}
      <Circle cx={size / 2} cy={size / 2} r={size / 2 - 10} stroke={color} strokeWidth={0.6} fill="none" opacity={0.5} />
    </Svg>
  );
}
