import { progress, resetDistance, roadVecs } from '../../refs';
import { getCarPos } from '../car/getCarTransform';
import { setCarPos } from '../car/setCarPos';
import { helperArrowFromTo } from '../helperArrows/helperArrow';
import { vec3 } from '../utils/createVec';

export function resetIfFarFromRoad() {
  const vecs = roadVecs.current;
  const carPos = getCarPos();
  for (let i = progress.current; i < vecs.length; i++) {
    const vec = vec3(vecs[i]);
    if (carPos.clone().sub(vec).length() <= resetDistance) {
      helperArrowFromTo(carPos, vec, 0xffffff, 'carPos');
      const progressMade = i - progress.current;

      if (progressMade > resetDistance) {
        resetToLastProgress();
        return;
      }
      progress.current = i;
      break;
    }
  }
}

export function resetToLastProgress() {
  const vecs = roadVecs.current;
  const dir = vec3(vecs[progress.current])
    .clone()
    .sub(vec3(vecs[progress.current - 1] ?? vecs[0]));

  setCarPos(vec3(vecs[progress.current]).add(vec3([0, 5, 0])), dir);
}