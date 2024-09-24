import AmmoType from 'ammojs-typed';
declare const Ammo: typeof AmmoType;

import { physicsWorld, roadMesh, scene, terrainWidth, terrainWidthExtents } from '../../refs';
import { createRoadShape } from './createRoadShape';
import { createRoadTriangles } from './createRoadTriangles';
import { createRoadPoints } from './createRoadPoints';
import { infoText } from '../UI/info';

export async function initRoad() {
  const vecs = await createRoadPoints();

  infoText.current = 'Finishing up road';

  const triangles = createRoadTriangles(vecs);

  const { rigidBody, mesh } = createRoadShape(triangles);
  scene.current?.add(mesh);
  roadMesh.current = mesh;
  physicsWorld.current?.addRigidBody(rigidBody);

  infoText.current = '';
}

function toWorldPos(x: number, z: number) {
  const mult = terrainWidthExtents / terrainWidth;
  return [(terrainWidth / 2 - x - 1) * -mult, (terrainWidth / 2 - z) * -mult];
}
