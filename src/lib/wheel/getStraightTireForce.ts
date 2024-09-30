import { getCarDirection } from '../car/getCarDirection';
import { brakePower, brakeRearBias, driveTrain, internalController } from '../../refs';
import { enginePower } from '../../refs';
import { THREE } from '../utils/THREE';
import { mult } from '../utils/multVec';
import { wheelHasPower } from './wheelHasPower';
import { getSpeedVec } from '../car/getSpeedVec';
import { isReversing } from './isReversing';

export function getStraightTireForce(front: boolean) {
  const speed = getSpeedVec();
  const forwardUnitVec = getCarDirection(new THREE.Vector3(0, 0, 1)).normalize();
  if (speed.length() < 1) speed.copy(forwardUnitVec);

  const reversing = isReversing();
  const brakeBiasMod = front ? 1 - brakeRearBias.current : brakeRearBias.current;

  const throttle = internalController.current.throttle;
  const brake = internalController.current.brake;
  const handeBrake = internalController.current.handbrake;

  let engineForce = new THREE.Vector3();
  let brakeForce = new THREE.Vector3();
  let usingBrakes = false;
  if (reversing) {
    brakeForce = mult(speed.clone().normalize(), -brakePower.current * brakeBiasMod * throttle);
    usingBrakes = true;
  } else {
    if (wheelHasPower(front)) {
      engineForce = mult(forwardUnitVec, enginePower.current * throttle);
    }
  }
  if (reversing) {
    if (wheelHasPower(front)) {
      engineForce = mult(forwardUnitVec, -enginePower.current * brake);
    }
  } else {
    brakeForce = mult(speed.clone().normalize(), -brakePower.current * brakeBiasMod * brake);
    usingBrakes = true;
  }
  if (!front && speed.length() > 2) {
    brakeForce = mult(speed.clone().normalize(), -10000 * handeBrake);
  }
  if (driveTrain.current === 'AWD') {
    engineForce.multiplyScalar(0.5);
  }

  return engineForce.clone().add(brakeForce);
}
