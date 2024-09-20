import { camera, car } from '../../constant'
import { getCarDirection } from '../car/getCarDirection'
import * as THREE from 'three'

const followDistance = 20
const followHeight = 10

export function updateCamera() {
  if (!car.current) return

  const transform = car.current.getWorldPosition(new THREE.Vector3())

  const direction = getCarDirection()

  const camVector = direction
    ?.multiplyScalar(followDistance)
    .add(new THREE.Vector3(0, followHeight, 0))

  camera.current?.position.set(
    transform.x + (camVector?.x || 0),
    transform.y + (camVector?.y || 0),
    transform.z + (camVector?.z || 0)
  )
  camera.current?.lookAt(transform.x, transform.y, transform.z)
}
