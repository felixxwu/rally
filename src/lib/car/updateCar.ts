import { carVisible, internalController, stageTimeStarted } from '../../refs';
import { updatePhysics } from '../physics/updatePhysics';
import { THREE } from '../utils/THREE';
import { getUserData } from '../utils/userData';
import { car } from '../../refs';
import { getAmmoVector } from '../utils/vectorConversion';
import { getDragForce } from './getDragForce';
import { getMaxSteerTorque } from './getSteerTorque';
import { shiftIfNeeded } from './shiftGear';
import { getDownforce } from './getDownforce';

export function updateCar() {
  if (!car.current) return;

  car.current.visible = carVisible.current;

  const objPhys = getUserData(car.current).physicsBody;
  const carTorque = new THREE.Vector3();

  const dragForce = getDragForce();
  const { front, frontOrigin, rear, rearOrigin } = getDownforce();
  const steerTorque = getMaxSteerTorque();

  const steerValue = internalController.current.steer;

  carTorque.add(new THREE.Vector3(0, steerTorque * steerValue, 0));

  objPhys?.applyCentralForce(getAmmoVector(dragForce));
  objPhys?.applyForce(front, frontOrigin);
  objPhys?.applyForce(rear, rearOrigin);

  if (stageTimeStarted.current) {
    objPhys?.applyLocalTorque(getAmmoVector(carTorque));
  }

  updatePhysics(car.current);

  shiftIfNeeded();
}
