import { camera, camFollowDistance, camFollowHeight } from '../../constant';
import { getCarDirection } from '../car/getCarDirection';

import { car } from '../../constant';
import { THREE } from '../utils/THREE';

export function updateCamera(deltaTime: number) {
  if (!car.current) return;

  const transform = car.current.getWorldPosition(new THREE.Vector3());

  const direction = getCarDirection();

  const camVector = direction
    ?.multiplyScalar(camFollowDistance)
    .add(new THREE.Vector3(0, camFollowHeight, 0));

  // camera.current?.position.set(
  //   transform.x + (camVector?.x || 0),
  //   transform.y + (camVector?.y || 0),
  //   transform.z + (camVector?.z || 0),
  // )

  camera.current?.position.lerp(transform.clone().add(camVector || new THREE.Vector3()), 0.05);
  camera.current?.lookAt(transform.x, transform.y, transform.z);
}
