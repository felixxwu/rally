import { selectedCar } from '../../refs';

export function wheelHasPower(front: boolean) {
  if (selectedCar.current.driveTrain === 'AWD') return true;
  if (selectedCar.current.driveTrain === 'FWD') return front;
  if (selectedCar.current.driveTrain === 'RWD') return !front;
  return false;
}
