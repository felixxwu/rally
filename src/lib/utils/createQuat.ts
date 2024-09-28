import AmmoType from 'ammojs-typed';
declare const Ammo: typeof AmmoType;
import { THREE } from './THREE';

export function createQuat(
  fromVec: THREE.Vector3,
  toVec: THREE.Vector3,
  angleLimit: number = Infinity
) {
  const cross = fromVec.clone().cross(toVec).normalize();
  const angle = fromVec.clone().angleTo(toVec);
  const quat = new THREE.Quaternion().setFromAxisAngle(cross, Math.min(angle, angleLimit));
  return { threeQuat: quat, ammoQuat: new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w) };
}
