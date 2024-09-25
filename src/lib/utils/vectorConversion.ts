import AmmoType from 'ammojs-typed';
import { THREE } from './THREE';
declare const Ammo: typeof AmmoType;

export function getAmmoVector(vector: THREE.Vector3) {
  return new Ammo.btVector3(vector.x, vector.y, vector.z);
}

export function getThreeVector(vector: AmmoType.btVector3) {
  return new THREE.Vector3(vector.x(), vector.y(), vector.z());
}
