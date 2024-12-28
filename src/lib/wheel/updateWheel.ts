import { Mesh } from '../../types';
import {
  car,
  carVisible,
  reverseAngle,
  steerModMap,
  suspensionForces,
  wheelCompression,
  wheelSurfaces,
} from '../../refs';
import { THREE } from '../utils/THREE';
import { getUserData } from '../utils/userData';
import { helperArrow } from '../helperArrows/helperArrow';
import { mult } from '../utils/multVec';
import { Ref } from '../utils/ref';
import { getTotalTireForce } from './getTotalTireForce';
import { addSkidMark } from './addSkidMark';
import { getSpeedVec } from '../car/getSpeedVec';
import { getCarDirection } from '../car/getCarDirection';
import { createQuat } from '../utils/createQuat';
import { logRenderTime } from '../render/initRenderer';

let i = 0;

export function updateWheel(
  wheelMesh: Mesh,
  prevDistance: Ref<number>,
  front: boolean,
  left: boolean
) {
  if (!car.current) return;

  wheelMesh.visible = carVisible.current;

  const {
    wheelMeshPos,
    ammoForce,
    ammoPos,
    compression,
    suspensionForce,
    totalClampedTireForce,
    surface,
    wheelmeshBottomPos,
    sideTireForce,
    straightTireForce,
  } = getTotalTireForce(prevDistance, front, left);

  // apply forces to the car
  const objPhys = getUserData(car.current).physicsBody;
  objPhys.applyForce(ammoForce, ammoPos);

  // update pos of wheel mesh
  wheelMesh.position.copy(wheelMeshPos);

  // update rotation of wheel mesh
  const additionalQuat = new THREE.Quaternion().setFromAxisAngle(
    new THREE.Vector3(0, 0, 1),
    Math.PI / 2
  );
  const ammoQuat = getUserData(car.current).physicsBody.getWorldTransform().getRotation();
  const quat = new THREE.Quaternion(ammoQuat.x(), ammoQuat.y(), ammoQuat.z(), ammoQuat.w());
  quat.multiply(additionalQuat);

  const carDir = getCarDirection();
  const speed = getSpeedVec();
  const angle = getCarDirection().angleTo(speed);
  const reversing = angle > reverseAngle;
  const { threeQuat: quat2 } = createQuat(
    carDir.clone().normalize(),
    speed.clone().normalize(),
    (front && !reversing ? 1 : 0) * steerModMap(speed.length())
  );
  quat2.multiply(quat);

  wheelMesh.setRotationFromQuaternion(quat2 || new THREE.Quaternion());

  // save compression to refs
  wheelCompression.current[front ? (left ? 0 : 1) : left ? 2 : 3] = compression;
  suspensionForces.current[front ? (left ? 0 : 1) : left ? 2 : 3] = suspensionForce.length();
  wheelSurfaces.current[front ? (left ? 0 : 1) : left ? 2 : 3] = surface;

  if (i++ % 1 === 0) {
    const now = window.performance.now();
    addSkidMark(
      compression,
      wheelmeshBottomPos,
      totalClampedTireForce,
      sideTireForce,
      straightTireForce,
      front,
      left,
      surface
    );
    logRenderTime('skidMarks (wheel)', now);
  }

  // helper arrows
  helperArrow(mult(suspensionForce, 0.02), wheelMeshPos, 0xffff00, `suspension${front}${left}`);
  // helperArrow(
  //   mult(totalTireForceBeforeClamp, 0.02),
  //   wheelMeshPos,
  //   0x000000,
  //   `straight${front}${left}`
  // );
  helperArrow(mult(totalClampedTireForce, 0.02), wheelMeshPos, 0xff0000, `clamp${front}${left}`);
}
