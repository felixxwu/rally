import { createNoise2D } from 'simplex-noise';
import { seed, scale, seedLevel } from '../../refs';
import { ref } from '../utils/ref';

const seedRef = ref(0);
type NoiseFunc = (x: number, y: number) => number;
const seedCache: { [key: number]: NoiseFunc } = {};

// noise between 0 -1
export function createNoiseFunc(customSeed?: number) {
  const currentSeed = customSeed ?? seed.current;

  if (seedCache[currentSeed]) return seedCache[currentSeed];

  seedRef.current = currentSeed;
  const simplex = createNoise2D(() => {
    const x = Math.sin(seedRef.current++) * 10000;
    return x - Math.floor(x);
  });

  const noise = (level, x, z) =>
    simplex(scale + level * x * scale, scale + level * z * scale) / level +
    (level > 1 ? noise(level / 2, x, z) : 0) +
    0.1;

  const noiseFunc = (x: number, y: number) => (Math.sin(noise(seedLevel.current, x, y)) + 1) / 2;
  seedCache[seed.current] = noiseFunc;
  return noiseFunc;
}
