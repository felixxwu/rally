import { onRender } from '../../refs';
import { getCarDirection } from '../car/getCarDirection';
import { getSpeedVec } from '../car/getSpeedVec';
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

          const speed = getSpeedVec(deltaTime);
          const angle = getCarDirection().angleTo(speed);
          const reversing = angle > Math.PI / 2 && speed.length() > 1;

          text.innerHTML = `${reversing ? '-' : ''}${Math.round(speed.length())}`;
        });
      },
    })
  );
}
