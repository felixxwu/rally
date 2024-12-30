import AmmoType from 'ammojs-typed';
import { createTerrainShape } from './createTerrainShape';
import { getSeededHeight } from './getSeededHeight';

declare const Ammo: typeof AmmoType;

export function createTerrainRigidBody(heightData: Float32Array) {
  const shape = createTerrainShape(heightData);

  const groundTransform = new Ammo.btTransform();
  groundTransform.setIdentity();
  // Shifts the terrain, since bullet re-centers it on its bounding box.
  groundTransform.setOrigin(new Ammo.btVector3(0, getSeededHeight() / 2, 0));
  const groundMass = 0;
  const groundLocalInertia = new Ammo.btVector3(0, 0, 0);
  const groundMotionState = new Ammo.btDefaultMotionState(groundTransform);
  return new Ammo.btRigidBody(
    new Ammo.btRigidBodyConstructionInfo(groundMass, groundMotionState, shape, groundLocalInertia)
  );
}
