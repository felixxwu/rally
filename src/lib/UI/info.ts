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
        display: flex;
        justify-content: center;
      `,
    },
    el.div(
      {
        style: `
          color: white;
          text-align: center;
          padding: 10px;
          background-color: black;
          opacity: 0.7;
          max-width: 250px;
          width: 100%;
        `,
        oncreate(div) {
          infoText.listeners.push(value => {
            div.innerHTML = value;

            if (value) {
              div.style.display = 'block';
            } else {
              div.style.display = 'none';
            }
          });
        },
      },
      infoText.current
    )
  );
}
