import { THREE } from '../utils/THREE';
import { selectedCar, wheelEndOffset } from '../../refs';
import { getCarDirection, getCarMeshDirection } from './getCarDirection';

export function getCarRelCorner(front: boolean, left: boolean) {
  const carEnd =
    getCarDirection(
      new THREE.Vector3(
        0,
        0,
        (selectedCar.current.length / 2 - selectedCar.current.wheelRadius - wheelEndOffset) *
          (front ? 1 : -1)
      )
    ) || new THREE.Vector3();
  const carSide =
    getCarDirection(new THREE.Vector3((selectedCar.current.width / 2) * (left ? 1 : -1), 0, 0)) ||
    new THREE.Vector3();

  return carEnd.clone().add(carSide);
}

export function getCarMeshRelCorner(front: boolean, left: boolean) {
  const carEnd =
    getCarMeshDirection(
      new THREE.Vector3(
        0,
        0,
        (selectedCar.current.length / 2 - selectedCar.current.wheelRadius - wheelEndOffset) *
          (front ? 1 : -1)
      )
    ) || new THREE.Vector3();
  const carSide =
    getCarMeshDirection(
      new THREE.Vector3((selectedCar.current.width / 2) * (left ? 1 : -1), 0, 0)
    ) || new THREE.Vector3();

  return carEnd.clone().add(carSide);
}
