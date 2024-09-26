import { Mesh } from '../../types';
import { car, wheelCompression } from '../../refs';
import { THREE } from '../utils/THREE';
import { getUserData } from '../utils/userData';
import { helperArrow } from '../helperArrows/helperArrow';
import { mult } from '../utils/multVec';
import { Ref } from '../utils/ref';
import { getTotalTireForce } from './getTotalTireForce';
import { addSkidMark } from './addSkidMark';

export function updateWheel(
  wheelMesh: Mesh,
  prevDistance: Ref<number>,
  front: boolean,
  left: boolean,
  deltaTime: number
) {
  if (!car.current) return;

  const {
    wheelMeshPos,
    ammoForce,
    ammoPos,
    compression,
    suspensionForce,
    sideTireForce,
    totalTireForce,
    surface,
  } = getTotalTireForce(prevDistance, front, left, deltaTime);

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
  wheelMesh.setRotationFromQuaternion(quat || new THREE.Quaternion());

  // save compression to refs
  wheelCompression.current[front ? (left ? 0 : 1) : left ? 2 : 3] = compression;

  addSkidMark(compression, wheelMeshPos, totalTireForce, front, left, surface);

  // helper arrows
  helperArrow(mult(suspensionForce, 0.02), wheelMeshPos, 0xffff00, `suspension${front}${left}`);
  helperArrow(mult(sideTireForce, 0.02), wheelMeshPos, 0x000000, `side${front}${left}`);
  helperArrow(mult(totalTireForce, 0.02), wheelMeshPos, 0xff0000, `tire${front}${left}`);
}
