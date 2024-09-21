import { frontWheelDrive, rearWheelDrive } from '../../refs';

export function wheelHasPower(front: boolean) {
  if (front) {
    return frontWheelDrive.current;
  } else {
    return rearWheelDrive.current;
  }
}
