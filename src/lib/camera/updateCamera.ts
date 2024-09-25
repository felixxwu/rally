import { camera, camFollowDistance, camFollowHeight, camFollowSpeed, freeCam } from '../../refs';
import { getCarDirection } from '../car/getCarDirection';

import { car } from '../../refs';
import { THREE } from '../utils/THREE';
import { getCarTransform } from '../car/getCarTransform';

export function updateCamera(deltaTime: number) {
  if (!car.current) return;

  const transform = getCarTransform();
  const direction = getCarDirection();

  const camVector = direction
    ?.multiplyScalar(-camFollowDistance.current)
    .add(new THREE.Vector3(0, camFollowHeight.current, 0));

  // camera.current?.position.set(
  //   transform.x + (camVector?.x || 0),
  //   transform.y + (camVector?.y || 0),
  //   transform.z + (camVector?.z || 0),
  // )

  if (freeCam.current) return;

  camera.current?.position.lerp(
    transform.clone().add(camVector || new THREE.Vector3()),
    camFollowSpeed.current
  );
  camera.current?.lookAt(transform.x, transform.y, transform.z);
}
