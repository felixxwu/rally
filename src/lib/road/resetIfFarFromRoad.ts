import { ref } from '../utils/ref';
import { Vector } from './createRoadShape';

export const progress = ref(0);

export function resetIfFarFromRoad(vecs: Vector[]) {
  const vec = vecs[progress.current];
}
