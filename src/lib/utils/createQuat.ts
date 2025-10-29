import AmmoType from 'ammojs-typed';
declare const Ammo: typeof AmmoType;
import { THREE } from './THREE';

export function createQuat(
  fromVec: THREE.Vector3,
  toVec: THREE.Vector3,
  angleLimit: number = Infinity
) {
  // Validate and normalize input vectors for angle calculation
  const fromLength = fromVec.length();
  const toLength = toVec.length();

  if (fromLength < 0.001 || toLength < 0.001) {
    // Invalid vectors, return identity quaternion
    return {
      threeQuat: new THREE.Quaternion(),
      ammoQuat: new Ammo.btQuaternion(0, 0, 0, 1),
    };
  }

  const fromNorm = fromVec.clone().normalize();
  const toNorm = toVec.clone().normalize();

  // Calculate cross product for rotation axis
  const cross = fromNorm.clone().cross(toNorm);
  const crossLength = cross.length();

  // Handle edge cases: parallel vectors (cross product is zero)
  if (crossLength < 0.001) {
    // Vectors are parallel or anti-parallel
    // Check if they're pointing in the same direction
    const dot = fromNorm.dot(toNorm);
    if (dot > 0.99) {
      // Same direction - no rotation needed
      return {
        threeQuat: new THREE.Quaternion(),
        ammoQuat: new Ammo.btQuaternion(0, 0, 0, 1),
      };
    } else {
      // Opposite direction - 180 degree rotation around Y axis
      return {
        threeQuat: new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI),
        ammoQuat: new Ammo.btQuaternion(0, 1, 0, 0),
      };
    }
  }

  // Normalize cross product to get rotation axis
  cross.normalize();
  const angle = fromNorm.angleTo(toNorm);
  const quat = new THREE.Quaternion().setFromAxisAngle(cross, Math.min(angle, angleLimit));
  return { threeQuat: quat, ammoQuat: new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w) };
}
