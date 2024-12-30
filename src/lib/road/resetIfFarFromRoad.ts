import { infoText, progress, resetDistance, roadVecs, stageTimeStarted } from '../../refs';
import { getCarPos } from '../car/getCarTransform';
import { setCarPos } from '../car/setCarPos';
import { helperArrowFromTo } from '../helperArrows/helperArrow';
import { getProgressPercentage } from '../UI/HUD/Progress';
import { vec3 } from '../utils/createVec';
import { setInfoText } from '../UI/setInfoText';

let i = 0;

// TODO add opaque screen while car is resetting to road
export function resetIfFarFromRoad() {
  if (!stageTimeStarted.current) return;

  if (i++ % 10 !== 0) return;

  const vecs = roadVecs.current;
  const carPos = getCarPos();
  for (let i = progress.current; i < vecs.length; i++) {
    const vec = vec3(vecs[i]);
    if (carPos.clone().sub(vec).length() <= resetDistance) {
      helperArrowFromTo(carPos, vec, 0x00ff00, 'carPos');
      const progressMade = i - progress.current;

      if (progressMade > resetDistance * 2) {
        resetToLastProgress();
        return;
      }

      if (getProgressPercentage() < 100) {
        progress.current = i;
      }
    }
  }

  const furthestVec = vec3(vecs[progress.current] ?? [0, 0, 0]);
  const distFromFurthest = furthestVec.clone().sub(carPos).length();
  const text = 'Press (R) to reset to track';
  if (distFromFurthest > resetDistance) {
    setInfoText(text, 0, () => {
      console.trace();
      resetToLastProgress();
    });
  } else {
    if (infoText.current === text) {
      setInfoText('');
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
