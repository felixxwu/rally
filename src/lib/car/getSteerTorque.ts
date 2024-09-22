import AmmoType from 'ammojs-typed';
declare const Ammo: typeof AmmoType;

import {
  highSpeedModMax,
  highSpeedModScalar,
  reverseAngle,
  slowSpeedModMax,
  slowSpeedModScalar,
  wheelCompression,
} from '../../refs';
import { car } from '../../refs';
import { getDirectionOfTravel } from './getDirectionOfTravel';
import { steerPower } from '../../refs';
import { getCarDirection } from './getCarDirection';

export function getSteerTorque(deltaTime: number) {
  if (!car.current) return 0;

  const dir = getDirectionOfTravel(deltaTime);

  const angle = getCarDirection().angleTo(dir);
  const reversing = angle < reverseAngle;
  const steerTorque = steerPower.current * (reversing ? -1 : 1);
  const slowSpeedModifier = Math.min(dir.length() * slowSpeedModScalar, slowSpeedModMax);
  const highSpeedModifier = Math.max(dir.length() * -highSpeedModScalar, -highSpeedModMax);
  const speedAdjusted = steerTorque * (slowSpeedModifier + highSpeedModifier);
  const allWheelComp = wheelCompression.current.slice(0, 1).reduce((a, b) => a + b, 0);
  const compressionAdjusted = speedAdjusted * (Math.sqrt(allWheelComp) + 0.2);

  return compressionAdjusted;
}
