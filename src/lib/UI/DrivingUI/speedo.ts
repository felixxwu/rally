import { onRender } from '../../../refs';
import { getSpeedVec } from '../../car/getSpeedVec';
import { el } from '../../utils/el';

let i = 0;

export function Speedo() {
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
        onRender.current.push(() => {
          i++;
          if (i % 10 !== 0) return;

          const speed = getSpeedVec();
          text.innerHTML = `${Math.round(speed.length())}`;
        });
      },
    })
  );
}
