import AmmoType from 'ammojs-typed'
declare const Ammo: typeof AmmoType

import * as THREE from 'three'
import {
  car,
  dynamicObjects,
  physicsWorld,
  scene,
  terrainDepth,
  terrainMaxHeight,
  terrainWidth,
} from '../../constant'

export function initCar() {
  const sx = 3
  const sy = 2
  const sz = 5
  car.current = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz, 1, 1, 1), createObjectMaterial())
  const shape = new Ammo.btBoxShape(new Ammo.btVector3(sx * 0.5, sy * 0.5, sz * 0.5))
  shape.setMargin(0.05)

  car.current.position.set(
    (Math.random() - 0.5) * terrainWidth * 0.6,
    terrainMaxHeight + 10,
    (Math.random() - 0.5) * terrainDepth * 0.6
  )

  const mass = 15
  const localInertia = new Ammo.btVector3(0, 0, 0)
  shape.calculateLocalInertia(mass, localInertia)
  const transform = new Ammo.btTransform()
  transform.setIdentity()
  const pos = car.current.position
  transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z))
  const motionState = new Ammo.btDefaultMotionState(transform)

  const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia)
  const body = new Ammo.btRigidBody(rbInfo)

  car.current.userData.physicsBody = body

  car.current.receiveShadow = true
  car.current.castShadow = true

  scene.current?.add(car.current)
  dynamicObjects.push(car.current)

  physicsWorld.current?.addRigidBody(body)
}

function createObjectMaterial() {
  const c = Math.floor(Math.random() * (1 << 24))
  return new THREE.MeshPhongMaterial({ color: c })
}
