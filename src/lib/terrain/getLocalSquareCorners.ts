import { vec3 } from '../utils/createVec';
import {
  heightData,
  terrainDepth,
  terrainDepthExtents,
  terrainWidth,
  terrainWidthExtents,
} from '../../refs';

export function getLocalSquareCorners(indexX: number, indexZ: number) {
  if (heightData.current === null) return [];

  const xPos = (index: number) => (index / (terrainWidth - 1) - 0.5) * terrainWidthExtents;
  const zPos = (index: number) => (index / (terrainDepth - 1) - 0.5) * terrainDepthExtents;
  const hPos = (x: number, z: number) => heightData.current?.[x + z * terrainWidth] ?? 0;

  const corner = (x: number, z: number) => vec3([xPos(x), hPos(x, z), zPos(z)]);

  return [
    corner(indexX - 1, indexZ - 1),
    corner(indexX, indexZ - 1),
    corner(indexX + 1, indexZ - 1),
    corner(indexX + 2, indexZ - 1),

    corner(indexX - 1, indexZ),
    corner(indexX, indexZ),
    corner(indexX + 1, indexZ),
    corner(indexX + 2, indexZ),

    corner(indexX - 1, indexZ + 1),
    corner(indexX, indexZ + 1),
    corner(indexX + 1, indexZ + 1),
    corner(indexX + 2, indexZ + 1),

    corner(indexX - 1, indexZ + 2),
    corner(indexX, indexZ + 2),
    corner(indexX + 1, indexZ + 2),
    corner(indexX + 2, indexZ + 2),
  ];
}
