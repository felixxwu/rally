import { onRender } from '../../refs';
import { getCarDirection } from '../car/getCarDirection';
import { getDirectionOfTravel } from '../car/getDirectionOfTravel';
import { el } from './ui';

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

  onRender.push(() => {
    const dir = getDirectionOfTravel();
    const angle = getCarDirection().angleTo(dir);
    const reversing = angle > Math.PI / 2;

    div.innerHTML = `${reversing ? '-' : ''}${Math.round(dir.length() * 100)}`;
  });

  return div;
}
