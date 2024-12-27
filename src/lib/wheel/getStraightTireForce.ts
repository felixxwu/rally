import { getCarDirection } from '../car/getCarDirection';
import {
  gear,
  internalController,
  powerModifier,
  selectedCar,
  shifting,
  stageTimeStarted,
} from '../../refs';
import { THREE } from '../utils/THREE';
import { mult } from '../utils/multVec';
import { wheelHasPower } from './wheelHasPower';
import { getSpeedVec } from '../car/getSpeedVec';
import { isReversing } from './isReversing';
import { getRPM } from '../car/getRPM';

export function getStraightTireForce(front: boolean) {
  const speed = getSpeedVec();
  const forwardUnitVec = getCarDirection(new THREE.Vector3(0, 0, 1)).normalize();
  if (speed.length() < 1) speed.copy(forwardUnitVec);

  const reversing = isReversing();
  const { brakeRearBias, brakePower, power, torqueCurve } = selectedCar.current;
  const brakeBiasMod = front ? 1 - brakeRearBias : brakeRearBias;

  const throttle = internalController.current.throttle;
  const brake = internalController.current.brake;
  const handeBrake = internalController.current.handbrake;

  let engineForce = new THREE.Vector3();
  let brakeForce = new THREE.Vector3();

  const wheelForce = shifting.current
    ? 0
    : power * powerModifier * torqueCurve(getRPM()) * selectedCar.current.gears[gear.current];

  if (reversing) {
    if (wheelHasPower(front)) {
      engineForce.add(mult(forwardUnitVec, -wheelForce * brake));
    }
    brakeForce.add(mult(speed.clone().normalize(), -brakePower * throttle * brakeBiasMod));
  } else {
    if (wheelHasPower(front)) {
      engineForce.add(mult(forwardUnitVec, wheelForce * throttle));
    }
    brakeForce.add(mult(speed.clone().normalize(), -brakePower * brake * brakeBiasMod));
  }

  if (!stageTimeStarted.current) {
    engineForce.setLength(0);
    brakeForce.setLength(0);
  }

  if (!front && speed.length() > 2) {
    brakeForce.add(
      mult(speed.clone().normalize(), -10000 * (handeBrake + (stageTimeStarted.current ? 0 : 1)))
    );
  }
  if (selectedCar.current.driveTrain === 'AWD') {
    engineForce.multiplyScalar(0.5);
  }

  return engineForce.clone().add(brakeForce);
}
