import { getCarCornerMeshPos } from '../car/getCarCorner';
import { car } from '../../refs';
import { THREE } from '../utils/THREE';
import { wheelRadius } from '../../refs';
import { springLength } from '../../refs';
import { getUserData } from '../utils/userData';

export function getWheelMeshPos(compression: number, front: boolean, left: boolean) {
  if (!car.current) {
    return {
      wheelMeshPos: new THREE.Vector3(),
      wheelOffsetFromCorner: new THREE.Vector3(),
      wheelmeshBottomPos: new THREE.Vector3(),
    };
  }

  const ammoQuat = getUserData(car.current).physicsBody.getWorldTransform().getRotation();
  const quat = new THREE.Quaternion(ammoQuat.x(), ammoQuat.y(), ammoQuat.z(), ammoQuat.w());
  const wheelPos = getCarCornerMeshPos(front, left);
  const suspensionLength = Math.min(wheelRadius - (springLength.current - compression), 0);

  const wheelOffset = new THREE.Vector3(0, suspensionLength, 0);
  const wheelOffsetFromCorner = wheelOffset.applyQuaternion(quat);
  const wheelMeshPos = wheelPos.clone().add(wheelOffset);

  const wheelBottomOffset = new THREE.Vector3(0, suspensionLength - (wheelRadius - 0.1), 0);
  wheelBottomOffset.applyQuaternion(quat);
  const wheelmeshBottomPos = wheelPos.clone().add(wheelBottomOffset);
  return { wheelMeshPos, wheelOffsetFromCorner, wheelmeshBottomPos };
}
