import { renderHelperArrows, scene } from '../../refs';
import { ref } from '../utils/ref';
import { THREE } from '../utils/THREE';

const arrows = ref<Record<string, THREE.ArrowHelper>>({});

export function helperArrow(vec: THREE.Vector3, origin: THREE.Vector3, color: number, id: string) {
  let arrowHelper = arrows.current[id];
  if (!arrowHelper) {
    arrowHelper = new THREE.ArrowHelper();
    scene.current?.add(arrowHelper);
    arrows.current[id] = arrowHelper;
  }

  arrowHelper.setDirection(vec.clone().normalize());
  arrowHelper.setLength(vec.length());
  arrowHelper.position.copy(origin);
  arrowHelper.setColor(color);

  arrowHelper.visible = renderHelperArrows.current;

  return arrowHelper;
}

export function helperArrowFromTo(
  from: THREE.Vector3,
  to: THREE.Vector3,
  color: number,
  id: string
) {
  return helperArrow(to.clone().sub(from), from, color, id);
}
