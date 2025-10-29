import { transformAux1 } from '../../refs';
import { getUserData } from '../utils/userData';
import { Mesh } from '../../types';
import { THREE } from '../utils/THREE';

// Reusable objects to avoid allocations
const pVecCache = new THREE.Vector3();
const quatCache = new THREE.Quaternion();

// Exponential moving average for position smoothing to reduce jitter
// Lower alpha = more smoothing but more lag, higher alpha = less smoothing but responsive
const SMOOTHING_ALPHA = 0.3; // 70% new value, 30% old value

export function updatePhysics(objThree: Mesh) {
  const objPhys = getUserData(objThree).physicsBody;
  const ms = objPhys.getMotionState();
  if (ms && transformAux1.current) {
    ms.getWorldTransform(transformAux1.current);
    const p = transformAux1.current?.getOrigin();
    const q = transformAux1.current?.getRotation();

    // Get current physics position
    const currentPos = pVecCache.set(p.x(), p.y(), p.z());
    const currentQuat = quatCache.set(q?.x() ?? 0, q?.y() ?? 0, q?.z() ?? 0, q?.w() ?? 0);

    // Apply exponential moving average to reduce jitter from multiple physics steps per frame
    // This smooths the position without introducing significant lag
    objThree.position.lerp(currentPos, SMOOTHING_ALPHA);

    // Quaternion update (update directly - rotation smoothing can cause visual issues)
    objThree.quaternion.copy(currentQuat);
  }
}
