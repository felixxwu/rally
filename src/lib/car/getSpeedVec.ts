import { getOldNewPosDiff } from './getDirectionOfTravel';

export function getSpeedVec(deltaTime: number) {
  const diff = getOldNewPosDiff();
  return diff.clone().divideScalar(deltaTime);
}
