import { car } from '../../refs';
import { THREE } from '../utils/THREE';
import { getUserData } from '../utils/userData';

export function getCarDirection(unitVector = new THREE.Vector3(0, 0, 1)) {
  if (!car.current) return unitVector;

  const ammoQuat = getUserData(car.current).physicsBody.getWorldTransform().getRotation();
  const quatFromAmmo = new THREE.Quaternion(ammoQuat.x(), ammoQuat.y(), ammoQuat.z(), ammoQuat.w());

  return unitVector.clone().applyQuaternion(quatFromAmmo);
}

export function getCarMeshDirection(unitVector = new THREE.Vector3(0, 0, 1)) {
  if (!car.current) return unitVector;

  const quat = car.current.getWorldQuaternion(new THREE.Quaternion());

  return unitVector.clone().applyQuaternion(quat);
}
