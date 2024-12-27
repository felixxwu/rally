import { mapHeight, mapWidth } from '../../refs';
import { createNoiseFunc } from '../terrain/createNoiseFunc';
import { THREE } from './THREE';

export function getSpawn() {
  const noise = createNoiseFunc();

  return new THREE.Vector3(
    (mapWidth / 2 - noise(7, 13) * mapWidth) * 0.6,
    200,
    (mapHeight / 2 - noise(17, 19) * mapHeight) * 0.6
  );
}
