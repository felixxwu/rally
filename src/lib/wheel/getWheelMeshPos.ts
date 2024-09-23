import { getCarCornerPos } from '../car/getCarCorner';
import { car } from '../../refs';
import { THREE } from '../utils/THREE';
import { wheelRadius } from '../../refs';
import { springLength } from '../../refs';

export function getWheelMeshPos(compression: number, front: boolean, left: boolean) {
  if (!car.current) {
    return { wheelMeshPos: new THREE.Vector3(), wheelOffsetFromCorner: new THREE.Vector3() };
  }

  const quat = car.current.getWorldQuaternion(new THREE.Quaternion());
  const wheelPos = getCarCornerPos(front, left);
  const suspensionLength = Math.min(wheelRadius - (springLength.current - compression), 0);
  const wheelOffset = new THREE.Vector3(0, suspensionLength, 0);
  const wheelOffsetFromCorner = wheelOffset.applyQuaternion(quat);
  return { wheelMeshPos: wheelPos.clone().add(wheelOffset), wheelOffsetFromCorner };
}
