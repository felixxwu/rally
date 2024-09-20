import AmmoType from 'ammojs-typed'
declare const Ammo: typeof AmmoType

import {
  constant,
  dynamicObjects,
  onRender,
  physicsWorld,
  scene,
  terrainDepth,
  terrainMaxHeight,
  terrainWidth,
} from '../../constant'
import { setUserData } from '../utils/userData'
import { Mesh } from '../../types'
import { updateCar } from './updateCar'
import { THREE } from '../utils/THREE'

export const car = constant<Mesh | null>(null)
export const oldCarPosition = constant<THREE.Vector3 | null>(null)

export function initCar() {
  const sx = 3
  const sy = 2
  const sz = 5
  const wheelRadius = 1
  car.current = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz, 1, 1, 1), createObjectMaterial())
  const shape = new Ammo.btCompoundShape()

  const wheel1Transform = new Ammo.btTransform()
  wheel1Transform.setOrigin(new Ammo.btVector3(-sx * 0.5, 0, -sz * 0.5))
  shape.addChildShape(wheel1Transform, new Ammo.btSphereShape(wheelRadius))

  const wheel2Transform = new Ammo.btTransform()
  wheel2Transform.setOrigin(new Ammo.btVector3(sx * 0.5, 0, -sz * 0.5))
  shape.addChildShape(wheel2Transform, new Ammo.btSphereShape(wheelRadius))

  const wheel3Transform = new Ammo.btTransform()
  wheel3Transform.setOrigin(new Ammo.btVector3(-sx * 0.5, 0, sz * 0.5))
  shape.addChildShape(wheel3Transform, new Ammo.btSphereShape(wheelRadius))

  const wheel4Transform = new Ammo.btTransform()
  wheel4Transform.setOrigin(new Ammo.btVector3(sx * 0.5, 0, sz * 0.5))
  shape.addChildShape(wheel4Transform, new Ammo.btSphereShape(wheelRadius))

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

  setUserData(car.current, { physicsBody: body })

  car.current.receiveShadow = true
  car.current.castShadow = true

  scene.current?.add(car.current)
  dynamicObjects.push(car.current)

  physicsWorld.current?.addRigidBody(body)

  onRender.push(updateCar)
}

function createObjectMaterial() {
  const c = Math.floor(Math.random() * (1 << 24))
  return new THREE.MeshPhongMaterial({ color: c })
}
