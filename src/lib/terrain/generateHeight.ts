import {
  terrainDepth,
  terrainMinHeight,
  maxTerrainSlopeX,
  maxTerrainSlopeZ,
  terrainWidth,
} from '../../refs';
import { createNoiseFunc } from './createNoiseFunc';
import { getSeededHeight } from './getSeededHeight';

export function generateHeight() {
  const noise = createNoiseFunc();

  const size = terrainWidth * terrainDepth;
  const data = new Float32Array(size);

  const hRange = getSeededHeight() - terrainMinHeight;

  const slopeX = ((noise(43, 45) * 2 - 1) * Math.sqrt(maxTerrainSlopeX)) ** 2;
  const slopeZ = ((noise(3, 65) * 2 - 1) * Math.sqrt(maxTerrainSlopeZ)) ** 2;

  console.log(`Seeded Height `, getSeededHeight());
  console.log(`Slope X`, slopeX);
  console.log(`Slope Z`, slopeZ);

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
