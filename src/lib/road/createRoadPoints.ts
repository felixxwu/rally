import {
  crossingDistance,
  grassColor,
  maxAngle,
  maxAttempts,
  maxPoints,
  nearbyDistance,
  numNeightborsToBlur,
  pointMoveDist,
  roadColor,
  scene,
  terrainDepthExtents,
  terrainMesh,
  terrainWidthExtents,
} from '../../refs';
import { infoText } from '../UI/info';
import { add } from '../utils/addVec';
import { getSpawn } from '../utils/getSpawn';
import { ray } from '../utils/ray';
import { THREE } from '../utils/THREE';
import { createRoadShape, Vector } from './createRoadShape';
import { createRoadTriangles } from './createRoadTriangles';

let temporaryMesh: { road: THREE.Mesh } | null = null;

// let temporaryMesh: { road: THREE.Mesh; grassLeft: THREE.Mesh; grassRight: THREE.Mesh } | null =
//   null;

export async function createRoadPoints() {
  const spawn = getSpawn();
  const vecs: Vector[] = [];
  const longestVecs: Vector[][] = [];
  const point = new THREE.Vector2(spawn.x, spawn.z);
  const roadDir = new THREE.Vector2(0, 1).normalize();

  let expBackoff = 1;

  for (let i = 0; i < maxAttempts; i++) {
    if (vecs.length >= maxPoints) break;
    if (i % 100 === 99) {
      infoText.current = `Generating Road... ${Math.round((i / maxAttempts) * 100)}%`;

      if (temporaryMesh) {
        scene.current?.remove(temporaryMesh.road);
        // scene.current?.remove(temporaryMesh.grassLeft);
        // scene.current?.remove(temporaryMesh.grassRight);
      }

      const { road } = await createRoadTriangles(vecs, true);

      const { mesh: roadMesh } = createRoadShape(road, roadColor, 0.7);
      // const { mesh: grassLeftMesh } = createRoadShape(grassLeft, grassColor, 1);
      // const { mesh: grassRightMesh } = createRoadShape(grassRight, grassColor, 1);
      temporaryMesh = { road: roadMesh };
      // temporaryMesh = { road: roadMesh, grassLeft: grassLeftMesh, grassRight: grassRightMesh };
      scene.current?.add(roadMesh);
      // scene.current?.add(grassLeftMesh);
      // scene.current?.add(grassRightMesh);

      await new Promise(r => setTimeout(r));
    }
    const intersection = ray(
      new THREE.Vector3(point.x, 1000, point.y),
      new THREE.Vector3(0, -1, 0)
    );
    if (!intersection) break;
    const intersectionPoint = intersection.point;
    const newPoint = add(intersectionPoint, [0, 1, 0]);
    vecs.push([newPoint.x, newPoint.y, newPoint.z] as Vector);

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
    const leftIntersection = ray(
      new THREE.Vector3(leftDir.x, 1000, leftDir.y),
      new THREE.Vector3(0, -1, 0)
    )?.point;
    const rightIntersection = ray(
      new THREE.Vector3(rightDir.x, 1000, rightDir.y),
      new THREE.Vector3(0, -1, 0)
    )?.point;

    if (!rightIntersection || !leftIntersection) break;

    const leftHeightDiff = Math.abs(leftIntersection.y - intersectionPoint.y);
    const rightHeightDiff = Math.abs(rightIntersection.y - intersectionPoint.y);

    let crossing = false;
    const nearbyPoints = vecs
      .filter((v, i) => {
        const isLastNearbyVecs = i > vecs.length - nearbyDistance * 1.5;
        const isLastCrossingVecs = i > vecs.length - crossingDistance * 1.5;

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

      for (let i = 0; i < vecs.length; i++) {
        const v = vecs[i];
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
        console.log(
          'Crossing detected, removing ',
          vecs.length - firstPointNearCrossing,
          ' points'
        );
        longestVecs.push([...vecs.slice(0, -50)]);
        const cutoff = Math.max(0, firstPointNearCrossing - expBackoff);
        point.set(vecs[cutoff][0], vecs[cutoff][2]);
        vecs.splice(cutoff, vecs.length - cutoff);
        expBackoff += 20;
      }
    }

    const nearbyPointsSum = nearbyPoints
      .map(v => new THREE.Vector2(v[0], v[2]))
      .reduce((acc, v) => acc.add(point.clone().sub(v)), new THREE.Vector2(0, 0));
    const nearbyPointsInvDir = nearbyPointsSum.clone().normalize();
    const cross = nearbyPointsInvDir.clone().cross(roadDir);

    const closeToMapEdge =
      point.x < -(terrainWidthExtents / 2 - nearbyDistance) ||
      point.x > terrainWidthExtents / 2 - nearbyDistance ||
      point.y < -(terrainDepthExtents / 2 - nearbyDistance) ||
      point.y > terrainDepthExtents / 2 - nearbyDistance;

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

  await new Promise(r => setTimeout(r));

  const longestVec = longestVecs.reduce((acc, v) => (v.length > acc.length ? v : acc), vecs);

  const blurredVecs: Vector[] = [];

  // blurr vec heights
  const half = Math.floor(numNeightborsToBlur / 2);
  for (let i = half; i < longestVec.length - half; i++) {
    const neighbors = longestVec.slice(i - half, i + half + 1);
    const avgY = neighbors.reduce((acc, v) => acc + v[1], 0) / neighbors.length;
    const newY = Math.max(neighbors[half][1], avgY);
    blurredVecs.push([neighbors[half][0], newY, neighbors[half][2]] as Vector);
  }

  if (temporaryMesh) {
    scene.current?.remove(temporaryMesh.road);
    // scene.current?.remove(temporaryMesh.grassLeft);
    // scene.current?.remove(temporaryMesh.grassRight);
  }

  return blurredVecs;
}
