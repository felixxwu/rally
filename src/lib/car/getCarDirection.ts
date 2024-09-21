import { car } from '../../refs';
import { THREE } from '../utils/THREE';

export function getCarDirection(unitVector = new THREE.Vector3(0, 0, 1)) {
  if (!car.current) return unitVector;

  const quat = car.current.getWorldQuaternion(new THREE.Quaternion());

  return unitVector.clone().applyQuaternion(quat);
}
