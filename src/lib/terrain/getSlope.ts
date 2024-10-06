import { maxTerrainSlopeX, maxTerrainSlopeZ } from '../../refs';
import { createNoiseFunc } from './createNoiseFunc';

export function getSlope() {
  const noise = createNoiseFunc();
  const slopeX = ((noise(43, 45) * 2 - 1) * Math.sqrt(maxTerrainSlopeX)) ** 2;
  const slopeZ = ((noise(3, 65) * 2 - 1) * Math.sqrt(maxTerrainSlopeZ)) ** 2;

  return { slopeX, slopeZ };
}
