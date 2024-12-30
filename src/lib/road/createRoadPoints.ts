import {
  crossingDistance,
  maxAngle,
  maxAttempts,
  maxPoints,
  nearbyDistance,
  verticalRoadSmoothing,
  horizontalRoadSmoothing,
  pointMoveDist,
  roadVecs,
  startRoadLength,
  mapHeight,
  mapWidth,
  maxIncline,
} from '../../refs';
import { getSpawn } from '../utils/getSpawn';
import { THREE } from '../utils/THREE';
import { Vector } from './createRoadShape';
import { vec3 } from '../utils/createVec';
import { getHeightAt } from '../terrain/generateHeight';
import { getExactSquare, intersectWithSquare } from '../terrain/getLocalSquares';
import { setInfoText } from '../UI/setInfoText';

export async function createRoadPoints() {
  const spawn = getSpawn();
  const longestVecs: Vector[][] = [];
  const point = new THREE.Vector2(spawn.x, spawn.z - 30);
  const roadDir = new THREE.Vector2(0, 1).normalize();

  let backoff = 1;

  for (let i = 0; i < maxAttempts; i++) {
    if (roadVecs.current.length >= maxPoints) break;
    if (i % 100 === 0) {
      roadVecs.current = [...roadVecs.current];
      setInfoText(`Generating Road... ${Math.round((i / maxAttempts) * 100)}%`);

      await new Promise(r => setTimeout(r));
    }
    const intersectionPoint = vec3([point.x, getHeightAt(point.x, point.y), point.y]);
    roadVecs.current.push([
      intersectionPoint.x,
      intersectionPoint.y,
      intersectionPoint.z,
    ] as Vector);

    const leftDir = point
      .clone()
      .add(
        roadDir
          .clone()
          .multiplyScalar(pointMoveDist)
          .rotateAround(new THREE.Vector2(0, 0), -maxAngle)
      );
    const rightDir = point
      .clone()
      .add(
        roadDir
          .clone()
          .multiplyScalar(pointMoveDist)
          .rotateAround(new THREE.Vector2(0, 0), maxAngle)
      );
    const leftIntersection = vec3([leftDir.x, getHeightAt(leftDir.x, leftDir.y), leftDir.y]);
    const rightIntersection = vec3([rightDir.x, getHeightAt(rightDir.x, rightDir.y), rightDir.y]);

    if (!rightIntersection || !leftIntersection) break;

    const leftHeightDiff = Math.abs(leftIntersection.y - intersectionPoint.y);
    const rightHeightDiff = Math.abs(rightIntersection.y - intersectionPoint.y);

    let crossing = false;
    const nearbyPoints = roadVecs.current
      .filter((v, i) => {
        const isLastNearbyVecs = i > roadVecs.current.length - nearbyDistance * 1.5;
        const isLastCrossingVecs = i > roadVecs.current.length - crossingDistance * 1.5;

        if (
          !isLastCrossingVecs &&
          v[0] > point.x - crossingDistance &&
          v[0] < point.x + crossingDistance &&
          v[2] > point.y - crossingDistance &&
          v[2] < point.y + crossingDistance
        ) {
          crossing = true;
        }

        if (isLastNearbyVecs) {
          return null;
        }

        return (
          v[0] > point.x - nearbyDistance &&
          v[0] < point.x + nearbyDistance &&
          v[2] > point.y - nearbyDistance &&
          v[2] < point.y + nearbyDistance
        );
      })
      .filter(v => v);

    if (crossing) {
      let firstPointNearCrossing: number | undefined;

      for (let i = 0; i < roadVecs.current.length; i++) {
        const v = roadVecs.current[i];
        if (
          v[0] > point.x - crossingDistance &&
          v[0] < point.x + crossingDistance &&
          v[2] > point.y - crossingDistance &&
          v[2] < point.y + crossingDistance
        ) {
          firstPointNearCrossing = i;
          break;
        }
      }

      if (firstPointNearCrossing) {
        longestVecs.push([...roadVecs.current.slice(0, -50)]);
        const cutoff = Math.max(startRoadLength * 2, firstPointNearCrossing - backoff);
        point.set(roadVecs.current[cutoff][0], roadVecs.current[cutoff][2]);
        roadVecs.current.splice(cutoff, roadVecs.current.length - cutoff);
        backoff += 1;
      }
    }

    // start of road
    if (i < startRoadLength) {
      point.add(roadDir.clone().multiplyScalar(pointMoveDist));
      continue;
    }

    const closeToMapEdge =
      point.x < -(mapWidth / 2 - nearbyDistance * 1.5) ||
      point.x > mapWidth / 2 - nearbyDistance * 1.5 ||
      point.y < -(mapHeight / 2 - nearbyDistance * 1.5) ||
      point.y > mapHeight / 2 - nearbyDistance * 1.5;

    if (closeToMapEdge) {
      const crossToCenter = roadDir.clone().cross(point.clone().normalize());
      if (crossToCenter > 0) {
        roadDir.rotateAround(new THREE.Vector2(0, 0), -maxAngle);
      } else {
        roadDir.rotateAround(new THREE.Vector2(0, 0), maxAngle);
      }

      point.add(roadDir.clone().multiplyScalar(pointMoveDist));
      continue;
    }

    const nearbyPointsSum = nearbyPoints
      .map(v => new THREE.Vector2(v[0], v[2]))
      .reduce((acc, v) => acc.add(point.clone().sub(v)), new THREE.Vector2(0, 0));
    const nearbyPointsInvDir = nearbyPointsSum.clone().normalize();
    const cross = nearbyPointsInvDir.clone().cross(roadDir);

    // nearby points detected
    if (cross !== 0) {
      if (cross > 0) {
        roadDir.rotateAround(new THREE.Vector2(0, 0), -maxAngle);
      } else {
        roadDir.rotateAround(new THREE.Vector2(0, 0), maxAngle);
      }

      point.add(roadDir.clone().multiplyScalar(pointMoveDist));
      continue;
    }

    if (leftHeightDiff < rightHeightDiff) {
      roadDir.rotateAround(new THREE.Vector2(0, 0), -maxAngle);
    } else {
      roadDir.rotateAround(new THREE.Vector2(0, 0), maxAngle);
    }
    point.add(roadDir.clone().multiplyScalar(pointMoveDist));
  }

  const longestVec = longestVecs.reduce(
    (acc, v) => (v.length > acc.length ? v : acc),
    roadVecs.current
  );

  // blur vec heights
  const blurredVecs: Vector[] = [];
  const half = Math.floor(horizontalRoadSmoothing / 2);
  for (let i = 0; i < longestVec.length; i++) {
    const neighbors = longestVec.slice(
      Math.max(1, i - half),
      Math.min(longestVec.length - 2, i + half + 1)
    );
    const avgX = neighbors.reduce((acc, n) => acc + n[0], 0) / neighbors.length;
    const avgZ = neighbors.reduce((acc, n) => acc + n[2], 0) / neighbors.length;

    const point = vec3([avgX, 0, avgZ]);
    const square = getExactSquare(point);
    const intersection = intersectWithSquare(point, square);
    blurredVecs.push([avgX, intersection?.y ?? 0, avgZ] as Vector);

    if (i % 100 === 0) {
      setInfoText(`Smoothing road... ${Math.round((i / longestVec.length) * 100)}%`);
      await new Promise(r => setTimeout(r));
    }
  }

  // smooth out sharp inclines
  for (let i = blurredVecs.length - 1; i > 1; i--) {
    const diff = blurredVecs[i - 1][1] - blurredVecs[i][1];
    if (diff < -maxIncline) {
      blurredVecs[i - 1][1] = blurredVecs[i][1] - maxIncline;
    }
  }

  const halfHeight = Math.floor(verticalRoadSmoothing / 2);
  const maxNeighborHeightVecs: Vector[] = [];
  for (let i = 0; i < blurredVecs.length; i++) {
    const neighbors = blurredVecs.slice(
      Math.max(1, i - halfHeight),
      Math.min(blurredVecs.length - 2, i + halfHeight + 1)
    );

    let j = 0;
    const { maxNeighborY } = neighbors.reduce(
      (acc, n) => {
        if (n[1] > acc.maxNeighborY) {
          acc.maxNeighborY = n[1];
          acc.index = j;
        }
        j++;
        return acc;
      },
      { maxNeighborY: -Infinity, index: -1 }
    );

    maxNeighborHeightVecs.push([blurredVecs[i][0], maxNeighborY, blurredVecs[i][2]]);
  }

  const blurredHeightVecs: Vector[] = [];
  for (let i = 0; i < blurredVecs.length; i++) {
    const neighbors = maxNeighborHeightVecs.slice(
      Math.max(1, i - halfHeight),
      Math.min(maxNeighborHeightVecs.length - 2, i + halfHeight + 1)
    );
    const avgY = neighbors.reduce((acc, n) => acc + n[1], 0) / neighbors.length;
    blurredHeightVecs.push([blurredVecs[i][0], avgY + 0.5, blurredVecs[i][2]]);
  }

  // make start and end all the same height
  const highestStartPoint = blurredHeightVecs
    .slice(0, startRoadLength)
    .reduce((acc, v) => Math.max(acc, v[1]), 0);
  const highestEndPoint = blurredHeightVecs
    .slice(-startRoadLength)
    .reduce((acc, v) => Math.max(acc, v[1]), 0);

  for (let i = 0; i < blurredHeightVecs.length; i++) {
    if (i < startRoadLength) {
      blurredHeightVecs[i][1] = highestStartPoint;
    } else if (i > blurredHeightVecs.length - startRoadLength) {
      blurredHeightVecs[i][1] = highestEndPoint;
    } else if (i >= startRoadLength && i < startRoadLength * 2) {
      // create ramp up
      const diff = highestStartPoint - blurredHeightVecs[i][1];
      blurredHeightVecs[i][1] += Math.max(0, (diff * (startRoadLength * 2 - i)) / startRoadLength);
    } else if (
      i <= blurredHeightVecs.length - startRoadLength &&
      i > blurredHeightVecs.length - startRoadLength * 2
    ) {
      // create ramp down
      const diff = highestEndPoint - blurredHeightVecs[i][1];
      blurredHeightVecs[i][1] += Math.max(
        0,
        (diff * (i - (blurredHeightVecs.length - startRoadLength * 2))) / startRoadLength
      );
    }
  }

  roadVecs.current = blurredHeightVecs;
}
