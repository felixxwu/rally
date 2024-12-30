import { getSeededHeight } from './getSeededHeight';
import { terrainMaxHeight, terrainMinHeight } from '../../refs';

export function categoriseSeedHeight(customSeed?: number) {
  const height = getSeededHeight(customSeed);
  const min = terrainMinHeight;
  const max = terrainMaxHeight;

  if (height < min + (max - min) / 3) {
    return 'Flat';
  }
  if (height < min + (2 * (max - min)) / 3) {
    return 'Hilly';
  }
  return 'Very Hilly';
}
