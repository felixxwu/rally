import AmmoType from 'ammojs-typed';
declare const Ammo: typeof AmmoType;

import {
  broadphase,
  collisionConfiguration,
  dispatcher,
  fps,
  gravity,
  physicsWorld,
  solver,
  transformAux1,
} from '../../refs';
import { addOnRenderListener } from '../render/addOnRenderListener';

// Fixed timestep for consistent physics regardless of frame rate
const MAX_ACCUMULATED_TIME = 0.25; // Cap accumulated time to prevent spiral of death
let accumulatedTime = 0;

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

  addOnRenderListener('physics', deltaTime => {
    if (!physicsWorld.current) return;

    // Calculate fixed timestep dynamically in case fps changes
    const fixedTimeStep = 1 / fps.current;

    // Accumulate time and step physics in fixed increments
    accumulatedTime += deltaTime;

    // Cap accumulated time to prevent spiral of death when frame rate is very low
    if (accumulatedTime > MAX_ACCUMULATED_TIME) {
      accumulatedTime = MAX_ACCUMULATED_TIME;
    }

    // Step physics in fixed timestep increments
    while (accumulatedTime >= fixedTimeStep) {
      physicsWorld.current.stepSimulation(fixedTimeStep, 10);
      accumulatedTime -= fixedTimeStep;
    }
  });
}
