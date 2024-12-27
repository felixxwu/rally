import { gear, selectedCar, shifting } from '../../refs';
import { getSpeedVec } from './getSpeedVec';
import { lerp } from 'three/src/math/MathUtils';

export function getRPM() {
  const speed = getSpeedVec();
  const car = selectedCar.current;
  const gearRatio = car.gears[gear.current];
  const oldGear = shifting.current ? shifting.current.oldGear : gear.current;
  const oldGearRatio = car.gears[oldGear];
  const shiftProgress = shifting.current
    ? (window.performance.now() - shifting.current.start) / car.shiftTime
    : 1;

  if (shiftProgress >= 1) {
    shifting.current = null;
  }

  const finalGearRatio = lerp(oldGearRatio, gearRatio, Math.min(1, shiftProgress));
  return Math.round(speed.length() * car.finalDrive * finalGearRatio);
}
