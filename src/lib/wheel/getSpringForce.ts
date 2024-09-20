import { car } from '../car/initCar'
import { terrainMesh } from '../terrain/initTerrain'
import { THREE } from '../utils/THREE'
import { springDamping, springLength, sprintRate } from './initWheel'

export function getSpringForce(
  pos: THREE.Vector3,
  deltaTime: number,
  prevDistance: { current: number }
): [THREE.Vector3, number] {
  if (!terrainMesh.current || !car.current) return [new THREE.Vector3(), 0]

  const raycaster = new THREE.Raycaster()
  raycaster.set(pos, new THREE.Vector3(0, -1, 0))
  const intersections = raycaster.intersectObject(terrainMesh.current, false)
  const distance = intersections[0]?.distance

  const compression = springLength - Math.min(springLength, distance)

  if (distance < springLength) {
    const distanceDelta = distance - prevDistance.current
    const velY = (distanceDelta / deltaTime) * springDamping
    const damping = Math.max(0, -velY)
    const spring = (compression / deltaTime) * sprintRate
    prevDistance.current = distance
    return [new THREE.Vector3(0, damping + spring, 0), distance]
  } else {
    return [new THREE.Vector3(0, 0, 0), springLength]
  }
}
