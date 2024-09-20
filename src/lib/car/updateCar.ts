import AmmoType from 'ammojs-typed'
declare const Ammo: typeof AmmoType

import { keysDown } from '../initWindowListeners'
import { updatePhysics } from '../physics/updatePhysics'
import { THREE } from '../utils/THREE'
import { getUserData } from '../utils/userData'
import { car, oldCarPosition } from './initCar'
import { getCarDirection } from './getCarDirection'
import { getAmmoVector } from '../utils/vectorConversion'

const enginePower = 300
const steerPower = 100

export function updateCar() {
  if (!car.current) return

  const carPos = car.current.getWorldPosition(new THREE.Vector3())
  oldCarPosition.current = carPos.clone()

  const direction = getCarDirection() || new THREE.Vector3()

  if (keysDown.w) {
    const objPhys = getUserData(car.current).physicsBody
    objPhys?.applyForce(
      getAmmoVector(direction.clone().multiplyScalar(enginePower)),
      new Ammo.btVector3(0, 0, 0)
    )
  }

  if (keysDown.s) {
    const objPhys = getUserData(car.current).physicsBody
    objPhys?.applyForce(
      getAmmoVector(direction.clone().multiplyScalar(-enginePower)),
      new Ammo.btVector3(0, 0, 0)
    )
  }

  if (keysDown.a) {
    const objPhys = getUserData(car.current).physicsBody
    objPhys?.applyTorque(getAmmoVector(new THREE.Vector3(0, steerPower, 0)))
  }

  if (keysDown.d) {
    const objPhys = getUserData(car.current).physicsBody
    objPhys?.applyTorque(getAmmoVector(new THREE.Vector3(0, -steerPower, 0)))
  }

  updatePhysics(car.current)
}
