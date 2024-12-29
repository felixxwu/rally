import { gear, selectedCar, shifting } from '../../refs';
import { getRPM } from './getRPM';
import { getSpeedVec } from './getSpeedVec';

export function shiftGear(direction: 'up' | 'down') {
  if (shifting.current) return;

  if (direction === 'up' && selectedCar.current.gears[gear.current + 1] !== undefined) {
    shifting.current = { start: window.performance.now(), oldGear: gear.current };
    gear.current++;
  }

  if (direction === 'down' && selectedCar.current.gears[gear.current - 1] !== undefined) {
    shifting.current = { start: window.performance.now(), oldGear: gear.current };
    gear.current--;
  }
}

export function shiftIfNeeded() {
  if (shifting.current) return;

  const speed = getSpeedVec();
  const car = selectedCar.current;
  const gearBelowRatio = car.gears[gear.current - 1];

  const rpm = getRPM();
  const rpmBelow = gearBelowRatio ? speed.length() * car.finalDrive * gearBelowRatio : null;

  if (rpm > car.redline * 0.9) {
    shiftGear('up');
    return;
  }

  if (rpmBelow && rpmBelow < car.redline * 0.6) {
    shiftGear('down');
    return;
  }
}
