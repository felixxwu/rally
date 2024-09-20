import { camera } from '../../constant'
import { getCarDirection } from '../car/getCarDirection'

import { car } from '../car/initCar'
import { THREE } from '../utils/THREE'

const followDistance = -10
const followHeight = 5

export function updateCamera(deltaTime: number) {
  if (!car.current) return

  const transform = car.current.getWorldPosition(new THREE.Vector3())

  const direction = getCarDirection()

  const camVector = direction
    ?.multiplyScalar(followDistance)
    .add(new THREE.Vector3(0, followHeight, 0))

  // camera.current?.position.set(
  //   transform.x + (camVector?.x || 0),
  //   transform.y + (camVector?.y || 0),
  //   transform.z + (camVector?.z || 0),
  // )

  camera.current?.position.lerp(
    transform.clone().add(camVector || new THREE.Vector3()),
    deltaTime * 5
  )
  camera.current?.lookAt(transform.x, transform.y, transform.z)
}
