import { THREE } from '../utils/THREE';
import { wheelEndOffset, wheelRadius } from '../../refs';
import { getCarDirection } from './getCarDirection';
import { carWidth } from '../../refs';
import { carLength } from '../../refs';

export function getCarRelCorner(front: boolean, left: boolean) {
  const carEnd =
    getCarDirection(
      new THREE.Vector3(0, 0, (carLength / 2 - wheelRadius - wheelEndOffset) * (front ? 1 : -1))
    ) || new THREE.Vector3();
  const carSide =
    getCarDirection(new THREE.Vector3((carWidth / 2) * (left ? 1 : -1), 0, 0)) ||
    new THREE.Vector3();

  return carEnd.clone().add(carSide);
}
