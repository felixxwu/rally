import AmmoType from 'ammojs-typed'
declare const Ammo: typeof AmmoType

import { keysDown } from '../initWindowListeners'
import { updatePhysics } from '../physics/updatePhysics'
import { THREE } from '../utils/THREE'
import { getUserData } from '../utils/userData'
import { car, oldCarPosition } from './initCar'
import { getCarDirection } from './getCarDirection'
import { getAmmoVector } from '../utils/vectorConversion'

export const enginePower = 300
export const steerPower = 500

export function updateCar() {
  if (!car.current) return

  const objPhys = getUserData(car.current).physicsBody
  const carForce = new THREE.Vector3()
  const carTorque = new THREE.Vector3()
  const carPos = car.current.getWorldPosition(new THREE.Vector3())
  const direction = getCarDirection() || new THREE.Vector3()
  oldCarPosition.current = carPos.clone()

  if (keysDown.w) {
    carForce.add(direction.clone().multiplyScalar(enginePower))
  }

  if (keysDown.s) {
    carForce.add(direction.clone().multiplyScalar(-enginePower))
  }

  if (keysDown.a) {
    carTorque.add(new THREE.Vector3(0, steerPower, 0))
  }

  if (keysDown.d) {
    carTorque.add(new THREE.Vector3(0, -steerPower, 0))
  }

  objPhys?.applyCentralForce(getAmmoVector(carForce))
  objPhys?.applyLocalTorque(getAmmoVector(carTorque))

  updatePhysics(car.current)
}
