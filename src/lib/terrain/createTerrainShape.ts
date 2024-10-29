import AmmoType from 'ammojs-typed';
declare const Ammo: typeof AmmoType;

import {
  terrainDepth,
  terrainDepthExtents,
  terrainMinHeight,
  terrainWidth,
  terrainWidthExtents,
} from '../../refs';
import { getSeededHeight } from './getSeededHeight';
import { addSquare } from '../utils/addSquare';

export function createTerrainShape(heightData: Float32Array) {
  const scaleX = terrainWidthExtents / (terrainWidth - 1);
  const scaleZ = terrainDepthExtents / (terrainDepth - 1);
  // This parameter is not really used, since we are using PHY_FLOAT height data type and hence it is ignored
  const heightScale = 1;

  // Up axis = 0 for X, 1 for Y, 2 for Z. Normally 1 = Y is used.
  const upAxis = 1;

  // hdt, height data type. "PHY_FLOAT" is used. Possible values are "PHY_FLOAT", "PHY_UCHAR", "PHY_SHORT"
  const hdt = 'PHY_FLOAT';

  // Set this to your needs (inverts the triangles)
  const flipQuadEdges = false;

  // Creates height data buffer in Ammo heap
  const ammoHeightData = Ammo._malloc(4 * terrainWidth * terrainDepth);

  // Copy the javascript height data array to the Ammo one.
  let p = 0;
  let p2 = 0;

  const triangleMesh = new Ammo.btTriangleMesh();

  for (let j = 0; j < terrainDepth - 1; j++) {
    for (let i = 0; i < terrainWidth - 1; i++) {
      addSquare(
        triangleMesh,
        [
          -(terrainWidthExtents / 2) + i * scaleX,
          getHeightDataXY(i, j, heightData),
          -(terrainDepthExtents / 2) + j * scaleZ,
        ],
        [
          -(terrainWidthExtents / 2) + (i + 1) * scaleX,
          getHeightDataXY(i + 1, j, heightData),
          -(terrainDepthExtents / 2) + j * scaleZ,
        ],
        [
          -(terrainWidthExtents / 2) + (i + 1) * scaleX,
          getHeightDataXY(i + 1, j + 1, heightData),
          -(terrainDepthExtents / 2) + (j + 1) * scaleZ,
        ],
        [
          -(terrainWidthExtents / 2) + i * scaleX,
          getHeightDataXY(i, j + 1, heightData),
          -(terrainDepthExtents / 2) + (j + 1) * scaleZ,
        ]
      );

      // write 32-bit float data to memory

      Ammo.HEAPF32[((ammoHeightData ?? 0) + p2) >> 2] = heightData[p] ?? 0;

      p++;

      // 4 bytes/float
      p2 += 4;
    }
  }

  const shape = new Ammo.btBvhTriangleMeshShape(triangleMesh, true);

  // Creates the heightfield physics shape
  const heightFieldShape = new Ammo.btHeightfieldTerrainShape(
    terrainWidth,
    terrainDepth,
    ammoHeightData,
    heightScale,
    terrainMinHeight,
    getSeededHeight(),
    upAxis,
    hdt,
    flipQuadEdges
  );

  // Set horizontal scale
  heightFieldShape.setLocalScaling(new Ammo.btVector3(scaleX, 1, scaleZ));

  heightFieldShape.setMargin(0.05);

  return shape;
}

function getHeightDataXY(x: number, y: number, heightData: Float32Array) {
  return heightData[y * terrainWidth + x];
}
