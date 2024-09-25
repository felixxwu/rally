import { car } from '../../refs';
import { THREE } from '../utils/THREE';
import { getUserData } from '../utils/userData';

export function getCarTransform() {
  if (!car.current) return new THREE.Vector3();

  const ammoTransform = getUserData(car.current).physicsBody.getWorldTransform().getOrigin();
  const transform = new THREE.Vector3(ammoTransform.x(), ammoTransform.y(), ammoTransform.z());

  return transform;
}
