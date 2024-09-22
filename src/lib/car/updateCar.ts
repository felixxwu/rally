import AmmoType from 'ammojs-typed';
declare const Ammo: typeof AmmoType;

import { keysDown } from '../initWindowListeners';
import { updatePhysics } from '../physics/updatePhysics';
import { THREE } from '../utils/THREE';
import { getUserData } from '../utils/userData';
import { oldCarPosition } from '../../refs';
import { car } from '../../refs';
import { getAmmoVector } from '../utils/vectorConversion';
import { getSteerTorque } from './getSteerTorque';
import { getAirResistanceForce } from './getAirResistanceForce';

export function updateCar(deltaTime: number) {
  if (!car.current) return;

  const objPhys = getUserData(car.current).physicsBody;
  const carTorque = new THREE.Vector3();
  const carPos = car.current.getWorldPosition(new THREE.Vector3());

  const airResistanceForce = getAirResistanceForce(deltaTime);
  const steerTorque = getSteerTorque(deltaTime);

  if (keysDown.a) {
    carTorque.add(new THREE.Vector3(0, -steerTorque, 0));
  }

  if (keysDown.d) {
    carTorque.add(new THREE.Vector3(0, steerTorque, 0));
  }

  objPhys?.applyCentralForce(getAmmoVector(airResistanceForce));
  objPhys?.applyLocalTorque(getAmmoVector(carTorque));

  updatePhysics(car.current);

  oldCarPosition.current = carPos.clone();
}
