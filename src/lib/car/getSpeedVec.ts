import { car } from '../../refs';
import { THREE } from '../utils/THREE';
import { getUserData } from '../utils/userData';

export function getSpeedVec(deltaTime: number) {
  if (!car.current) return new THREE.Vector3();

  const physicsBody = getUserData(car.current).physicsBody;
  const velocity = physicsBody.getLinearVelocity();
  return new THREE.Vector3(velocity.x(), velocity.y(), velocity.z());
}
