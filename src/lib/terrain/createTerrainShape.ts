import AmmoType from 'ammojs-typed';
declare const Ammo: typeof AmmoType;

import { mapHeightSegments, mapHeight, mapWidthSegments, mapWidth } from '../../refs';
import { getSeededHeight } from './getSeededHeight';

export function createTerrainShape(heightData: Float32Array) {
  // This parameter is not really used, since we are using PHY_FLOAT height data type and hence it is ignored
  const heightScale = 1;

  // Up axis = 0 for X, 1 for Y, 2 for Z. Normally 1 = Y is used.
  const upAxis = 1;

  // hdt, height data type. "PHY_FLOAT" is used. Possible values are "PHY_FLOAT", "PHY_UCHAR", "PHY_SHORT"
  const hdt = 'PHY_FLOAT';

  // Set this to your needs (inverts the triangles)
  const flipQuadEdges = false;

  // Creates height data buffer in Ammo heap
  const ammoHeightData = Ammo._malloc(4 * mapWidthSegments * mapHeightSegments);

  // Copy the javascript height data array to the Ammo one.
  let p = 0;
  let p2 = 0;

  for (let j = 0; j < mapHeightSegments; j++) {
    for (let i = 0; i < mapWidthSegments; i++) {
      // write 32-bit float data to memory

      Ammo.HEAPF32[((ammoHeightData ?? 0) + p2) >> 2] = heightData[p] ?? 0;

      p++;

      // 4 bytes/float
      p2 += 4;
    }
  }

  // Creates the heightfield physics shape
  const heightFieldShape = new Ammo.btHeightfieldTerrainShape(
    mapWidthSegments,
    mapHeightSegments,
    ammoHeightData,
    heightScale,
    0,
    getSeededHeight(),
    upAxis,
    hdt,
    flipQuadEdges
  );

  // Set horizontal scale
  const scaleX = mapWidth / (mapWidthSegments - 1);
  const scaleZ = mapHeight / (mapHeightSegments - 1);
  heightFieldShape.setLocalScaling(new Ammo.btVector3(scaleX, 1, scaleZ));

  heightFieldShape.setMargin(0.05);

  return heightFieldShape;
}
