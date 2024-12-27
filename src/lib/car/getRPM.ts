import { gear, selectedCar } from '../../refs';
import { getSpeedVec } from './getSpeedVec';

export function getRPM() {
  const speed = getSpeedVec();
  const car = selectedCar.current;
  return Math.round(speed.length() * car.finalDrive * selectedCar.current.gears[gear.current]);
}
