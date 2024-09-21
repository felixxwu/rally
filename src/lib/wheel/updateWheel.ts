import { Mesh } from '../../types';
import { getCarCornerPos } from '../car/getCarCorner';
import { getCarDirection } from '../car/getCarDirection';
import { getCarRelCorner } from '../car/getCarRelCorner';
import { getDirectionOfTravel } from '../car/getDirectionOfTravel';
import { bodyRoll, car, frontWheelDrive, rearWheelDrive, wheelCompression } from '../../refs';
import { enginePower } from '../../refs';
import { keysDown } from '../initWindowListeners';
import { THREE } from '../utils/THREE';
import { getUserData } from '../utils/userData';
import { getAmmoVector } from '../utils/vectorConversion';
import { getSpringForce } from './getSpringForce';
import { maxTireForce } from '../../refs';
import { tireSnappiness } from '../../refs';
import { wheelRadius } from '../../refs';
import { springLength } from '../../refs';
import { helperArrow } from '../helperArrows/helperArrow';
import { mult } from '../utils/multVec';
import { Ref } from '../utils/ref';
import { wheelHasPower } from './wheelHasPower';

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

  const directionOfTravel = getDirectionOfTravel(deltaTime).multiplyScalar(50);
  const sideVec = getCarDirection(new THREE.Vector3(1, 0, 0));
  const forwardVec = getCarDirection(new THREE.Vector3(0, 0, 1));
  const projected = directionOfTravel.clone().projectOnVector(sideVec);
  const sqrtCompression = Math.sqrt(compression);
  const sideTireForce = projected
    .multiplyScalar(-tireSnappiness.current)
    .clampLength(0, maxTireForce.current * sqrtCompression);

  let power = 0;
  if (keysDown.w && wheelHasPower(front)) power = enginePower.current;
  // TODO fix reverse always being 4wd
  if (keysDown.s) power = -enginePower.current;
  if (frontWheelDrive.current && rearWheelDrive.current) power /= 2;
  const straightForce = forwardVec.clone().multiplyScalar(power * sqrtCompression);

  const objPhys = getUserData(car.current).physicsBody;
  const adjustedMaxTireForce = maxTireForce.current * sqrtCompression;
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
