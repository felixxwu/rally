import { getGamepad } from './utils/getGamepad';
import { controllerOS } from '../refs';

export function getGamepadInputs() {
  const pad = getGamepad();
  const axes = pad?.axes;
  const buttons = pad?.buttons;

  if (controllerOS.current === 'windows') {
    return {
      steer: deadzoneify(axes?.[0] ?? 0),
      throttle: buttons?.[7]?.value ?? 0,
      brake: buttons?.[6]?.value ?? 0,
      handbrake: buttons?.[1]?.value ?? 0,
      up: buttons?.[12]?.value ?? 0,
      down: buttons?.[13]?.value ?? 0,
      left: buttons?.[14]?.value ?? 0,
      right: buttons?.[15]?.value ?? 0,
      menuSelect: buttons?.[0]?.value ?? 0,
      menuBack: buttons?.[1]?.value ?? 0,
      pause: buttons?.[9]?.value ?? 0,
      gearUp: buttons?.[2]?.value ?? 0,
      gearDown: buttons?.[0]?.value ?? 0,
    };
  } else {
    return {
      steer: deadzoneify(axes?.[0] ?? 0),
      throttle: deadzoneify((axes?.[3] ?? 0) / 2 + 0.5),
      brake: deadzoneify((axes?.[4] ?? 0) / 2 + 0.5),
      handbrake: buttons?.[0]?.value ?? 0,
      up: axes?.[9] === -1 ? 1 : 0,
      down: axes?.[9] === 0.14285719394683838 ? 1 : 0,
      left: axes?.[9] === 0.7142857313156128 ? 1 : 0,
      right: axes?.[9] === -0.4285714030265808 ? 1 : 0,
      menuSelect: buttons?.[1]?.value ?? 0,
      menuBack: buttons?.[0]?.value ?? 0,
      pause: buttons?.[11]?.value ?? 0,
      gearUp: buttons?.[4]?.value ?? 0,
      gearDown: buttons?.[1]?.value ?? 0,
    };
  }
}

export function isGamepadBeingUsed() {
  const inputs = getGamepadInputs();
  if (!inputs) return false;
  for (const key in inputs) {
    if (inputs[key as keyof ReturnType<typeof getGamepadInputs>]) return true;
  }
  return false;
}

export function deadzoneify(value: number, deadzone: number = 0.1) {
  return Math.abs(value) < deadzone ? 0 : value;
}
