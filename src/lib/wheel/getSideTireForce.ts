import { getCarDirection } from '../car/getCarDirection';
import { THREE } from '../utils/THREE';
import { tireGrip } from '../../refs';
import { tireSnappiness } from '../../refs';
import { getSpeedVec } from '../car/getSpeedVec';

export function getSideTireForce(compression: number) {
  const speed = getSpeedVec();
  const sideVec = getCarDirection(new THREE.Vector3(1, 0, 0));
  const forwardVec = getCarDirection(new THREE.Vector3(0, 0, 1));
  if (speed.length() < 1) speed.copy(forwardVec);

  const projectedSpeed = speed.clone().projectOnVector(sideVec);
  const sqrtCompression = Math.sqrt(compression);
  const sideTireForce = projectedSpeed
    .multiplyScalar(-tireSnappiness.current)
    .clampLength(0, tireGrip.current * sqrtCompression);

  return sideTireForce;
}
