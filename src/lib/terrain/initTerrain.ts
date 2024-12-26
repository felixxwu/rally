import { heightData, physicsWorld, scene, terrainMesh } from '../../refs';
import { generateHeight } from './generateHeight';
import { createTerrainRigidBody } from './createTerrainRigidBody';
import { createTerrainMesh } from './createTerrainMesh';
import { setUserData } from '../utils/userData';

export function initTerrain() {
  heightData.current = generateHeight();
  const rigidBody = createTerrainRigidBody(heightData.current);
  const mesh = createTerrainMesh(heightData.current);

  setUserData(mesh, { physicsBody: rigidBody });

  physicsWorld.current?.addRigidBody(rigidBody);
  scene.current?.add(mesh);
  terrainMesh.current = mesh;
}
