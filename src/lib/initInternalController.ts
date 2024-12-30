import {
  internalController,
  keysDown,
  menuBack,
  menuDown,
  menuLeft,
  menuPause,
  menuRight,
  menuSelect,
  menuUp,
  mobileJoystickPad,
  onRenderNoPausing,
  stopInternalController,
} from '../refs';
import { getGamepadInputs } from './getGamepadInputs';

export function initInternalController() {
  onRenderNoPausing.current.push(() => {
    if (stopInternalController.current) return;

    const gamepad = getGamepadInputs();

    internalController.current.steer = Math.max(
      -1,
      Math.min(
        (keysDown.current['d'] ? 1 : 0) +
          (keysDown.current['a'] ? -1 : 0) +
          (keysDown.current['ArrowRight'] ? 1 : 0) +
          (keysDown.current['ArrowLeft'] ? -1 : 0) +
          (mobileJoystickPad.current.x * 2 - 1) +
          gamepad.steer,
        1
      )
    );
    internalController.current.brake = Math.max(
      0,
      Math.min(
        (keysDown.current['s'] ? 1 : 0) +
          (keysDown.current['ArrowDown'] ? 1 : 0) +
          (mobileJoystickPad.current.y * 2 - 1) +
          gamepad.brake,
        1
      )
    );
    internalController.current.handbrake =
      internalController.current.brake !== 0
        ? 0
        : Math.max(0, Math.min((keysDown.current[' '] ? 1 : 0) + gamepad.handbrake, 1));
    internalController.current.throttle =
      internalController.current.handbrake !== 0
        ? 0
        : Math.max(
            0,
            Math.min(
              (keysDown.current['w'] ? 1 : 0) +
                (keysDown.current['ArrowUp'] ? 1 : 0) +
                (mobileJoystickPad.current.y * -2 + 1) +
                gamepad.throttle,
              1
            )
          );

    menuUp.current = keysDown.current['ArrowUp'] || keysDown.current['w'] || gamepad.up >= 0.5;

    menuDown.current =
      keysDown.current['ArrowDown'] || keysDown.current['s'] || gamepad.down >= 0.5;

    menuLeft.current =
      keysDown.current['ArrowLeft'] || keysDown.current['a'] || gamepad.left >= 0.5;

    menuRight.current =
      keysDown.current['ArrowRight'] || keysDown.current['d'] || gamepad.right >= 0.5;

    menuSelect.current =
      keysDown.current['Enter'] || keysDown.current[' '] || gamepad.menuSelect >= 0.5;

    menuBack.current =
      keysDown.current['Escape'] || keysDown.current['Backspace'] || gamepad.menuBack >= 0.5;

    menuPause.current = keysDown.current['Escape'] || gamepad.pause >= 0.5;

    internalController.current.gearUp = keysDown.current[']'] || gamepad.gearUp >= 0.5;
    internalController.current.gearDown = keysDown.current['['] || gamepad.gearDown >= 0.5;
  });
}
