import { onRender } from '../../refs';
import { getCarDirection } from '../car/getCarDirection';
import { getDirectionOfTravel } from '../car/getDirectionOfTravel';
import { el } from './el';

let i = 0;

export function speedo() {
  return el.div(
    {
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
    },
    el.div({
      style: `
        min-width: 100px;
      `,
      oncreate: text => {
        onRender.push(deltaTime => {
          i++;
          if (i % 10 !== 0) return;

          const dir = getDirectionOfTravel(deltaTime);
          const angle = getCarDirection().angleTo(dir);
          const reversing = angle > Math.PI / 2 && dir.length() * 100 > 1;

          text.innerHTML = `${reversing ? '-' : ''}${Math.round(dir.length() * 100)}`;
        });
      },
    })
  );
}
