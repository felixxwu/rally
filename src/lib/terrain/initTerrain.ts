import AmmoType from 'ammojs-typed';
declare const Ammo: typeof AmmoType;

import { physicsWorld, scene, terrainMesh } from '../../refs';
import { generateHeight } from './generateHeight';
import { createTerrainRigidBody } from './createTerrainRigidBody';
import { createTerrainMesh } from './createTerrainMesh';

export function initTerrain() {
  const heightData = generateHeight();
  const rigidBody = createTerrainRigidBody(heightData);
  const mesh = createTerrainMesh(heightData);

  physicsWorld.current?.addRigidBody(rigidBody);
  scene.current?.add(mesh);
  terrainMesh.current = mesh;
}
