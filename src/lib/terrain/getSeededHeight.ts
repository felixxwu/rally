import { terrainMaxHeight } from '../../refs';
import { createNoiseFunc } from './createNoiseFunc';

export function getSeededHeight() {
  const noise = createNoiseFunc();
  return noise(43, 2) * terrainMaxHeight;
}
