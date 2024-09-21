import { THREE } from '../utils/THREE';
import { oldCarPosition } from '../../refs';
import { car } from '../../refs';
import { mult } from '../utils/multVec';

export function getDirectionOfTravel(deltaTime: number) {
  const pos = car.current?.getWorldPosition(new THREE.Vector3());
  const oldPos = oldCarPosition.current;

  if (!oldPos || !pos) return new THREE.Vector3();

  const diff = mult(pos.clone().sub(oldPos || new THREE.Vector3()), deltaTime * 130);

  return diff;
}
