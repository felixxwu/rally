import { onRender, scene } from '../../constant'
import { getCarCornerPos } from '../car/getCarCorner'
import { getCarDirection } from '../car/getCarDirection'
import { getCarRelCorner } from '../car/getCarRelCorner'
import { car } from '../car/initCar'
import { terrainMesh } from '../terrain/initTerrain'
import { THREE } from '../utils/THREE'
import { getUserData } from '../utils/userData'
import { getAmmoVector } from '../utils/vectorConversion'

export const springLength = 1.1
export const sprintRate = 2
export const springDamping = 0.5
export const wheelRadius = 0.4

export function initWheel(front: boolean, left: boolean) {
  const wheelArrow = new THREE.ArrowHelper()
  wheelArrow.setDirection(new THREE.Vector3(0, 1, 0))
  scene.current?.add(wheelArrow)

  const wheelMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(wheelRadius, wheelRadius, 0.3, 32),
    new THREE.MeshBasicMaterial({ color: 0x000000 })
  )

  scene.current?.add(wheelMesh)

  onRender.push(deltaTime => {
    if (!car.current) return

    const wheelPos = getCarCornerPos(front, left)
    const [wheelForce, distanceToGround] = getSpringForce(wheelPos, deltaTime)
    wheelArrow.position.copy(wheelPos)
    wheelArrow.setLength(wheelForce.clone().multiplyScalar(deltaTime).length())

    const objPhys = getUserData(car.current).physicsBody
    objPhys.applyForce(getAmmoVector(wheelForce), getAmmoVector(getCarRelCorner(front, left)))

    wheelMesh.position.copy(
      wheelPos.clone().add(new THREE.Vector3(0, wheelRadius - distanceToGround, 0))
    )
    const carDirection = getCarDirection(new THREE.Vector3(0, 0, 1))
    wheelMesh.setRotationFromAxisAngle(carDirection, Math.PI / 2)
  })
}

function getSpringForce(pos: THREE.Vector3, deltaTime: number): [THREE.Vector3, number] {
  if (!terrainMesh.current || !car.current) return [new THREE.Vector3(), 0]

  const raycaster = new THREE.Raycaster()
  raycaster.set(pos, new THREE.Vector3(0, -1, 0))
  const intersections = raycaster.intersectObject(terrainMesh.current, false)
  const objPhys = getUserData(car.current).physicsBody
  const distance = intersections[0]?.distance
  const compression = springLength - Math.min(springLength, distance)
  if (distance < springLength) {
    const velY = (objPhys.getLinearVelocity().y() / deltaTime) * springDamping
    const damping = Math.max(0, -velY)
    const spring = (Math.pow(compression, 2) / deltaTime) * sprintRate
    return [new THREE.Vector3(0, damping + spring, 0).multiplyScalar(1), distance]
  } else {
    return [new THREE.Vector3(0, 0, 0), springLength]
  }
}
