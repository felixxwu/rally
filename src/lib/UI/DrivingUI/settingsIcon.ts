import { el } from '../../utils/el';
import { panelOpen } from '../../../refs';

export function SettingsIcon() {
  return el.img({
    src: '/settings.svg',
    width: '25',
    style: `
        position: fixed;
        top: 10px;
        right: 10px;
        cursor: pointer;
        background-color: black;
        padding: 15px;
        opacity: 0.7;
      `,
    oncreate: img => {
      img.onclick = () => {
        panelOpen.current = !panelOpen.current;
      };
    },
  });
}
