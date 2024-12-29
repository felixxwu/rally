import { vec3 } from '../utils/createVec';
import { heightData, mapHeightSegments, mapHeight, mapWidthSegments, mapWidth } from '../../refs';

const xPos = (index: number) => (index / (mapWidthSegments - 1) - 0.5) * mapWidth;
const zPos = (index: number) => (index / (mapHeightSegments - 1) - 0.5) * mapHeight;
const hPos = (x: number, z: number) => heightData.current?.[x + z * mapWidthSegments] ?? 0;
const corner = (x: number, z: number) => vec3([xPos(x), hPos(x, z), zPos(z)]);

export function getLocalSquareCorners(
  indexX: number,
  indexZ: number,
  xBias: number,
  yBias: number
) {
  if (heightData.current === null) return [];

  const xOffset = xBias > 0.5 ? 1 : 0;
  const zOffset = yBias > 0.5 ? 1 : 0;

  return [
    corner(indexX + xOffset - 1, indexZ + zOffset - 1),
    corner(indexX + xOffset, indexZ + zOffset - 1),
    corner(indexX + xOffset + 1, indexZ + zOffset - 1),

    corner(indexX + xOffset - 1, indexZ + zOffset),
    corner(indexX + xOffset, indexZ + zOffset),
    corner(indexX + xOffset + 1, indexZ + zOffset),

    corner(indexX + xOffset - 1, indexZ + zOffset + 1),
    corner(indexX + xOffset, indexZ + zOffset + 1),
    corner(indexX + xOffset + 1, indexZ + zOffset + 1),
  ];
}

export function getExactSquareCorners(indexX: number, indexZ: number) {
  if (heightData.current === null) return null;

  return [
    corner(indexX, indexZ),
    corner(indexX + 1, indexZ),
    corner(indexX, indexZ + 1),
    corner(indexX + 1, indexZ + 1),
  ] as const;
}
