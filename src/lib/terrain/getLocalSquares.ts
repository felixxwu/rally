import { THREE } from '../utils/THREE';
import { heightData, mapHeightSegments, mapHeight, mapWidthSegments, mapWidth } from '../../refs';
import { helperArrowFromTo } from '../helperArrows/helperArrow';
import { vec3 } from '../utils/createVec';
import { getLocalSquareCorners } from './getLocalSquareCorners';

export function getLocalSquares(pos: THREE.Vector3) {
  if (heightData.current === null) return [];

  const indexX = Math.floor((pos.x / mapWidth + 0.5) * (mapWidthSegments - 1));
  const indexZ = Math.floor((pos.z / mapHeight + 0.5) * (mapHeightSegments - 1));
  const corners = getLocalSquareCorners(indexX, indexZ);
  for (let i = 0; i < corners.length; i++) {
    const corner = corners[i];
    helperArrowFromTo(corner.clone().add(vec3([0, 5, 0])), corner, 0xffffff, 'squareIndex' + i);
  }

  return corners;
}
