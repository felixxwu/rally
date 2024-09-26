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
        width: 100%;
        color: white;
        display: flex;
        justify-content: center;
      `,
    },
    el.div({
      style: `
        min-width: 100px;
        max-width: 200px;
        font-size: 30px;
        background-color: black;
        opacity: 0.7;
        text-align: center;
        padding: 10px;
        margin: 10px;
      `,
      oncreate: text => {
        onRender.push(deltaTime => {
          i++;
          if (i % 10 !== 0) return;

          const speed = getSpeedVec();
          const angle = getCarDirection().angleTo(speed);
          const reversing = angle > Math.PI / 2 && speed.length() > 1;

          text.innerHTML = `${reversing ? '-' : ''}${Math.round(speed.length())}`;
        });
      },
    })
  );
}
