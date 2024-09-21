import AmmoType from 'ammojs-typed';
declare const Ammo: typeof AmmoType;

import { keysDown } from '../initWindowListeners';
import { updatePhysics } from '../physics/updatePhysics';
import { THREE } from '../utils/THREE';
import { getUserData } from '../utils/userData';
import { oldCarPosition } from '../../constant';
import { car } from '../../constant';
import { airResistanceArrow } from '../../constant';
import { getAmmoVector } from '../utils/vectorConversion';
import { getDirectionOfTravel } from './getDirectionOfTravel';
import { airResistance, steerPower } from '../../constant';

export function updateCar(deltaTime: number) {
  if (!car.current) return;

  const objPhys = getUserData(car.current).physicsBody;
  const carForce = new THREE.Vector3();
  const carTorque = new THREE.Vector3();
  const carPos = car.current.getWorldPosition(new THREE.Vector3());
  const directionOfTravel = getDirectionOfTravel().multiplyScalar(-airResistance);
  const squared = directionOfTravel.clone().multiplyScalar(directionOfTravel.length());
  oldCarPosition.current = carPos.clone();

  airResistanceArrow.current?.position.copy(carPos.add(new THREE.Vector3(0, 1, 0)));
  airResistanceArrow.current?.setDirection(squared.clone().normalize());
  airResistanceArrow.current?.setLength(squared.length() * deltaTime * 10);

  carForce.add(squared);

  if (keysDown.a) {
    carTorque.add(new THREE.Vector3(0, steerPower, 0));
  }

  if (keysDown.d) {
    carTorque.add(new THREE.Vector3(0, -steerPower, 0));
  }

  objPhys?.applyCentralForce(getAmmoVector(carForce));
  objPhys?.applyLocalTorque(getAmmoVector(carTorque));

  updatePhysics(car.current);
}
