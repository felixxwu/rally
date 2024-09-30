import { driveTrain } from '../../refs';

export function wheelHasPower(front: boolean) {
  if (driveTrain.current === 'AWD') return true;
  if (driveTrain.current === 'FWD') return front;
  if (driveTrain.current === 'RWD') return !front;
  return false;
}
