import type { ImageSourcePropType } from 'react-native';

/**
 * Photographic statues (generated renders, background removed). Deities listed
 * here are shown as photos; every other one falls back to the parametric SVG
 * statue. `aspect` is width / height of the full-body image.
 */
export interface StatueImage {
  full: ImageSourcePropType;
  bust: ImageSourcePropType;
  aspect: number;
}

export const STATUE_IMAGES: Record<string, StatueImage> = {
  achilles: { full: require('@/assets/statues/achilles.png'), bust: require('@/assets/statues/achilles-bust.png'), aspect: 346 / 1100 },
  hermes: { full: require('@/assets/statues/hermes.png'), bust: require('@/assets/statues/hermes-bust.png'), aspect: 428 / 1100 },
  apollo: { full: require('@/assets/statues/apollo.png'), bust: require('@/assets/statues/apollo-bust.png'), aspect: 389 / 1100 },
  poseidon: { full: require('@/assets/statues/poseidon.png'), bust: require('@/assets/statues/poseidon-bust.png'), aspect: 415 / 1100 },
  athena: { full: require('@/assets/statues/athena.png'), bust: require('@/assets/statues/athena-bust.png'), aspect: 304 / 1100 },
};
