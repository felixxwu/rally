import { THREE } from '../utils/THREE'
import { wheelRadius } from '../wheel/initWheel'
import { getCarDirection } from './getCarDirection'
import { car, carLength, carWidth } from './initCar'

export function getCarRelCorner(front: boolean, left: boolean) {
  const carEnd =
    getCarDirection(
      new THREE.Vector3(0, 0, (carLength / 2 - wheelRadius - 0.1) * (front ? 1 : -1))
    ) || new THREE.Vector3()
  const carSide =
    getCarDirection(new THREE.Vector3((carWidth / 2) * (left ? 1 : -1), 0, 0)) ||
    new THREE.Vector3()

  return carEnd.clone().add(carSide)
}
