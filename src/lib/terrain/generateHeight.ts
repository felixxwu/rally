import { terrainDepth, terrainMaxHeight, terrainMinHeight, terrainWidth } from '../../refs';
import { ref } from '../utils/ref';
import { createNoiseFunc } from './createNoiseFunc';

export let seedRef = ref(0);

export function generateHeight() {
  const noise = createNoiseFunc();

  const size = terrainWidth * terrainDepth;
  const data = new Float32Array(size);

  const hRange = terrainMaxHeight - terrainMinHeight;

  let p = 0;

  for (let j = 0; j < terrainDepth; j++) {
    for (let i = 0; i < terrainWidth; i++) {
      const height = Math.pow(noise(i, j), 2) * hRange + terrainMinHeight + i * -3 + j * 3 + 100;

      data[p] = height;

      p++;
    }
  }

  return data;
}
