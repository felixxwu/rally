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
  wheelArrow: THREE.ArrowHelper,
  prevDistance: {
    current: number
  },
  front: boolean,
  left: boolean
) {
  if (!car.current) return

  const wheelPos = getCarCornerPos(front, left)
  const [wheelForce, distanceToGround] = getSpringForce(wheelPos, deltaTime, prevDistance)

  wheelArrow.position.copy(wheelPos)
  wheelArrow.setLength(wheelForce.clone().multiplyScalar(deltaTime).length())

  const objPhys = getUserData(car.current).physicsBody
  objPhys.applyForce(getAmmoVector(wheelForce), getAmmoVector(getCarRelCorner(front, left)))

  wheelMesh.position.copy(
    wheelPos.clone().add(new THREE.Vector3(0, wheelRadius - distanceToGround, 0))
  )
  const carDirection = getCarDirection(new THREE.Vector3(0, 0, 1))
  wheelMesh.setRotationFromAxisAngle(carDirection, Math.PI / 2)
}
