import AmmoType from 'ammojs-typed';
declare const Ammo: typeof AmmoType;

import { Vector } from '../road/createRoadShape';
import { THREE } from './THREE';

export function vec3(arr?: Vector) {
  if (!arr) return new THREE.Vector3();
  return new THREE.Vector3(arr[0], arr[1], arr[2]);
}

export function vecAmmo(arr: Vector) {
  return new Ammo.btVector3(arr[0], arr[1], arr[2]);
}

export function createArr(vector: THREE.Vector3): Vector {
  return [vector.x, vector.y, vector.z];
}
