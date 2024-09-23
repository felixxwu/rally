import { Mesh } from '../../types';
import { getCarCornerPos } from '../car/getCarCorner';
import { getCarDirection } from '../car/getCarDirection';
import { getCarRelCorner } from '../car/getCarRelCorner';
import {
  bodyRoll,
  brakePower,
  brakeRearBias,
  car,
  frontWheelDrive,
  rearWheelDrive,
  reverseAngle,
  wheelCompression,
} from '../../refs';
import { enginePower } from '../../refs';
import { keysDown } from '../initWindowListeners';
import { THREE } from '../utils/THREE';
import { getUserData } from '../utils/userData';
import { getAmmoVector } from '../utils/vectorConversion';
import { getSpringForce } from './getSpringForce';
import { tireGrip } from '../../refs';
import { tireSnappiness } from '../../refs';
import { wheelRadius } from '../../refs';
import { springLength } from '../../refs';
import { helperArrow } from '../helperArrows/helperArrow';
import { mult } from '../utils/multVec';
import { Ref } from '../utils/ref';
import { wheelHasPower } from './wheelHasPower';
import { getSpeedVec } from '../car/getSpeedVec';

export function updateWheel(
  wheelMesh: Mesh,
  prevDistance: Ref<number>,
  front: boolean,
  left: boolean,
  deltaTime: number
) {
  if (!car.current) return;

  const quat = car.current?.getWorldQuaternion(new THREE.Quaternion());
  const wheelPos = getCarCornerPos(front, left);
  const [suspensionForce, compression] = getSpringForce(wheelPos, prevDistance);
  const wheelOffset = new THREE.Vector3(0, wheelRadius - (springLength.current - compression), 0);
  const wheelMeshPos = wheelPos.clone().add(wheelOffset.applyQuaternion(quat));

  const speed = getSpeedVec(deltaTime);
  const sideVec = getCarDirection(new THREE.Vector3(1, 0, 0));
  const forwardVec = getCarDirection(new THREE.Vector3(0, 0, 1));
  if (speed.length() < 1) speed.copy(forwardVec);

  const projected = speed.clone().projectOnVector(sideVec);
  const sqrtCompression = Math.sqrt(compression);
  const sideTireForce = projected
    .multiplyScalar(-tireSnappiness.current)
    .clampLength(0, tireGrip.current * sqrtCompression);

  const angle = getCarDirection().angleTo(speed);
  const reversing = angle > reverseAngle && speed.length() > 1;

  let power = 0;
  let usingBrakes = false;
  if (keysDown.w) {
    if (reversing) {
      power = brakePower.current * (front ? 1 - brakeRearBias.current : brakeRearBias.current);
      usingBrakes = true;
    } else {
      if (wheelHasPower(front)) {
        power = enginePower.current;
      }
    }
  }
  if (keysDown.s) {
    if (reversing) {
      if (wheelHasPower(front)) {
        power = -enginePower.current;
      }
    } else {
      power = -brakePower.current * (front ? 1 - brakeRearBias.current : brakeRearBias.current);
      usingBrakes = true;
    }
  }
  if (frontWheelDrive.current && rearWheelDrive.current) power /= 2;
  const straightForce = (
    usingBrakes ? mult(speed.clone().normalize(), reversing ? -1 : 1) : forwardVec
  )
    .clone()
    .multiplyScalar(power * sqrtCompression);

  const objPhys = getUserData(car.current).physicsBody;
  const adjustedMaxTireForce = tireGrip.current * sqrtCompression;
  const totalTireForce = sideTireForce
    .clone()
    .add(straightForce)
    .clampLength(0, adjustedMaxTireForce);
  const totalForce = suspensionForce.clone().add(totalTireForce);
  objPhys.applyForce(
    getAmmoVector(totalForce),
    getAmmoVector(
      getCarRelCorner(front, left)
        .clone()
        .add(mult(wheelOffset.applyQuaternion(quat), bodyRoll.current))
    )
  );

  wheelMesh.position.copy(wheelMeshPos);
  const additionalQuat = new THREE.Quaternion().setFromAxisAngle(
    new THREE.Vector3(0, 0, 1),
    Math.PI / 2
  );
  quat.multiply(additionalQuat);
  wheelMesh.setRotationFromQuaternion(quat || new THREE.Quaternion());

  wheelCompression.current[front ? (left ? 0 : 1) : left ? 2 : 3] = compression;

  helperArrow(mult(suspensionForce, 0.02), wheelMeshPos, 0xffff00, `suspension${front}${left}`);
  helperArrow(mult(sideTireForce, 0.02), wheelMeshPos, 0x000000, `side${front}${left}`);
  helperArrow(mult(totalTireForce, 0.02), wheelMeshPos, 0xff0000, `tire${front}${left}`);
}
