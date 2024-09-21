import { keysDown } from '../initWindowListeners';
import { el } from './ui';

export function mobileControl(key: string, rotation: number) {
  const img = el('img', {
    src: '/triangle.svg',
    width: '70',
    style: `
      rotate: ${rotation}deg;
      padding: 10px 0;
      cursor: pointer;
      opacity: 0.5;
    `,
  });

  const onPress = (pressed: boolean) => {
    img.style.opacity = pressed ? '1' : '0.5';
  };

  addPointerListeners(img, key, onPress);

  return img;
}

function addPointerListeners(
  elemenet: HTMLElement,
  key: string,
  onPress: (pressed: boolean) => void
) {
  elemenet.addEventListener('pointerdown', e => handlePointerDown(e, key, onPress));
  elemenet.addEventListener('pointerup', e => handlePointerUp(e, key, onPress));
  elemenet.addEventListener('pointerleave', e => handlePointerUp(e, key, onPress));
  elemenet.addEventListener('pointercancel', e => handlePointerUp(e, key, onPress));
  elemenet.addEventListener('pointerout', e => handlePointerUp(e, key, onPress));
  elemenet.addEventListener('contextmenu', e => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    return false;
  });
}

function handlePointerDown(event: PointerEvent, key: string, onPress: (pressed: boolean) => void) {
  event.preventDefault();
  keysDown[key] = true;
  onPress(true);
}

function handlePointerUp(event: PointerEvent, key: string, onPress: (pressed: boolean) => void) {
  event.preventDefault();
  keysDown[key] = false;
  onPress(false);
}
