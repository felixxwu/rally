import { THREE } from '../utils/THREE'
import { car, oldCarPosition } from './initCar'

export function getDirectionOfTravel() {
  const pos = car.current?.getWorldPosition(new THREE.Vector3())
  const oldPos = oldCarPosition.current

  if (!oldPos || !pos) return new THREE.Vector3()

  const diff = pos?.clone().sub(oldPos || new THREE.Vector3()) || new THREE.Vector3()

  return diff.clone()
}
