import AmmoType from 'ammojs-typed';
declare const Ammo: typeof AmmoType;

import {
  grassColor,
  grassLeftMesh,
  grassRightMesh,
  physicsWorld,
  roadColor,
  roadMesh,
  scene,
  terrainWidth,
  terrainWidthExtents,
} from '../../refs';
import { createRoadShape } from './createRoadShape';
import { createRoadTriangles } from './createRoadTriangles';
import { createRoadPoints } from './createRoadPoints';
import { infoText } from '../UI/info';

export async function initRoad() {
  const vecs = await createRoadPoints();

  infoText.current = 'Finishing up road';

  const { road, grassLeft, grassRight } = await createRoadTriangles(vecs);

  const { rigidBody: roadRigidBody, mesh: localRoad } = createRoadShape(road, roadColor, 0.7);
  const { rigidBody: grassLeftRigidBody, mesh: localGrassLeftMesh } = createRoadShape(
    grassLeft,
    grassColor,
    1
  );
  const { rigidBody: grassRightRigidBody, mesh: localGrassRightMesh } = createRoadShape(
    grassRight,
    grassColor,
    1
  );

  scene.current?.add(localRoad);
  scene.current?.add(localGrassLeftMesh);
  scene.current?.add(localGrassRightMesh);

  roadMesh.current = localRoad;
  grassLeftMesh.current = localGrassLeftMesh;
  grassRightMesh.current = localGrassRightMesh;

  physicsWorld.current?.addRigidBody(roadRigidBody);
  physicsWorld.current?.addRigidBody(grassLeftRigidBody);
  physicsWorld.current?.addRigidBody(grassRightRigidBody);

  infoText.current = '';
}

function toWorldPos(x: number, z: number) {
  const mult = terrainWidthExtents / terrainWidth;
  return [(terrainWidth / 2 - x - 1) * -mult, (terrainWidth / 2 - z) * -mult];
}
