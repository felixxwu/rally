import { THREE } from '../utils/THREE'
import { getCarRelCorner } from './getCarRelCorner'
import { car } from './initCar'

export function getCarCornerPos(front: boolean, left: boolean) {
  const carPos = car.current?.getWorldPosition(new THREE.Vector3())
  return carPos?.clone().add(getCarRelCorner(front, left)) || new THREE.Vector3()
}
