import { el } from './el';
import { panelOpen } from './initUI';

export function settingsIcon() {
  return el.img({
    src: '/settings.svg',
    width: '40',
    style: `
        position: fixed;
        top: 10px;
        right: 10px;
        cursor: pointer;
      `,
    oncreate: img => {
      img.onclick = () => {
        panelOpen.current = !panelOpen.current;
      };
    },
  });
}
