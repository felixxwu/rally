import { terrainHeightExponent, terrainMaxHeight, terrainMinHeight } from '../../refs';
import { createNoiseFunc } from './createNoiseFunc';

export function getSeededHeight(customSeed?: number) {
  const noise = createNoiseFunc(customSeed);
  return (
    (noise(43, 2) * Math.pow(terrainMaxHeight, 1 / terrainHeightExponent)) **
      terrainHeightExponent +
    terrainMinHeight
  );
}
