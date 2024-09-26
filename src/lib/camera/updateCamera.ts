import { camera, camFollowDistance, camFollowHeight, camFollowSpeed, freeCam } from '../../refs';
import { getCarDirection } from '../car/getCarDirection';

import { car } from '../../refs';
import { THREE } from '../utils/THREE';
import { getCarTransform } from '../car/getCarTransform';

const lastXPos: THREE.Vector3[] = [];

export function updateCamera() {
  if (!car.current) return;

  const transform = getCarTransform();
  const direction = getCarDirection();

  const camVector = direction
    ?.multiplyScalar(-camFollowDistance.current)
    .add(new THREE.Vector3(0, camFollowHeight.current, 0));

  if (freeCam.current) return;

  lastXPos.push(transform.clone());
  if (lastXPos.length > 20) lastXPos.shift();
  const avgPos = lastXPos
    .reduce((acc, pos) => acc.add(pos), new THREE.Vector3())
    .divideScalar(lastXPos.length);

  // camera.current?.position.set(
  //   avgPos.x + (camVector?.x || 0),
  //   avgPos.y + (camVector?.y || 0),
  //   avgPos.z + (camVector?.z || 0)
  // );
  camera.current?.position.lerp(
    avgPos.clone().add(camVector || new THREE.Vector3()),
    camFollowSpeed.current
  );
  camera.current?.lookAt(avgPos.x, avgPos.y + camFollowHeight.current / 4, avgPos.z);
}
