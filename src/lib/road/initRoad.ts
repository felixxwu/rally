import AmmoType from 'ammojs-typed';
declare const Ammo: typeof AmmoType;

import {
  grassColor,
  grassLeftMesh,
  grassRightMesh,
  infoText,
  onRender,
  physicsWorld,
  roadColor,
  roadMesh,
  scene,
  temporaryMesh,
} from '../../refs';
import { createRoadShape } from './createRoadShape';
import { createRoadTriangles } from './createRoadTriangles';
import { createRoadPoints } from './createRoadPoints';
import { resetIfFarFromRoad } from './resetIfFarFromRoad';
import { setUserData } from '../utils/userData';

export async function initRoad() {
  await createRoadPoints();

  infoText.current = 'Finishing up road';

  const { road, grassLeft, grassRight } = await createRoadTriangles();

  if (temporaryMesh.current) {
    scene.current?.remove(temporaryMesh.current.road);
  }

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

  setUserData(roadMesh.current, { physicsBody: roadRigidBody });
  setUserData(grassLeftMesh.current, { physicsBody: grassLeftRigidBody });
  setUserData(grassRightMesh.current, { physicsBody: grassRightRigidBody });

  physicsWorld.current?.addRigidBody(roadRigidBody);
  physicsWorld.current?.addRigidBody(grassLeftRigidBody);
  physicsWorld.current?.addRigidBody(grassRightRigidBody);

  infoText.current = '';

  onRender.current.push(['resetIfFarFromRoad', resetIfFarFromRoad]);
}
