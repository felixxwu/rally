import {
  internalController,
  keysDown,
  keysDownMobile,
  menuBack,
  menuDown,
  menuLeft,
  menuRight,
  menuSelect,
  menuUp,
  onRender,
  stopInternalController,
} from '../refs';
import {
  getGamepad,
  getGamepadBrake,
  getGamepadHandbrake,
  getGamepadSteer,
  getGamepadThrottle,
} from './utils/getGamepad';

export function initInternalController() {
  onRender.push(() => {
    if (stopInternalController.current) return;

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

    menuUp.current =
      keysDown.current['ArrowUp'] ||
      keysDown.current['w'] ||
      getGamepad()?.buttons?.[12]?.value >= 0.5;

    menuDown.current =
      keysDown.current['ArrowDown'] ||
      keysDown.current['s'] ||
      getGamepad()?.buttons?.[13]?.value >= 0.5;

    menuLeft.current =
      keysDown.current['ArrowLeft'] ||
      keysDown.current['a'] ||
      getGamepad()?.buttons?.[14]?.value >= 0.5;

    menuRight.current =
      keysDown.current['ArrowRight'] ||
      keysDown.current['d'] ||
      getGamepad()?.buttons?.[15]?.value >= 0.5;

    menuSelect.current =
      keysDown.current['Enter'] ||
      keysDown.current[' '] ||
      getGamepad()?.buttons?.[0]?.value >= 0.5;

    menuBack.current =
      keysDown.current['Escape'] ||
      keysDown.current['Backspace'] ||
      getGamepad()?.buttons?.[1]?.value >= 0.5;
  });
}
