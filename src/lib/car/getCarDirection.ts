import { car } from './initCar'
import { THREE } from '../utils/THREE'

export function getCarDirection() {
  if (!car.current) return

  car.current.getWorldQuaternion(new THREE.Quaternion())

  const unitVector = new THREE.Vector3(0, 0, 1)
  const ammoQuaternion = car.current.getWorldQuaternion(new THREE.Quaternion())

  return unitVector.applyQuaternion(ammoQuaternion)
}
