import {
  camera,
  freeCam,
  gear,
  keysDown,
  mobileJoystickPad,
  panelOpen,
  renderer,
  renderHelperArrows,
  renderHitCarBox,
  selectedCar,
} from '../refs';
import { resetToLastProgress } from './road/resetIfFarFromRoad';

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

function onWindowResize() {
  renderer.current?.setSize(window.innerWidth, window.innerHeight);

  if (camera.current) camera.current.aspect = window.innerWidth / window.innerHeight;
  camera.current?.updateProjectionMatrix();
}

function onKeyDown(event: KeyboardEvent) {
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

  if (event.key === '[') {
    if (selectedCar.current.gears[gear.current - 1] !== undefined) {
      gear.current--;
    }
  }

  if (event.key === ']') {
    if (selectedCar.current.gears[gear.current + 1] !== undefined) {
      gear.current++;
    }
  }
}

function onKeyUp(event: KeyboardEvent) {
  keysDown.current[event.key] = false;
}
