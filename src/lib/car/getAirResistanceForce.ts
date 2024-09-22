import AmmoType from 'ammojs-typed';
declare const Ammo: typeof AmmoType;

import { minAirResistance } from '../../refs';
import { car } from '../../refs';
import { getDirectionOfTravel } from './getDirectionOfTravel';
import { airResistance } from '../../refs';
import { helperArrow } from '../helperArrows/helperArrow';
import { mult } from '../utils/multVec';
import { add } from '../utils/addVec';
import { THREE } from '../utils/THREE';

export function getAirResistanceForce(deltaTime: number) {
  if (!car.current) return new THREE.Vector3();

  const dir = getDirectionOfTravel(deltaTime);
  const inverseTravel = dir.clone().multiplyScalar(-airResistance.current);
  const squared = inverseTravel.clone().multiplyScalar(inverseTravel.length());
  const carPos = car.current.getWorldPosition(new THREE.Vector3());
  squared.setLength(squared.length() + minAirResistance);

  if (dir.length() > 0.01) {
    helperArrow(mult(inverseTravel, -2), add(carPos, [0, 1, 0]), 0x0000ff, 'travel');
    helperArrow(mult(squared, 0.1), add(carPos, [0, 1, 0]), 0xffffff, 'airResistance');
  }

  return squared;
}
