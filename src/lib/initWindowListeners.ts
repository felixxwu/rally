import {
  camera,
  freeCam,
  keysDown,
  mobileInput,
  mobileJoystickPad,
  mobileButtons,
  panelOpen,
  renderer,
  renderHelperArrows,
  renderHitCarBox,
  resolutionScale,
} from '../refs';
import { resetToLastProgress } from './road/resetIfFarFromRoad';
import { isGamepadBeingUsed } from './getGamepadInputs';

export function initWindowListeners() {
  window.onresize = onWindowResize;
  window.onkeydown = onKeyDown;
  window.onkeyup = onKeyUp;

  window.ontouchstart = onTouch;
  window.ontouchmove = onTouch;
  window.ontouchend = onTouch;
  window.ontouchcancel = onTouch;

  window.oncontextmenu = e => e.preventDefault();
}

function onTouch(e: TouchEvent) {
  const hamburger = document.getElementById('hamburger');
  if (hamburger) hamburger.style.opacity = '1';

  // Handle button-based controls
  if (mobileInput.current === 'buttons') {
    // Reset buttons if no touches
    if (e.touches.length === 0) {
      mobileButtons.current = { left: false, brake: false, right: false };
      return;
    }

    const buttonLeft = document.getElementById('mobile-button-left');
    const buttonBrake = document.getElementById('mobile-button-brake');
    const buttonRight = document.getElementById('mobile-button-right');

    if (buttonLeft && buttonBrake && buttonRight) {
      const leftRect = buttonLeft.getBoundingClientRect();
      const brakeRect = buttonBrake.getBoundingClientRect();
      const rightRect = buttonRight.getBoundingClientRect();

      // Reset all buttons
      mobileButtons.current = { left: false, brake: false, right: false };

      // Check which buttons are being pressed
      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches.item(i);
        if (!touch) continue;

        const touchX = touch.clientX;
        const touchY = touch.clientY;

        // Check if touch is within any button bounds
        if (
          touchX >= leftRect.left &&
          touchX <= leftRect.right &&
          touchY >= leftRect.top &&
          touchY <= leftRect.bottom
        ) {
          mobileButtons.current.left = true;
        } else if (
          touchX >= brakeRect.left &&
          touchX <= brakeRect.right &&
          touchY >= brakeRect.top &&
          touchY <= brakeRect.bottom
        ) {
          mobileButtons.current.brake = true;
        } else if (
          touchX >= rightRect.left &&
          touchX <= rightRect.right &&
          touchY >= rightRect.top &&
          touchY <= rightRect.bottom
        ) {
          mobileButtons.current.right = true;
        }
      }
    }
    return;
  }

  // Handle old joystick controls
  if (mobileInput.current === 'combined' || mobileInput.current === 'separate') {
    if (e.touches.length === 0) {
      mobileJoystickPad.current = { x: 0.5, y: 0.5 };
      return;
    }
  }

  if (mobileInput.current === 'combined') {
    const touch = e.touches.item(0);

    if (!touch) mobileJoystickPad.current = { x: 0.5, y: 0.5 };

    const joystickPad = document.getElementById('joystick-pad');
    const rect = joystickPad?.getBoundingClientRect();

    if (!rect || !touch || !joystickPad) return;

    const leftPercent = (touch.clientX - rect.left) / rect.width;
    const topPercent = (touch.clientY - rect.top) / rect.height;

    joystickPad.style.opacity = '1';

    mobileJoystickPad.current = {
      x: leftPercent,
      y: topPercent,
    };
  }

  if (mobileInput.current === 'separate') {
    const joystickLeft = document.getElementById('joystick-left');
    const joystickRight = document.getElementById('joystick-right');

    const leftRect = joystickLeft?.getBoundingClientRect();
    const rightRect = joystickRight?.getBoundingClientRect();

    if (!leftRect || !rightRect || !joystickLeft || !joystickRight) return;

    joystickLeft.style.opacity = '1';
    joystickRight.style.opacity = '1';

    const xy = { x: 0.5, y: 0.5 };

    for (let i = 0; i < e.touches.length; i++) {
      const touch = e.touches.item(i);
      if (!touch) continue;
      const isLeftSideOfScreen = touch.clientX < window.innerWidth / 2;

      if (isLeftSideOfScreen) {
        xy.x = (touch.clientX - leftRect.left) / leftRect.width;
      } else {
        xy.y = (touch.clientY - rightRect.top) / rightRect.height;
      }
    }

    mobileJoystickPad.current = xy;
  }
}

function onWindowResize() {
  renderer.current?.setSize(
    window.innerWidth * resolutionScale,
    window.innerHeight * resolutionScale
  );

  if (camera.current) camera.current.aspect = window.innerWidth / window.innerHeight;
  camera.current?.updateProjectionMatrix();
}

function onKeyDown(event: KeyboardEvent) {
  if (isGamepadBeingUsed()) return;

  keysDown.current[event.key] = true;

  if (event.key === 'h') {
    renderHelperArrows.current = !renderHelperArrows.current;
  }

  if (event.key === 'b') {
    renderHitCarBox.current = !renderHitCarBox.current;
  }

  if (event.key === 'f') {
    freeCam.current = !freeCam.current;
  }

  if (event.key === 'r') {
    resetToLastProgress();
  }

  if (event.key === 'Escape') {
    panelOpen.current = !panelOpen.current;
  }
}

function onKeyUp(event: KeyboardEvent) {
  keysDown.current[event.key] = false;
}
