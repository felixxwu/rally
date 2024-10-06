import {
  camera,
  camFollowDistance,
  camFollowHeight,
  camFollowSpeed,
  countDownStarted,
  freeCam,
  stageTimeStarted,
} from '../../refs';
import { getCarMeshDirection } from '../car/getCarDirection';

import { car } from '../../refs';
import { THREE } from '../utils/THREE';
import { getCarMeshPos } from '../car/getCarTransform';

const carPosForLerp = new THREE.Vector3();

export function updateCamera() {
  if (!car.current) return;

  const carPos = getCarMeshPos();
  const direction = getCarMeshDirection();

  const camVector = direction
    ?.multiplyScalar(-camFollowDistance.current)
    .add(new THREE.Vector3(0, camFollowHeight.current, 0));

  if (freeCam.current) return;

  carPosForLerp.lerp(carPos, camFollowSpeed.current);

  if (stageTimeStarted.current || countDownStarted.current) {
    camera.current?.lookAt(carPos.x, carPos.y + camFollowHeight.current / 2, carPos.z);
    camera.current?.position.copy(carPosForLerp.clone().add(camVector || new THREE.Vector3()));
  }
}
