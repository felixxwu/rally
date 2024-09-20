import AmmoType from 'ammojs-typed'
declare const Ammo: typeof AmmoType

import { createTerrainShape } from '../terrain/createTerrainShape'
import {
  broadphase,
  collisionConfiguration,
  dispatcher,
  onRender,
  physicsWorld,
  solver,
  terrainMaxHeight,
  terrainMinHeight,
  transformAux1,
} from '../../constant'
import { updatePhysics } from './updatePhysics'

export function initPhysics() {
  // Physics configuration
  collisionConfiguration.current = new Ammo.btDefaultCollisionConfiguration()
  dispatcher.current = new Ammo.btCollisionDispatcher(collisionConfiguration.current)
  broadphase.current = new Ammo.btDbvtBroadphase()
  solver.current = new Ammo.btSequentialImpulseConstraintSolver()
  physicsWorld.current = new Ammo.btDiscreteDynamicsWorld(
    dispatcher.current,
    broadphase.current,
    solver.current,
    collisionConfiguration.current
  )
  physicsWorld.current.setGravity(new Ammo.btVector3(0, -10, 0))

  // Create the terrain body
  const groundShape = createTerrainShape()
  const groundTransform = new Ammo.btTransform()
  groundTransform.setIdentity()
  // Shifts the terrain, since bullet re-centers it on its bounding box.
  groundTransform.setOrigin(new Ammo.btVector3(0, (terrainMaxHeight + terrainMinHeight) / 2, 0))
  const groundMass = 0
  const groundLocalInertia = new Ammo.btVector3(0, 0, 0)
  const groundMotionState = new Ammo.btDefaultMotionState(groundTransform)
  const groundBody = new Ammo.btRigidBody(
    new Ammo.btRigidBodyConstructionInfo(
      groundMass,
      groundMotionState,
      groundShape,
      groundLocalInertia
    )
  )
  physicsWorld.current.addRigidBody(groundBody)

  transformAux1.current = new Ammo.btTransform()

  onRender.push(deltaTime => {
    physicsWorld.current?.stepSimulation(deltaTime, 10)
  })
}
