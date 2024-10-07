import AmmoType from 'ammojs-typed';
declare const Ammo: typeof AmmoType;

import { minAirResistance, selectedCar } from '../../refs';
import { car } from '../../refs';
import { helperArrow } from '../helperArrows/helperArrow';
import { mult } from '../utils/multVec';
import { add } from '../utils/addVec';
import { THREE } from '../utils/THREE';
import { getSpeedVec } from './getSpeedVec';
import { getCarPos } from './getCarTransform';

export function getAirResistanceForce() {
  if (!car.current) return new THREE.Vector3();

  const speed = getSpeedVec();
  const inverseTravel = speed.clone().multiplyScalar(-selectedCar.current.airResistance);
  const squared = inverseTravel.clone().multiplyScalar(inverseTravel.length());
  const carPos = getCarPos();
  squared.setLength(squared.length() + minAirResistance);

  if (speed.length() > 0.1) {
    helperArrow(mult(inverseTravel, -2), add(carPos, [0, 1, 0]), 0x0000ff, 'travel');
    helperArrow(mult(squared, 0.1), add(carPos, [0, 1, 0]), 0xffffff, 'airResistance');
  }

  return squared;
}
