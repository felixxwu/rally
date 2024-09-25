import { THREE } from '../utils/THREE';
import { getCarRelCorner } from './getCarRelCorner';
import { car } from '../../refs';
import { getUserData } from '../utils/userData';
import { getThreeVector } from '../utils/vectorConversion';

export function getCarAmmoCorner(front: boolean, left: boolean) {
  if (!car.current) return new THREE.Vector3();

  const carPos = getThreeVector(
    getUserData(car.current).physicsBody.getWorldTransform().getOrigin()
  );
  return carPos?.clone().add(getCarRelCorner(front, left)) || new THREE.Vector3();
}
