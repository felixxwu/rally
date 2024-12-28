import { THREE } from '../utils/THREE';
import { heightData, mapHeight, mapHeightSegments, mapWidth, mapWidthSegments } from '../../refs';
import { helperArrowFromTo } from '../helperArrows/helperArrow';
import { vec3 } from '../utils/createVec';
import { getExactSquareCorners, getLocalSquareCorners } from './getLocalSquareCorners';

export function getLocalSquares(pos: THREE.Vector3) {
  if (heightData.current === null) return [];

  const indexX = Math.floor((pos.x / mapWidth + 0.5) * (mapWidthSegments - 1));
  const indexZ = Math.floor((pos.z / mapHeight + 0.5) * (mapHeightSegments - 1));
  const corners = getLocalSquareCorners(indexX, indexZ);
  for (let i = 0; i < corners.length; i++) {
    const corner = corners[i];
    helperArrowFromTo(corner.clone().add(vec3([0, 5, 0])), corner, 0xff00ff, 'squareIndex' + i);
  }

  return corners;
}

export function getExactSquare(pos: THREE.Vector3) {
  if (heightData.current === null) return null;

  const indexX = Math.floor((pos.x / mapWidth + 0.5) * (mapWidthSegments - 1));
  const indexZ = Math.floor((pos.z / mapHeight + 0.5) * (mapHeightSegments - 1));
  return getExactSquareCorners(indexX, indexZ);
}

export function intersectWithSquare(pos: THREE.Vector3, square: ReturnType<typeof getExactSquare>) {
  if (square === null) return null;

  const topLeft = square[0];
  const topRight = square[1];
  const bottomLeft = square[2];
  const bottomRight = square[3];

  // 0 means pos is on the left side of the square
  // 1 means pos is on the right side of the square
  const xBias = (pos.x - topLeft.x) / (topRight.x - topLeft.x);
  const yBias = (pos.z - topLeft.z) / (bottomLeft.z - topLeft.z);

  const weightedAverageY =
    topLeft.y * (1 - xBias) * (1 - yBias) +
    topRight.y * xBias * (1 - yBias) +
    bottomLeft.y * (1 - xBias) * yBias +
    bottomRight.y * xBias * yBias;

  return vec3([pos.x, weightedAverageY, pos.z]);
}
