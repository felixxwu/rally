import { onRender } from '../../refs';
import { getCarDirection } from '../car/getCarDirection';
import { getDirectionOfTravel } from '../car/getDirectionOfTravel';
import { el } from './ui';

let i = 0;

export function spedo() {
  const div = el('div', {
    style: `
      position: fixed;
      bottom: 0px;
      left: 0px;
      text-align: center;
      width: 100%;
      color: white;
      font-size: 50px;
      padding: 10px;
    `,
  });

  const text = el('div', {
    style: `
      min-width: 100px;
    `,
  });

  onRender.push(() => {
    i++;
    if (i % 5 !== 0) return;

    const dir = getDirectionOfTravel();
    const angle = getCarDirection().angleTo(dir);
    const reversing = angle > Math.PI / 2 && dir.length() * 100 > 1;

    text.innerHTML = `${reversing ? '-' : ''}${Math.round(dir.length() * 100)}`;
  });

  div.appendChild(text);
  return div;
}
