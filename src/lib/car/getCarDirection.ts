import { car } from './initCar'
import { THREE } from '../utils/THREE'

export function getCarDirection(unitVector = new THREE.Vector3(0, 0, 1)) {
  if (!car.current) return unitVector

  car.current.getWorldQuaternion(new THREE.Quaternion())

  const quat = car.current.getWorldQuaternion(new THREE.Quaternion())

  return unitVector.applyQuaternion(quat)
}
