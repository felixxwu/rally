import { createNoise2D } from 'simplex-noise';
import { seed, scale, seedLevel } from '../../refs';
import { seedRef } from './generateHeight';

// noise between 0 -1
export function createNoiseFunc() {
  seedRef.current = seed.current;
  const simplex = createNoise2D(() => {
    var x = Math.sin(seedRef.current++) * 10000;
    return x - Math.floor(x);
  });

  const noise = (level, x, z) =>
    simplex(scale + level * x * scale, scale + level * z * scale) / level +
    (level > 1 ? noise(level / 2, x, z) : 0) +
    0.1;

  return (x: number, y: number) => (Math.sin(noise(seedLevel.current, x, y)) + 1) / 2;
}
