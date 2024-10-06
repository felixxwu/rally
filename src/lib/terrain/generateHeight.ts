import { terrainDepth, terrainMinHeight, terrainWidth } from '../../refs';
import { createNoiseFunc } from './createNoiseFunc';
import { getSeededHeight } from './getSeededHeight';
import { getSlope } from './getSlope';

export function generateHeight() {
  const noise = createNoiseFunc();
  const size = terrainWidth * terrainDepth;
  const data = new Float32Array(size);
  const hRange = getSeededHeight() - terrainMinHeight;
  const { slopeX, slopeZ } = getSlope();
  let p = 0;

  for (let j = 0; j < terrainDepth; j++) {
    for (let i = 0; i < terrainWidth; i++) {
      const height =
        Math.pow(noise(i, j), 2) * hRange + terrainMinHeight + i * slopeX + j * slopeZ + 100;

      data[p] = height;

      p++;
    }
  }

  return data;
}
