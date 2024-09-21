import { Mesh } from '../../types'
import { getCarCornerPos } from '../car/getCarCorner'
import { getCarDirection } from '../car/getCarDirection'
import { getCarRelCorner } from '../car/getCarRelCorner'
import { getDirectionOfTravel } from '../car/getDirectionOfTravel'
import { car } from '../car/initCar'
import { enginePower } from '../car/updateCar'
import { keysDown, mobileInput } from '../initWindowListeners'
import { THREE } from '../utils/THREE'
import { getUserData } from '../utils/userData'
import { getAmmoVector } from '../utils/vectorConversion'
import { getSpringForce } from './getSpringForce'
import { maxTireForce, springLength, tireSnappiness, wheelRadius } from './initWheel'

export function updateWheel(
  deltaTime: number,
  wheelMesh: Mesh,
  suspensionArrow: THREE.ArrowHelper,
  slipArrow: THREE.ArrowHelper,
  straightArrow: THREE.ArrowHelper,
  prevDistance: {
    current: number
  },
  front: boolean,
  left: boolean
) {
  if (!car.current) return

  const quat = car.current?.getWorldQuaternion(new THREE.Quaternion())
  const wheelPos = getCarCornerPos(front, left)
  const [suspensionForce, compression] = getSpringForce(wheelPos, prevDistance)
  const wheelOffset = new THREE.Vector3(0, wheelRadius - (springLength - compression), 0)
  const wheelMeshPos = wheelPos.clone().add(wheelOffset.applyQuaternion(quat))

  suspensionArrow.position.copy(wheelMeshPos)
  suspensionArrow.setDirection(suspensionForce.clone().normalize())
  suspensionArrow.setLength(suspensionForce.clone().length() * deltaTime * 2)

  const directionOfTravel = getDirectionOfTravel().multiplyScalar(50)
  const sideVec = getCarDirection(new THREE.Vector3(1, 0, 0))
  const forwardVec = getCarDirection(new THREE.Vector3(0, 0, 1))
  const projected = directionOfTravel.clone().projectOnVector(sideVec)
  const sideTireForce = projected.multiplyScalar(-tireSnappiness).clampLength(0, maxTireForce)

  // slipArrow.position.copy(wheelMeshPos)
  // slipArrow.setDirection(sideTireForce.clone().normalize())
  // slipArrow.setLength(sideTireForce.length() * deltaTime * compression * 2)

  let power = 0
  if (keysDown.w || (mobileInput.left && mobileInput.right)) power = enginePower
  if (keysDown.s) power = -enginePower
  const straightForce = forwardVec.clone().multiplyScalar(power * compression)

  const objPhys = getUserData(car.current).physicsBody
  const adjustedMaxTireForce = maxTireForce * compression
  const totalTireForce = sideTireForce
    .clone()
    .add(straightForce)
    .clampLength(0, adjustedMaxTireForce)
  const totalForce = suspensionForce.clone().add(totalTireForce)
  objPhys.applyForce(getAmmoVector(totalForce), getAmmoVector(getCarRelCorner(front, left)))

  straightArrow.position.copy(wheelMeshPos)
  straightArrow.setDirection(totalTireForce.clone().normalize())
  straightArrow.setLength(totalTireForce.length() * deltaTime * 4)

  wheelMesh.position.copy(wheelMeshPos)
  const additionalQuat = new THREE.Quaternion().setFromAxisAngle(
    new THREE.Vector3(0, 0, 1),
    Math.PI / 2
  )
  quat.multiply(additionalQuat)
  wheelMesh.setRotationFromQuaternion(quat || new THREE.Quaternion())
}
