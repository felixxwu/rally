import { Mesh } from '../../types';
import { getCarCornerPos } from '../car/getCarCorner';
import { getCarDirection } from '../car/getCarDirection';
import { getCarRelCorner } from '../car/getCarRelCorner';
import { getDirectionOfTravel } from '../car/getDirectionOfTravel';
import { car } from '../../constant';
import { enginePower } from '../../constant';
import { keysDown } from '../initWindowListeners';
import { THREE } from '../utils/THREE';
import { getUserData } from '../utils/userData';
import { getAmmoVector } from '../utils/vectorConversion';
import { getSpringForce } from './getSpringForce';
import { maxTireForce } from '../../constant';
import { tireSnappiness } from '../../constant';
import { wheelRadius } from '../../constant';
import { springLength } from '../../constant';
import { helperArrow } from '../helperArrows/helperArrow';
import { mult } from '../utils/multVec';

export function updateWheel(
  wheelMesh: Mesh,
  prevDistance: {
    current: number;
  },
  front: boolean,
  left: boolean
) {
  if (!car.current) return;

  const quat = car.current?.getWorldQuaternion(new THREE.Quaternion());
  const wheelPos = getCarCornerPos(front, left);
  const [suspensionForce, compression] = getSpringForce(wheelPos, prevDistance);
  const wheelOffset = new THREE.Vector3(0, wheelRadius - (springLength - compression), 0);
  const wheelMeshPos = wheelPos.clone().add(wheelOffset.applyQuaternion(quat));

  const directionOfTravel = getDirectionOfTravel().multiplyScalar(50);
  const sideVec = getCarDirection(new THREE.Vector3(1, 0, 0));
  const forwardVec = getCarDirection(new THREE.Vector3(0, 0, 1));
  const projected = directionOfTravel.clone().projectOnVector(sideVec);
  const sideTireForce = projected
    .multiplyScalar(-tireSnappiness)
    .clampLength(0, maxTireForce * compression);

  let power = 0;
  if (keysDown.w) power = enginePower;
  if (keysDown.s) power = -enginePower;
  const straightForce = forwardVec.clone().multiplyScalar(power * compression);

  const objPhys = getUserData(car.current).physicsBody;
  const adjustedMaxTireForce = maxTireForce * compression;
  const totalTireForce = sideTireForce
    .clone()
    .add(straightForce)
    .clampLength(0, adjustedMaxTireForce);
  const totalForce = suspensionForce.clone().add(totalTireForce);
  objPhys.applyForce(getAmmoVector(totalForce), getAmmoVector(getCarRelCorner(front, left)));

  wheelMesh.position.copy(wheelMeshPos);
  const additionalQuat = new THREE.Quaternion().setFromAxisAngle(
    new THREE.Vector3(0, 0, 1),
    Math.PI / 2
  );
  quat.multiply(additionalQuat);
  wheelMesh.setRotationFromQuaternion(quat || new THREE.Quaternion());

  helperArrow(mult(suspensionForce, 0.02), wheelMeshPos, 0xffff00, `suspension${front}${left}`);
  helperArrow(mult(sideTireForce, 0.02), wheelMeshPos, 0x000000, `side${front}${left}`);
  helperArrow(mult(totalTireForce, 0.02), wheelMeshPos, 0xff0000, `tire${front}${left}`);
}