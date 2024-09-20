import { updatePhysics } from '../physics/updatePhysics'
import { THREE } from '../utils/THREE'
import { car, oldCarPosition } from './initCar'

export function updateCar() {
  if (!car.current) return

  oldCarPosition.current = car.current.getWorldPosition(new THREE.Vector3()).clone()

  updatePhysics(car.current)
}
