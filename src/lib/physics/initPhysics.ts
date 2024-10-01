import AmmoType from 'ammojs-typed';
declare const Ammo: typeof AmmoType;

import {
  broadphase,
  collisionConfiguration,
  dispatcher,
  gravity,
  onRender,
  physicsWorld,
  solver,
  transformAux1,
} from '../../refs';

export function initPhysics() {
  // Physics configuration
  collisionConfiguration.current = new Ammo.btDefaultCollisionConfiguration();
  dispatcher.current = new Ammo.btCollisionDispatcher(collisionConfiguration.current);
  broadphase.current = new Ammo.btDbvtBroadphase();
  solver.current = new Ammo.btSequentialImpulseConstraintSolver();
  physicsWorld.current = new Ammo.btDiscreteDynamicsWorld(
    dispatcher.current,
    broadphase.current,
    solver.current,
    collisionConfiguration.current
  );
  physicsWorld.current.setGravity(new Ammo.btVector3(0, -gravity, 0));

  transformAux1.current = new Ammo.btTransform();

  onRender.current.push(deltaTime => {
    physicsWorld.current?.stepSimulation(deltaTime, 10, 1 / 120);
  });
}
