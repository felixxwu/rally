import { THREE } from '../utils/THREE'
import { getCarDirection } from './getCarDirection'
import { car, carLength, carWidth } from './initCar'

export function getCarCornerPos(front: boolean, left: boolean) {
  const carPos = car.current?.getWorldPosition(new THREE.Vector3())
  const carEnd =
    getCarDirection(new THREE.Vector3(0, 0, carLength / (front ? 2 : -2))) || new THREE.Vector3()
  const carSide =
    getCarDirection(new THREE.Vector3(carWidth / (left ? 2 : -2), 0, 0)) || new THREE.Vector3()

  return carPos?.clone().add(carEnd).add(carSide) || new THREE.Vector3()
}
