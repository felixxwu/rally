import AmmoType from 'ammojs-typed'
declare const Ammo: typeof AmmoType

import {
  clock,
  dynamicObjects,
  maxNumObjects,
  time,
  timeNextSpawn,
  objectTimePeriod,
  renderer,
  scene,
  camera,
} from '../constant'
import { generateObject } from './generateObject'
import { updatePhysics } from './updatePhysics'

export function render() {
  const deltaTime = clock.getDelta()

  if (dynamicObjects.length < maxNumObjects && time.current > timeNextSpawn.current) {
    generateObject()
    timeNextSpawn.current = time.current + objectTimePeriod
  }

  const obj = dynamicObjects[0]
  if (obj) {
    const physicsBody = obj.userData.physicsBody as AmmoType.btRigidBody
    const WorldTransform = physicsBody.getWorldTransform()
    // console.log(`WorldTransform.getOrigin().x()`, WorldTransform.getOrigin().x())

    camera.current?.position.set(
      WorldTransform.getOrigin().x(),
      WorldTransform.getOrigin().y() + 50,
      WorldTransform.getOrigin().z() + 50
    )
    camera.current?.lookAt(
      WorldTransform.getOrigin().x(),
      WorldTransform.getOrigin().y(),
      WorldTransform.getOrigin().z()
    )
    // camera.current?.translateX(WorldTransform.getOrigin().x())
    // camera.current?.translateY(WorldTransform.getOrigin().y() + 10)
    // camera.current?.translateZ(WorldTransform.getOrigin().z())
    // console.log(`physicsBody`, physicsBody)
  }

  updatePhysics(deltaTime)

  renderer.current?.render(scene.current!, camera.current!)

  time.current += deltaTime
}
