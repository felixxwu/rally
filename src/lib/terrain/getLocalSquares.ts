import { THREE } from '../utils/THREE';
import {
  heightData,
  terrainDepth,
  terrainDepthExtents,
  terrainWidth,
  terrainWidthExtents,
} from '../../refs';
import { helperArrowFromTo } from '../helperArrows/helperArrow';
import { vec3 } from '../utils/createVec';
import { getLocalSquareCorners } from './getLocalSquareCorners';

export function getLocalSquares(pos: THREE.Vector3) {
  if (heightData.current === null) return [];

  const indexX = Math.floor((pos.x / terrainWidthExtents + 0.5) * (terrainWidth - 1));
  const indexZ = Math.floor((pos.z / terrainDepthExtents + 0.5) * (terrainDepth - 1));
  const corners = getLocalSquareCorners(indexX, indexZ);
  for (let i = 0; i < corners.length; i++) {
    const corner = corners[i];
    helperArrowFromTo(corner.clone().add(vec3([0, 5, 0])), corner, 0xffffff, 'squareIndex' + i);
  }

  return corners;
}
