import { createNoise2D } from 'simplex-noise';
import { scale, terrainDepth, terrainMaxHeight, terrainMinHeight, terrainWidth } from '../../refs';
import { ref } from '../utils/ref';

let seedRef = ref(1);
function random() {
  var x = Math.sin(seedRef.current++) * 10000;
  return x - Math.floor(x);
}

export function generateHeight(seed: number) {
  seedRef.current = seed;

  const simplex = createNoise2D(random);

  const noise = (level, x, z) =>
    simplex(scale + level * x * scale, scale + level * z * scale) / level +
    (level > 1 ? noise(level / 2, x, z) : 0) +
    0.1;

  const size = terrainWidth * terrainDepth;
  const data = new Float32Array(size);

  const hRange = terrainMaxHeight - terrainMinHeight;

  let p = 0;

  for (let j = 0; j < terrainDepth; j++) {
    for (let i = 0; i < terrainWidth; i++) {
      const height = Math.pow(noise(8, i, j), 2) * hRange + terrainMinHeight;

      data[p] = height;

      p++;
    }
  }

  return data;
}
