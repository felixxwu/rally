import { ref } from '../utils/ref';
import { el } from './el';

export const infoText = ref('');

export function info() {
  return el.div(
    {
      style: `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        padding: 10px;
        color: white;
        text-align: center;
      `,
      oncreate(div) {
        infoText.listeners.push(value => {
          div.innerHTML = value;
        });
      },
    },
    infoText.current
  );
}
