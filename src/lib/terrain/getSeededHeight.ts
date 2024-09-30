import { terrainHeightExponent, terrainMaxHeight } from '../../refs';
import { createNoiseFunc } from './createNoiseFunc';

export function getSeededHeight() {
  const noise = createNoiseFunc();
  return (
    (noise(43, 2) * Math.pow(terrainMaxHeight, 1 / terrainHeightExponent)) ** terrainHeightExponent
  );
}
