import { camera, freeCam, renderer, renderHelperArrows } from '../refs';
import { THREE } from './utils/THREE';

export let keysDown: Record<string, boolean> = {};

export function initWindowListeners() {
  window.onresize = onWindowResize;
  window.onkeydown = onKeyDown;
  window.onkeyup = onKeyUp;

  window.ontouchstart = onTouch;
  window.ontouchmove = onTouch;
  window.ontouchend = onTouch;
  window.ontouchcancel = onTouch;
}

function onTouch(e: TouchEvent) {
  const touches = [...Array(e.touches.length)].map((_, i) => e.touches.item(i));

  const rects = [
    ['mobile-control-w', 'w'],
    ['mobile-control-a', 'a'],
    ['mobile-control-s', 's'],
    ['mobile-control-d', 'd'],
  ];

  for (const [id, key] of rects) {
    const el = document.getElementById(id);
    if (!el) continue;
    const rect = el?.getBoundingClientRect();

    keysDown[key] = false;
    el.style.opacity = '0.5';

    for (const touch of touches) {
      if (!rect || !touch) continue;
      if (
        rect.left <= touch.clientX &&
        touch.clientX <= rect.right &&
        rect.top <= touch.clientY &&
        touch.clientY <= rect.bottom
      ) {
        keysDown[key] = true;
        el.style.opacity = '1';
      }
    }
  }
}

function onWindowResize() {
  renderer.current?.setSize(window.innerWidth, window.innerHeight);

  if (camera.current) camera.current.aspect = window.innerWidth / window.innerHeight;
  camera.current?.updateProjectionMatrix();
}

function onKeyDown(event: KeyboardEvent) {
  keysDown[event.key] = true;

  if (event.key === 'h') {
    renderHelperArrows.current = !renderHelperArrows.current;
  }

  if (event.key === 'f') {
    freeCam.current = !freeCam.current;
  }
}

function onKeyUp(event: KeyboardEvent) {
  keysDown[event.key] = false;
}
