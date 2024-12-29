import { reverseAngle } from '../../refs';
import { getCarDirection } from '../car/getCarDirection';
import { getSpeedVec } from '../car/getSpeedVec';

export function isReversing() {
  const speed = getSpeedVec();
  const angle = getCarDirection().angleTo(speed);
  return angle > reverseAngle && speed.length() > 1;
}
