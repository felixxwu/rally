import { camera, camFollowDistance, camFollowHeight, camFollowSpeed, freeCam } from '../../refs';
import { getCarDirection } from '../car/getCarDirection';

import { car } from '../../refs';
import { THREE } from '../utils/THREE';
import { getCarPos } from '../car/getCarTransform';
import { ref } from '../utils/ref';

const lastXPos = ref<THREE.Vector3[]>([]);

export function updateCamera() {
  if (!car.current) return;

  const carPos = getCarPos();
  const direction = getCarDirection();

  const camVector = direction
    ?.multiplyScalar(-camFollowDistance.current)
    .add(new THREE.Vector3(0, camFollowHeight.current, 0));

  if (freeCam.current) return;

  lastXPos.current.push(carPos.clone());
  if (lastXPos.current.length > 20) lastXPos.current.shift();
  const avgPos = lastXPos.current
    .reduce((acc, pos) => acc.add(pos), new THREE.Vector3())
    .divideScalar(lastXPos.current.length);

  // camera.current?.position.set(
  //   avgPos.x + (camVector?.x || 0),
  //   avgPos.y + (camVector?.y || 0),
  //   avgPos.z + (camVector?.z || 0)
  // );
  camera.current?.position.lerp(
    avgPos.clone().add(camVector || new THREE.Vector3()),
    camFollowSpeed.current
  );
  camera.current?.lookAt(avgPos.x, avgPos.y + camFollowHeight.current / 2, avgPos.z);
}
