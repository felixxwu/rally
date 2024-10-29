import AmmoType from 'ammojs-typed';
import { createTerrainShape } from './createTerrainShape';
declare const Ammo: typeof AmmoType;

export function createTerrainRigidBody(heightData: Float32Array) {
  const shape = createTerrainShape(heightData);

  const groundTransform = new Ammo.btTransform();
  groundTransform.setIdentity();
  const groundMass = 0;
  const groundLocalInertia = new Ammo.btVector3(0, 0, 0);
  const groundMotionState = new Ammo.btDefaultMotionState(groundTransform);
  const groundBody = new Ammo.btRigidBody(
    new Ammo.btRigidBodyConstructionInfo(groundMass, groundMotionState, shape, groundLocalInertia)
  );

  return groundBody;
}
