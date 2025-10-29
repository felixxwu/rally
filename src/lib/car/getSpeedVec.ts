import { car } from '../../refs';
import { THREE } from '../utils/THREE';
import { getUserData } from '../utils/userData';

// Reusable object to avoid allocations
// Note: We still clone on return because some callers mutate the vector
const speedVecCache = new THREE.Vector3();

export function getSpeedVec() {
  if (!car.current) return new THREE.Vector3();

  const physicsBody = getUserData(car.current).physicsBody;
  const velocity = physicsBody.getLinearVelocity();
  speedVecCache.set(velocity.x(), velocity.y(), velocity.z());
  return speedVecCache.clone();
}
