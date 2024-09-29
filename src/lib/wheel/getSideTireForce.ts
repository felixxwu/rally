import { getCarDirection } from '../car/getCarDirection';
import { THREE } from '../utils/THREE';
import { tireSnappiness } from '../../refs';
import { getSpeedVec } from '../car/getSpeedVec';

export function getSideTireForce() {
  const speed = getSpeedVec();
  const sideVec = getCarDirection(new THREE.Vector3(1, 0, 0));
  const forwardVec = getCarDirection(new THREE.Vector3(0, 0, 1));
  if (speed.length() < 1) speed.copy(forwardVec);

  const projectedSpeed = speed.clone().projectOnVector(sideVec);
  const sideTireForce = projectedSpeed.multiplyScalar(-tireSnappiness.current);

  return sideTireForce;
}
