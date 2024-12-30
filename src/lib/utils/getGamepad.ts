export function getGamepad(): Gamepad {
  const gamepads = navigator.getGamepads
    ? navigator.getGamepads()
    : // @ts-ignore
      navigator.webkitGetGamepads
      ? // @ts-ignore
        navigator.webkitGetGamepads()
      : [];
  return gamepads.find(Boolean);
}
