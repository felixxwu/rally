import { terrainDepthExtents, terrainWidthExtents } from '../../refs';
import { createNoiseFunc } from '../terrain/createNoiseFunc';
import { THREE } from './THREE';

export function getSpawn() {
  const noise = createNoiseFunc();

  return new THREE.Vector3(
    (terrainWidthExtents / 2 - noise(7, 13) * terrainWidthExtents) * 0.6,
    200,
    (terrainDepthExtents / 2 - noise(17, 19) * terrainDepthExtents) * 0.6
  );
}
