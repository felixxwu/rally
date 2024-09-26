import AmmoType from 'ammojs-typed';
declare const Ammo: typeof AmmoType;

import { keysDown } from '../initWindowListeners';
import { updatePhysics } from '../physics/updatePhysics';
import { THREE } from '../utils/THREE';
import { getUserData } from '../utils/userData';
import { car } from '../../refs';
import { getAmmoVector } from '../utils/vectorConversion';
import { getSteerTorque } from './getSteerTorque';
import { getAirResistanceForce } from './getAirResistanceForce';

export function updateCar() {
  if (!car.current) return;

  const objPhys = getUserData(car.current).physicsBody;
  const carTorque = new THREE.Vector3();

  const airResistanceForce = getAirResistanceForce();
  const steerTorque = getSteerTorque();

  if (keysDown.current.a) {
    carTorque.add(new THREE.Vector3(0, -steerTorque, 0));
  }

  if (keysDown.current.d) {
    carTorque.add(new THREE.Vector3(0, steerTorque, 0));
  }

  objPhys?.applyCentralForce(getAmmoVector(airResistanceForce));
  objPhys?.applyLocalTorque(getAmmoVector(carTorque));

  updatePhysics(car.current);
}
