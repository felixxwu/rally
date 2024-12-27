import AmmoType from 'ammojs-typed';
declare const Ammo: typeof AmmoType;

import { carVisible, internalController, stageTimeStarted } from '../../refs';
import { updatePhysics } from '../physics/updatePhysics';
import { THREE } from '../utils/THREE';
import { getUserData } from '../utils/userData';
import { car } from '../../refs';
import { getAmmoVector } from '../utils/vectorConversion';
import { getAirResistanceForce } from './getAirResistanceForce';
import { getMaxSteerTorque } from './getSteerTorque';
import { shiftIfNeeded } from './shiftGear';

export function updateCar() {
  if (!car.current) return;

  car.current.visible = carVisible.current;

  const objPhys = getUserData(car.current).physicsBody;
  const carTorque = new THREE.Vector3();

  const airResistanceForce = getAirResistanceForce();
  const steerTorque = getMaxSteerTorque();

  const steerValue = internalController.current.steer;

  carTorque.add(new THREE.Vector3(0, steerTorque * steerValue, 0));

  objPhys?.applyCentralForce(getAmmoVector(airResistanceForce));

  if (stageTimeStarted.current) {
    objPhys?.applyLocalTorque(getAmmoVector(carTorque));
  }

  updatePhysics(car.current);

  shiftIfNeeded();
}
