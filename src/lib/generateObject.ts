import AmmoType from 'ammojs-typed'
declare const Ammo: typeof AmmoType

import * as THREE from 'three'
import {
  dynamicObjects,
  physicsWorld,
  scene,
  terrainDepth,
  terrainMaxHeight,
  terrainWidth,
} from '../constant'
import { Mesh } from '../types'

export function generateObject() {
  const numTypes = 4
  const objectType = Math.ceil(Math.random() * numTypes)

  let threeObject: Mesh | null = null
  let shape: AmmoType.btSphereShape | null = null

  const objectSize = 3
  const margin = 0.05

  let radius, height

  switch (objectType) {
    case 1:
      // Sphere
      radius = 1 + Math.random() * objectSize
      threeObject = new THREE.Mesh(new THREE.SphereGeometry(radius, 20, 20), createObjectMaterial())
      shape = new Ammo.btSphereShape(radius)
      shape.setMargin(margin)
      break
    case 2:
      // Box
      const sx = 1 + Math.random() * objectSize
      const sy = 1 + Math.random() * objectSize
      const sz = 1 + Math.random() * objectSize
      threeObject = new THREE.Mesh(
        new THREE.BoxGeometry(sx, sy, sz, 1, 1, 1),
        createObjectMaterial()
      )
      shape = new Ammo.btBoxShape(new Ammo.btVector3(sx * 0.5, sy * 0.5, sz * 0.5))
      shape.setMargin(margin)
      break
    case 3:
      // Cylinder
      radius = 1 + Math.random() * objectSize
      height = 1 + Math.random() * objectSize
      threeObject = new THREE.Mesh(
        new THREE.CylinderGeometry(radius, radius, height, 20, 1),
        createObjectMaterial()
      )
      shape = new Ammo.btCylinderShape(new Ammo.btVector3(radius, height * 0.5, radius))
      shape.setMargin(margin)
      break
    default:
      // Cone
      radius = 1 + Math.random() * objectSize
      height = 2 + Math.random() * objectSize
      threeObject = new THREE.Mesh(
        new THREE.ConeGeometry(radius, height, 20, 2),
        createObjectMaterial()
      )
      shape = new Ammo.btConeShape(radius, height)
      break
  }

  threeObject.position.set(
    (Math.random() - 0.5) * terrainWidth * 0.6,
    terrainMaxHeight + objectSize + 2,
    (Math.random() - 0.5) * terrainDepth * 0.6
  )

  const mass = objectSize * 5
  const localInertia = new Ammo.btVector3(0, 0, 0)
  shape.calculateLocalInertia(mass, localInertia)
  const transform = new Ammo.btTransform()
  transform.setIdentity()
  const pos = threeObject.position
  transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z))
  const motionState = new Ammo.btDefaultMotionState(transform)
  const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia)
  const body = new Ammo.btRigidBody(rbInfo)

  threeObject.userData.physicsBody = body

  threeObject.receiveShadow = true
  threeObject.castShadow = true

  scene.current?.add(threeObject)
  dynamicObjects.push(threeObject)

  physicsWorld.current?.addRigidBody(body)
}

function createObjectMaterial() {
  const c = Math.floor(Math.random() * (1 << 24))
  return new THREE.MeshPhongMaterial({ color: c })
}
