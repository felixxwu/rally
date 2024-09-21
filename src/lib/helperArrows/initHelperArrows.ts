import { onRender, scene } from '../../constant';
import { ref } from '../utils/ref';
import { updateHelperArrows } from './updateHelperArrows';
import { THREE } from '../utils/THREE';

export const travelArrow = ref<THREE.ArrowHelper | null>(null);

export function initHelperArrows() {
  travelArrow.current = new THREE.ArrowHelper();
  travelArrow.current.setColor(0x0000ff);
  scene.current?.add(travelArrow.current);

  onRender.push(updateHelperArrows);
}
