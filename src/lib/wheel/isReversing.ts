import { reverseAngle } from '../../refs';
import { getCarDirection } from '../car/getCarDirection';
import { getSpeedVec } from '../car/getSpeedVec';

export function isReversing(deltaTime: number) {
  const speed = getSpeedVec();
  const angle = getCarDirection().angleTo(speed);
  const reversing = angle > reverseAngle && speed.length() > 1;

  return reversing;
}
