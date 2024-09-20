import AmmoType from 'ammojs-typed'
declare const Ammo: typeof AmmoType

import { physicsWorld, dynamicObjects, transformAux1 } from '../constant'

export function updatePhysics(deltaTime: number) {
  physicsWorld.current?.stepSimulation(deltaTime, 10)

  // Update objects
  for (let i = 0, il = dynamicObjects.length; i < il; i++) {
    const objThree = dynamicObjects[i]
    const objPhys = objThree.userData.physicsBody as AmmoType.btRigidBody
    // objPhys.applyForce(new Ammo.btVector3(40, 0, 0), new Ammo.btVector3(0, 0, 0))
    const ms = objPhys.getMotionState()
    if (ms && transformAux1.current) {
      ms.getWorldTransform(transformAux1.current)
      const p = transformAux1.current?.getOrigin()
      const q = transformAux1.current?.getRotation()
      objThree.position.set(p?.x() ?? 0, p?.y() ?? 0, p?.z() ?? 0)
      objThree.quaternion.set(q?.x() ?? 0, q?.y() ?? 0, q?.z() ?? 0, q?.w() ?? 0)
    }
  }
}
