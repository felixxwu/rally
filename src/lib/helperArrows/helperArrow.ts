import { scene } from '../../refs';
import { THREE } from '../utils/THREE';

const arrows = {};

export function helperArrow(vec: THREE.Vector3, origin: THREE.Vector3, color: number, id: string) {
  let arrowHelper: THREE.ArrowHelper = arrows[id];
  if (!arrowHelper) {
    arrowHelper = new THREE.ArrowHelper();
    scene.current?.add(arrowHelper);
    arrows[id] = arrowHelper;
  }

  arrowHelper.setDirection(vec.clone().normalize());
  arrowHelper.setLength(vec.length());
  arrowHelper.position.copy(origin);
  arrowHelper.setColor(color);

  return arrowHelper;
}
