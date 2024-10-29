import { ammoVehicle, car } from '../../refs';
import { THREE } from '../utils/THREE';

export function getCarPos() {
  if (!car.current) return new THREE.Vector3();

  const ammoTransform = ammoVehicle.current!.getChassisWorldTransform().getOrigin();
  const transform = new THREE.Vector3(ammoTransform.x(), ammoTransform.y(), ammoTransform.z());

  return transform;
}

export function getCarMeshPos() {
  if (!car.current) return new THREE.Vector3();

  const transform = car.current.getWorldPosition(new THREE.Vector3());

  return transform;
}
