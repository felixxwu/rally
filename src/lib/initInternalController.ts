import { internalController, keysDown, keysDownMobile, onRender } from '../refs';
import {
  getGamepadBrake,
  getGamepadHandbrake,
  getGamepadSteer,
  getGamepadThrottle,
} from './utils/getGamepad';

export function initInternalController() {
  onRender.push(() => {
    internalController.current.steer = Math.max(
      -1,
      Math.min(
        (keysDown.current['d'] ? 1 : 0) +
          (keysDown.current['a'] ? -1 : 0) +
          (keysDownMobile.current['d'] ? 1 : 0) +
          (keysDownMobile.current['a'] ? -1 : 0) +
          getGamepadSteer(),
        1
      )
    );
    internalController.current.throttle = Math.max(
      0,
      Math.min(
        (keysDown.current['w'] ? 1 : 0) +
          (keysDownMobile.current['w'] ? 1 : 0) +
          getGamepadThrottle(),
        1
      )
    );
    internalController.current.brake = Math.max(
      0,
      Math.min(
        (keysDown.current['s'] ? 1 : 0) + (keysDownMobile.current['s'] ? 1 : 0) + getGamepadBrake(),
        1
      )
    );
    internalController.current.handbrake = Math.max(
      0,
      Math.min((keysDown.current[' '] ? 1 : 0) + getGamepadHandbrake(), 1)
    );
  });
}
