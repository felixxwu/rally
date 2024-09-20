import { getCarCornerPos } from '../car/getCarCorner'
import { car, oldCarPosition } from '../car/initCar'
import { THREE } from '../utils/THREE'
import { arrow } from './initHelperArrows'

export function updateHelperArrows(deltaTime: number) {
  const pos = car.current?.getWorldPosition(new THREE.Vector3())
  const oldPos = oldCarPosition.current

  const diff = pos
    ?.clone()
    .sub(oldPos || new THREE.Vector3())
    .multiplyScalar(0.5 / deltaTime)

  arrow.current?.position.set(pos?.x || 0, (pos?.y || 0) + 1, pos?.z || 0)
  arrow.current?.setDirection(diff?.clone().normalize() || new THREE.Vector3())
  arrow.current?.setLength(diff?.length() || 0)
}
