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
  mobileButtons,
  mobileInput,
  onRenderNoPausing,
  stopInternalController,
} from '../refs';
import { getGamepadInputs } from './getGamepadInputs';
import { isMobileDevice } from './utils/isMobileDevice';

export function initInternalController() {
  onRenderNoPausing.current.push(() => {
    if (stopInternalController.current) return;

    const gamepad = getGamepadInputs();

    // Mobile button controls: left/right for steering, brake button (only if in 'buttons' mode)
    const mobileSteer =
      mobileInput.current === 'buttons'
        ? (mobileButtons.current.left ? -1 : 0) + (mobileButtons.current.right ? 1 : 0)
        : 0;
    const mobileBrakeInput =
      mobileInput.current === 'buttons' && mobileButtons.current.brake ? 1 : 0;

    internalController.current.steer = Math.max(
      -1,
      Math.min(
        (keysDown.current['d'] ? 1 : 0) +
          (keysDown.current['a'] ? -1 : 0) +
          (keysDown.current['ArrowRight'] ? 1 : 0) +
          (keysDown.current['ArrowLeft'] ? -1 : 0) +
          mobileSteer +
          (mobileInput.current !== 'buttons' ? mobileJoystickPad.current.x * 2 - 1 : 0) +
          gamepad.steer,
        1
      )
    );
    internalController.current.brake = Math.max(
      0,
      Math.min(
        (keysDown.current['s'] ? 1 : 0) +
          (keysDown.current['ArrowDown'] ? 1 : 0) +
          mobileBrakeInput +
          (mobileInput.current !== 'buttons' ? mobileJoystickPad.current.y * 2 - 1 : 0) +
          gamepad.brake,
        1
      )
    );
    internalController.current.handbrake =
      internalController.current.brake !== 0
        ? 0
        : Math.max(0, Math.min((keysDown.current[' '] ? 1 : 0) + gamepad.handbrake, 1));

    // Calculate throttle input
    const keyboardThrottle =
      (keysDown.current['w'] ? 1 : 0) + (keysDown.current['ArrowUp'] ? 1 : 0);
    const gamepadThrottle = gamepad.throttle;
    const joystickThrottle =
      mobileInput.current !== 'buttons' ? mobileJoystickPad.current.y * -2 + 1 : 0;
    const manualThrottleInput = keyboardThrottle + gamepadThrottle + joystickThrottle;

    // Check if user is manually braking
    const manualBrake =
      keysDown.current['s'] ||
      keysDown.current['ArrowDown'] ||
      (mobileInput.current === 'buttons' && mobileButtons.current.brake) ||
      gamepad.brake > 0;

    // Auto-accelerate on mobile devices in buttons mode
    const mobileDevice = isMobileDevice();
    const shouldAutoAccelerate =
      mobileDevice && mobileInput.current === 'buttons' && !manualThrottleInput;

    // Calculate throttle value
    if (internalController.current.handbrake !== 0 || manualBrake) {
      internalController.current.throttle = 0;
    } else if (shouldAutoAccelerate) {
      internalController.current.throttle = 1;
    } else if (manualThrottleInput > 0) {
      internalController.current.throttle = Math.max(0, Math.min(manualThrottleInput, 1));
    } else {
      internalController.current.throttle = 0;
    }

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
