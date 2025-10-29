import { infoText, progress, resetDistance, roadVecs, stageTimeStarted } from '../../refs';
import { getCarPos } from '../car/getCarTransform';
import { setCarPos } from '../car/setCarPos';
import { helperArrowFromTo } from '../helperArrows/helperArrow';
import { getProgressPercentage } from '../UI/HUD/Progress';
import { vec3 } from '../utils/createVec';
import { setInfoText } from '../UI/setInfoText';
import { THREE } from '../utils/THREE';

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
  if (vecs.length === 0) return;

  const currentIdx = progress.current;
  const currentPos = vec3(vecs[currentIdx]);

  // Calculate forward direction: prefer next point, fallback to previous point
  let dir: THREE.Vector3;
  if (currentIdx < vecs.length - 1) {
    // Use forward direction (to next point)
    dir = vec3(vecs[currentIdx + 1])
      .clone()
      .sub(currentPos);
  } else if (currentIdx > 0) {
    // At the end, use backward direction (from previous point)
    dir = currentPos.clone().sub(vec3(vecs[currentIdx - 1]));
  } else {
    // Only one point, use default forward direction
    dir = vec3([0, 0, 1]);
  }

  // Normalize the direction vector
  // Project to horizontal plane to avoid pointing up/down
  dir.y = 0;
  if (dir.length() < 0.001) {
    // If direction is too small (parallel points), use default forward
    dir = vec3([0, 0, 1]);
  } else {
    dir.normalize();
  }

  setCarPos(currentPos.clone().add(vec3([0, 1, 0])), dir);
}
