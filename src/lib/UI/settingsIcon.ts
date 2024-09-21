import { Ref } from '../utils/ref';
import { initUI, panelOpen } from './initUI';
import { el } from './ui';

export function settingsIcon() {
  const img = el('img', {
    src: '/settings.svg',
    width: '40',
    style: `
      position: fixed;
      top: 10px;
      right: 10px;
      cursor: pointer;
    `,
  });

  img.onclick = () => {
    panelOpen.current = !panelOpen.current;
    initUI();
  };

  return img;
}
