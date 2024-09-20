import { THREE } from '../utils/THREE'
import { getCarDirection } from './getCarDirection'
import { car, carLength, carWidth } from './initCar'

export function getCarRelCorner(front: boolean, left: boolean) {
  const carEnd =
    getCarDirection(new THREE.Vector3(0, 0, carLength / (front ? 2 : -2))) || new THREE.Vector3()
  const carSide =
    getCarDirection(new THREE.Vector3(carWidth / (left ? 2 : -2), 0, 0)) || new THREE.Vector3()

  return carEnd.clone().add(carSide)
}
