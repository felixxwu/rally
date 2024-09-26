import { THREE } from '../utils/THREE';
import { getCarRelCorner } from './getCarRelCorner';
import { car } from '../../refs';
import { getUserData } from '../utils/userData';

export function getCarCornerPos(front: boolean, left: boolean) {
  if (!car.current) return new THREE.Vector3();

  const carPosAmmo = getUserData(car.current).physicsBody.getWorldTransform().getOrigin();
  const carPos = new THREE.Vector3(carPosAmmo.x(), carPosAmmo.y(), carPosAmmo.z());
  return carPos?.clone().add(getCarRelCorner(front, left)) || new THREE.Vector3();
}

export function getCarCornerMeshPos(front: boolean, left: boolean) {
  if (!car.current) return new THREE.Vector3();

  const carPos = car.current?.getWorldPosition(new THREE.Vector3());
  return carPos?.clone().add(getCarRelCorner(front, left)) || new THREE.Vector3();
}
