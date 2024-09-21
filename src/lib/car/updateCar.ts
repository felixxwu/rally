import AmmoType from 'ammojs-typed';
declare const Ammo: typeof AmmoType;

import { keysDown } from '../initWindowListeners';
import { updatePhysics } from '../physics/updatePhysics';
import { THREE } from '../utils/THREE';
import { getUserData } from '../utils/userData';
import { minAirResistance, oldCarPosition, reverseAngle } from '../../refs';
import { car } from '../../refs';
import { getAmmoVector } from '../utils/vectorConversion';
import { getDirectionOfTravel } from './getDirectionOfTravel';
import { airResistance, steerPower } from '../../refs';
import { helperArrow } from '../helperArrows/helperArrow';
import { add } from '../utils/addVec';
import { mult } from '../utils/multVec';
import { getCarDirection } from './getCarDirection';

export function updateCar() {
  if (!car.current) return;

  const objPhys = getUserData(car.current).physicsBody;
  const carForce = new THREE.Vector3();
  const carTorque = new THREE.Vector3();
  const carPos = car.current.getWorldPosition(new THREE.Vector3());
  const dir = getDirectionOfTravel();
  const inverseTravel = dir.clone().multiplyScalar(-airResistance.current);
  const squared = inverseTravel.clone().multiplyScalar(inverseTravel.length());
  squared.setLength(squared.length() + minAirResistance);
  oldCarPosition.current = carPos.clone();

  carForce.add(squared);

  const angle = getCarDirection().angleTo(dir);
  const reversing = angle < reverseAngle;
  const steerTorque = steerPower.current * (reversing ? -1 : 1);
  const slowSpeedModifier = Math.min(dir.length() * 15, 5);
  const highSpeedModifier = dir.length() * -2.5;
  const speedAdjusted = steerTorque * (slowSpeedModifier + highSpeedModifier);

  if (keysDown.a) {
    carTorque.add(new THREE.Vector3(0, -speedAdjusted, 0));
  }

  if (keysDown.d) {
    carTorque.add(new THREE.Vector3(0, speedAdjusted, 0));
  }

  objPhys?.applyCentralForce(getAmmoVector(carForce));
  objPhys?.applyLocalTorque(getAmmoVector(carTorque));

  helperArrow(mult(inverseTravel, -1), add(carPos, [0, 1, 0]), 0x0000ff, 'travel');
  helperArrow(mult(squared, 0.05), add(carPos, [0, 1, 0]), 0xffffff, 'airResistance');

  updatePhysics(car.current);
}
