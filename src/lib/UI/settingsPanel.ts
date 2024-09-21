import {
  airResistance,
  bodyRoll,
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
import { el } from './ui';

export function settingsPanel() {
  const div = el('div', {
    style: `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    `,
  });

  const container = el('div', {
    style: `
      width: calc(100% - 20px);
      max-width: 500px;
      margin: 20px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    `,
  });
  div.appendChild(container);

  container.appendChild(numberSlider('Power', enginePower, 0, 1000));
  container.appendChild(numberSlider('Steering Sensitivity', steerPower, 100, 700));
  container.appendChild(numberSlider('Spring Length', springLength, 0, 3));
  container.appendChild(numberSlider('Spring Stiffness', sprintRate, 0, 1000));
  container.appendChild(numberSlider('Spring Damping', springDamping, 0, 10000));
  container.appendChild(numberSlider('Tire Grip', maxTireForce, 0, 1000));
  container.appendChild(numberSlider('Tire Snappiness', tireSnappiness, 0, 500));
  container.appendChild(numberSlider('Air Resistance', airResistance, 1, 30));
  container.appendChild(numberSlider('Body Roll', bodyRoll, 0, 1));
  container.appendChild(numberSlider('Camera Follow Distance', camFollowDistance, 3, 20));
  container.appendChild(numberSlider('Camera Follow Height', camFollowHeight, 0, 10));
  container.appendChild(numberSlider('Camera Follow Speed', camFollowSpeed, 0, 1));
  container.appendChild(boolInput('Front Wheel Drive', frontWheelDrive));
  container.appendChild(boolInput('Read Wheel Drive', rearWheelDrive));
  container.appendChild(boolInput('Debug Arrows', renderHelperArrows));

  return div;
}

function numberSlider(name: string, ref: Ref<number>, min: number, max: number) {
  const div = el('div', {
    style: `
      display: grid;
      grid-template-areas: 'label value' 'input input';
      grid-template-columns: auto auto;
      grid-template-rows: auto auto;
      width: 100%;
    `,
  });

  const label = el('span', {
    style: `
      color: white;
    `,
  });
  label.textContent = name;

  const input = el('input', {
    type: 'range',
    min: `${min}`,
    max: `${max}`,
    step: '0.01',
    style: `
      width: 100%;
      grid-area: input;
    `,
  }) as HTMLInputElement;
  input.value = `${ref.current}`;

  input.oninput = () => {
    ref.current = parseFloat(input.value);
    value.textContent = `${ref.current}`;
  };

  const value = el('span', {
    style: `
      color: white;
      text-align: right;
    `,
  });
  value.textContent = `${ref.current}`;

  div.appendChild(label);
  div.appendChild(value);
  div.appendChild(input);

  return div;
}

function boolInput(name: string, ref: Ref<boolean>) {
  const div = el('div', {
    style: `
      display: flex;
      justify-content: space-between;
    `,
  });

  const label = el('span', {
    style: `
      color: white;
    `,
  });
  label.textContent = name;

  const input = el('input', {
    type: 'checkbox',
    style: `
      outline: none;
    `,
  }) as HTMLInputElement;
  input.checked = ref.current;

  input.oninput = () => {
    ref.current = input.checked;
  };

  div.appendChild(label);
  div.appendChild(input);

  return div;
}
