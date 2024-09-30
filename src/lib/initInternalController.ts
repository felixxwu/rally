import {
  internalController,
  keysDown,
  keysDownMobile,
  menuBack,
  menuDown,
  menuLeft,
  menuPause,
  menuRight,
  menuSelect,
  menuUp,
  onRenderNoPausing,
  stopInternalController,
} from '../refs';
import { getGamepad } from './utils/getGamepad';

export function initInternalController() {
  onRenderNoPausing.push(() => {
    if (stopInternalController.current) return;

    internalController.current.steer = Math.max(
      -1,
      Math.min(
        (keysDown.current['d'] ? 1 : 0) +
          (keysDown.current['a'] ? -1 : 0) +
          (keysDown.current['ArrowRight'] ? 1 : 0) +
          (keysDown.current['ArrowLeft'] ? -1 : 0) +
          (keysDownMobile.current['d'] ? 1 : 0) +
          (keysDownMobile.current['a'] ? -1 : 0) +
          (getGamepad()?.axes?.[0] ?? 0),
        1
      )
    );
    internalController.current.throttle = Math.max(
      0,
      Math.min(
        (keysDown.current['w'] ? 1 : 0) +
          (keysDown.current['ArrowUp'] ? 1 : 0) +
          (keysDownMobile.current['w'] ? 1 : 0) +
          (getGamepad()?.buttons?.[7]?.value ?? 0) +
          (getGamepad()?.buttons?.[9]?.value ?? 0),
        1
      )
    );
    internalController.current.brake = Math.max(
      0,
      Math.min(
        (keysDown.current['s'] ? 1 : 0) +
          (keysDown.current['ArrowDown'] ? 1 : 0) +
          (keysDownMobile.current['s'] ? 1 : 0) +
          (getGamepad()?.buttons?.[6]?.value ?? 0) +
          (getGamepad()?.buttons?.[8]?.value ?? 0),
        1
      )
    );
    internalController.current.handbrake = Math.max(
      0,
      Math.min((keysDown.current[' '] ? 1 : 0) + (getGamepad()?.buttons?.[1]?.value ?? 0), 1)
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

    menuPause.current = keysDown.current['Escape'];
  });
}
