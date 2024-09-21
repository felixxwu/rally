import { getDirectionOfTravel } from '../car/getDirectionOfTravel';
import { car } from '../../constant';
import { THREE } from '../utils/THREE';
import { travelArrow } from './initHelperArrows';

export function updateHelperArrows(deltaTime: number) {
  const pos = car.current?.getWorldPosition(new THREE.Vector3());

  const diff = getDirectionOfTravel().multiplyScalar(0.5 / deltaTime);

  travelArrow.current?.position.copy((pos || new THREE.Vector3()).add(new THREE.Vector3(0, 1, 0)));
  travelArrow.current?.setDirection(diff?.clone().normalize() || new THREE.Vector3());
  travelArrow.current?.setLength(diff?.length() || 0);
}
