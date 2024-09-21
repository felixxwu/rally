import {
  airResistance,
  bodyRoll,
  brakePower,
  brakeRearBias,
  camFollowDistance,
  camFollowHeight,
  camFollowSpeed,
  enginePower,
  frontWheelDrive,
  maxTireForce,
  rearWheelDrive,
  renderHelperArrows,
  springDamping,
  springLength,
  sprintRate,
  steerPower,
  tireSnappiness,
} from '../../refs';
import { Ref } from '../utils/ref';
import { el } from './el';
import { panelOpen } from './initUI';

export function settingsPanel() {
  return el.div(
    {
      style: `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: none;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      `,
      oncreate: div => {
        panelOpen.listeners.push(value => {
          if (value) {
            div.style.display = 'flex';
          } else {
            div.style.display = 'none';
          }
        });
      },
    },
    el.div(
      {
        style: `
          width: calc(100% - 20px);
          max-width: 500px;
          margin: 20px;
          display: flex;
          flex-direction: column;
          gap: 5px;
        `,
      },
      numberSlider('Power', enginePower, 0, 1000),
      numberSlider('Steering Sensitivity', steerPower, 100, 700),
      numberSlider('Spring Length', springLength, 0.5, 3),
      numberSlider('Spring Stiffness', sprintRate, 0, 600),
      numberSlider('Spring Damping', springDamping, 0, 10000),
      numberSlider('Tire Grip', maxTireForce, 0, 1000),
      numberSlider('Tire Snappiness', tireSnappiness, 0, 500),
      numberSlider('Brake Strength', brakePower, 0, 1200),
      numberSlider('Brake Bias (Rear)', brakeRearBias, 0, 1),
      numberSlider('Air Resistance', airResistance, 1, 30),
      numberSlider('Body Roll', bodyRoll, 0, 1),
      numberSlider('Camera Follow Distance', camFollowDistance, 3, 20),
      numberSlider('Camera Follow Height', camFollowHeight, 0, 10),
      numberSlider('Camera Follow Speed', camFollowSpeed, 0, 1),
      boolInput('Front Wheel Drive', frontWheelDrive),
      boolInput('Rear Wheel Drive', rearWheelDrive),
      boolInput('Debug Arrows', renderHelperArrows)
    )
  );
}

function numberSlider(name: string, ref: Ref<number>, min: number, max: number) {
  const value = el.span({
    style: `color: white; text-align: right; font-size: 12px;`,
    oncreate: span => {
      span.textContent = `${ref.current}`;
    },
  });

  return el.div(
    {
      style: `
        display: grid;
        grid-template-areas: 'label value' 'input input';
        grid-template-columns: auto auto;
        grid-template-rows: auto auto;
        width: 100%;
      `,
    },
    el.span({ style: `color: white; font-size: 12px;` }, name),
    value,
    el.input({
      type: 'range',
      min: `${min}`,
      max: `${max}`,
      step: '0.01',
      style: `width: 100%; grid-area: input;`,
      oncreate: input => {
        input.value = `${ref.current}`;
        input.oninput = () => {
          ref.current = parseFloat(input.value);
          value.textContent = `${ref.current}`;
        };
      },
    })
  );
}

function boolInput(name: string, ref: Ref<boolean>) {
  return el.div(
    {
      style: `
        display: flex;
        justify-content: space-between;
      `,
    },
    el.span({ style: `color: white; font-size: 12px;` }, name),
    el.input({
      type: 'checkbox',
      style: `outline: none;`,
      checked: `${ref.current}`,
      oncreate: input => {
        input.checked = ref.current;
        input.oninput = () => {
          ref.current = input.checked;
        };
      },
    })
  );
}
