import { Mesh } from '../../types'
import { getCarCornerPos } from '../car/getCarCorner'
import { getCarDirection } from '../car/getCarDirection'
import { getCarRelCorner } from '../car/getCarRelCorner'
import { car } from '../car/initCar'
import { THREE } from '../utils/THREE'
import { getUserData } from '../utils/userData'
import { getAmmoVector } from '../utils/vectorConversion'
import { getSpringForce } from './getSpringForce'
import { wheelRadius } from './initWheel'

export function updateWheel(
  deltaTime: number,
  wheelMesh: Mesh,
  suspensionArrow: THREE.ArrowHelper,
  slipArrow: THREE.ArrowHelper,
  prevDistance: {
    current: number
  },
  front: boolean,
  left: boolean
) {
  if (!car.current) return

  const quat = car.current?.getWorldQuaternion(new THREE.Quaternion())
  const wheelPos = getCarCornerPos(front, left)
  const [suspensionForce, distanceToGround] = getSpringForce(wheelPos, prevDistance)
  suspensionForce.applyQuaternion(quat)
  const wheelMeshPos = wheelPos
    .clone()
    .add(new THREE.Vector3(0, wheelRadius - distanceToGround, 0).applyQuaternion(quat))

  suspensionArrow.position.copy(wheelMeshPos)
  suspensionArrow.setDirection(suspensionForce.clone().normalize())
  suspensionArrow.setLength(suspensionForce.clone().multiplyScalar(deltaTime).length())

  slipArrow.position.copy(wheelMeshPos)
  slipArrow.setDirection(getCarDirection(new THREE.Vector3(left ? 1 : -1, 0, 0)))

  const objPhys = getUserData(car.current).physicsBody
  objPhys.applyForce(getAmmoVector(suspensionForce), getAmmoVector(getCarRelCorner(front, left)))

  wheelMesh.position.copy(wheelMeshPos)
  const additionalQuat = new THREE.Quaternion().setFromAxisAngle(
    new THREE.Vector3(0, 0, 1),
    Math.PI / 2
  )
  quat.multiply(additionalQuat)
  wheelMesh.setRotationFromQuaternion(quat || new THREE.Quaternion())
}
