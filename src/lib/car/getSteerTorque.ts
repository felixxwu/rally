import AmmoType from 'ammojs-typed';
declare const Ammo: typeof AmmoType;

import {
  reverseAngle,
  steerModMap,
  surfaceGrips,
  wheelCompression,
  wheelSurfaces,
} from '../../refs';
import { car } from '../../refs';
import { steerPower } from '../../refs';
import { getCarDirection } from './getCarDirection';
import { getSpeedVec } from './getSpeedVec';

export function getMaxSteerTorque() {
  if (!car.current) return 0;

  const speed = getSpeedVec();

  const angle = getCarDirection().angleTo(speed);
  const reversing = angle < reverseAngle;
  const steerTorque = steerPower.current * (reversing ? -1 : 1);
  const steerModifier = steerModMap(speed.length());
  const speedAdjusted = steerTorque * steerModifier;
  const allWheelComp = wheelCompression.current.slice(0, 2).reduce((a, b) => a + b, 0) / 2;
  const compressionAdjusted = speedAdjusted * (Math.sqrt(allWheelComp) + 0.2);
  const surfaceModifier =
    wheelSurfaces.current.slice(0, 2).reduce((prev, curr) => {
      return prev + surfaceGrips[curr].dry.current;
    }, 0) / 2;
  const surfaceAdjusted = compressionAdjusted * surfaceModifier;

  return surfaceAdjusted;
}
