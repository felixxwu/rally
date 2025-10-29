import {
  camera,
  camFollowDistance,
  camFollowHeight,
  camFollowSpeed,
  countDownStarted,
  freeCam,
  stageTimeStarted,
} from '../../refs';

import { car } from '../../refs';
import { THREE } from '../utils/THREE';
import { getCarMeshPos } from '../car/getCarTransform';
import { vec3 } from '../utils/createVec';
import { getCarMeshDirection } from '../car/getCarDirection';

const carPosForLerp = new THREE.Vector3();
const carPosForLookAt = new THREE.Vector3();
const recentCarPos: THREE.Vector3[] = [];

export function updateCamera() {
  if (!car.current) return;

  const carPos = getCarMeshPos();
  const carDir = getCarMeshDirection();

  if (freeCam.current) return;

  if (!stageTimeStarted.current && !countDownStarted.current) return;

  recentCarPos.push(carPos.clone());
  while (recentCarPos[0]?.distanceTo(carPos) > camFollowDistance.current) {
    recentCarPos.shift();
  }

  const diff = recentCarPos[0]?.clone().sub(carPos).add(carDir.clone().negate());
  const projected = diff.projectOnPlane(vec3([0, 1, 0]));
  const clampedDiff = projected.setLength(camFollowDistance.current - 1);

  carPosForLerp.lerp(
    carPos
      .clone()
      .add(clampedDiff)
      .add(vec3([0, camFollowHeight.current, 0])),
    camFollowSpeed.current
  );

  carPosForLookAt.lerp(carPos, camFollowSpeed.current);

  camera.current?.lookAt(
    carPosForLookAt.x,
    carPosForLookAt.y + camFollowHeight.current / 4,
    carPosForLookAt.z
  );

  if (stageTimeStarted.current || countDownStarted.current) {
    camera.current?.position.copy(carPosForLerp);
  }
}
