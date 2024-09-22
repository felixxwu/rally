import { Vector } from '../terrain/createShape';
import { THREE } from './THREE';

export function createVec(arr: Vector) {
  return new THREE.Vector3(arr[0], arr[1], arr[2]);
}

export function createArr(vector: THREE.Vector3): Vector {
  return [vector.x, vector.y, vector.z];
}
