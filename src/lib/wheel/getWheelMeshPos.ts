import { getCarCornerMeshPos } from '../car/getCarCorner';
import { car, selectedCar } from '../../refs';
import { THREE } from '../utils/THREE';
import { getUserData } from '../utils/userData';

export function getWheelMeshPos(suspensionLength: number, front: boolean, left: boolean) {
  if (!car.current) {
    return {
      wheelMeshPos: new THREE.Vector3(),
      wheelOffsetFromCorner: new THREE.Vector3(),
      wheelmeshBottomPos: new THREE.Vector3(),
    };
  }

  const { wheelRadius } = selectedCar.current;
  const ammoQuat = getUserData(car.current).physicsBody.getWorldTransform().getRotation();
  const quat = new THREE.Quaternion(ammoQuat.x(), ammoQuat.y(), ammoQuat.z(), ammoQuat.w());
  const wheelPos = getCarCornerMeshPos(front, left);

  const wheelOffset = new THREE.Vector3(0, suspensionLength, 0);
  const wheelOffsetFromCorner = wheelOffset.applyQuaternion(quat);
  const wheelMeshPos = wheelPos.clone().add(wheelOffset);

  const wheelBottomOffset = new THREE.Vector3(0, suspensionLength + wheelRadius - 0.3, 0);
  wheelBottomOffset.applyQuaternion(quat);
  const wheelmeshBottomPos = wheelPos.clone().sub(wheelBottomOffset);
  return { wheelMeshPos, wheelOffsetFromCorner, wheelmeshBottomPos };
}
