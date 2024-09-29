export function getGamepad(): Gamepad {
  const gamepads = navigator.getGamepads
    ? navigator.getGamepads()
    : // @ts-ignore
    navigator.webkitGetGamepads
    ? // @ts-ignore
      navigator.webkitGetGamepads()
    : [];
  return gamepads[0];
}

export function getGamepadBrake() {
  return getGamepad()?.buttons?.[6]?.value ?? 0;
}

export function getGamepadThrottle() {
  return getGamepad()?.buttons?.[7]?.value ?? 0;
}

export function getGamepadSteer() {
  return getGamepad()?.axes?.[0] ?? 0;
}

export function getGamepadHandbrake() {
  return getGamepad()?.buttons?.[1]?.value ?? 0;
}
