import { getCarDirection } from '../car/getCarDirection';
import { brakePower, brakeRearBias, frontWheelDrive, rearWheelDrive } from '../../refs';
import { enginePower } from '../../refs';
import { keysDown } from '../initWindowListeners';
import { THREE } from '../utils/THREE';
import { mult } from '../utils/multVec';
import { wheelHasPower } from './wheelHasPower';
import { getSpeedVec } from '../car/getSpeedVec';
import { isReversing } from './isReversing';

export function getStraightTireForce(deltaTime: number, compression: number, front: boolean) {
  const speed = getSpeedVec(deltaTime);
  const forwardUnitVec = getCarDirection(new THREE.Vector3(0, 0, 1)).normalize();
  if (speed.length() < 1) speed.copy(forwardUnitVec);

  const reversing = isReversing(deltaTime);
  const brakeBiasMod = front ? 1 - brakeRearBias.current : brakeRearBias.current;

  let engineForce = new THREE.Vector3();
  let brakeForce = new THREE.Vector3();
  let usingBrakes = false;
  if (keysDown.w) {
    if (reversing) {
      brakeForce = mult(speed.clone().normalize(), brakePower.current * brakeBiasMod);
      usingBrakes = true;
    } else {
      if (wheelHasPower(front)) {
        engineForce = mult(forwardUnitVec, enginePower.current);
      }
    }
  }
  if (keysDown.s) {
    if (reversing) {
      if (wheelHasPower(front)) {
        engineForce = mult(forwardUnitVec, -enginePower.current);
      }
    } else {
      brakeForce = mult(speed.clone().normalize(), -brakePower.current * brakeBiasMod);
      usingBrakes = true;
    }
  }
  if (keysDown[' ']) {
    if (!front) {
      brakeForce = mult(speed.clone().normalize(), 10000 * (reversing ? 1 : -1));
    }
  }
  if (frontWheelDrive.current && rearWheelDrive.current) {
    engineForce.multiplyScalar(0.5);
  }

  return engineForce.clone().add(brakeForce);
}
