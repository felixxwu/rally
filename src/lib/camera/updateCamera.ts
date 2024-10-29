import {
  camera,
  camFollowDistance,
  camFollowHeight,
  countDownStarted,
  freeCam,
  stageTimeStarted,
} from '../../refs';

import { car } from '../../refs';
import { THREE } from '../utils/THREE';
import { getCarMeshPos, getCarPos } from '../car/getCarTransform';
import { vec3 } from '../utils/createVec';
import { getCarDirection } from '../car/getCarDirection';
import { getSpeedVec } from '../car/getSpeedVec';
import { helperArrowFromTo } from '../helperArrows/helperArrow';

const carPosTrail: THREE.Vector3[] = [];
const camVec = new THREE.Vector3();
const recentCarPos: THREE.Vector3[] = [];

const direction = new THREE.Vector3();

export function updateCamera() {
  if (!car.current) return;

  const carPos = getCarPos();
  const carMeshPos = getCarMeshPos();
  const carDir = getCarDirection();
  const speed = getSpeedVec();

  recentCarPos.push(carMeshPos);
  if (recentCarPos.length > 5) recentCarPos.shift();
  const avgCarPos = recentCarPos
    .reduce((acc, vec) => acc.add(vec), new THREE.Vector3())
    .divideScalar(recentCarPos.length);

  helperArrowFromTo(carMeshPos, avgCarPos, 0xff00ff, 'avgCarPos');

  if (speed.length() > 1) {
    direction.copy(speed).normalize();
  }

  if (freeCam.current) return;

  carPosTrail.push(avgCarPos.clone());
  while (carPosTrail[0]?.distanceTo(avgCarPos) > camFollowDistance.current) {
    carPosTrail.shift();
  }

  const diff = carPosTrail[0]?.clone().sub(avgCarPos).add(carDir.clone().negate());
  const projected = diff.projectOnPlane(vec3([0, 1, 0]));
  const clampedDiff = projected.setLength(camFollowDistance.current - 1);

  camera.current?.lookAt(avgCarPos.clone().add(vec3([0, camFollowHeight.current / 4, 0])));

  if (!stageTimeStarted.current && !countDownStarted.current) return;

  const camDiff = clampedDiff.add(vec3([0, camFollowHeight.current, 0]));

  camVec.lerp(
    carPos.add(
      carDir
        .clone()
        .negate()
        .setLength(camFollowDistance.current)
        .add(vec3([0, camFollowHeight.current, 0]))
    ),
    0.1
  );

  // const camLookAt = camVec.clone().sub(camDir);
  // camera.current?.lookAt(camLookAt);

  // camera.current?.position.copy(avgCarPos.add(camDiff));
  camera.current?.position.copy(camVec);
  // camera.current?.position.copy(
  //   avgCarPos.add(
  //     carDir
  //       .clone()
  //       .negate()
  //       .setLength(camFollowDistance.current)
  //       .add(vec3([0, camFollowHeight.current, 0]))
  //   )
  // );
}
