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

  div.appendChild(numberSlider('Power', enginePower, 0, 1000));
  div.appendChild(numberSlider('Steering Sensitivity', steerPower, 100, 700));
  div.appendChild(numberSlider('Spring Length', springLength, 0, 3));
  div.appendChild(numberSlider('Spring Stiffness', sprintRate, 0, 1000));
  div.appendChild(numberSlider('Spring Damping', springDamping, 0, 10000));
  div.appendChild(numberSlider('Tire Grip', maxTireForce, 0, 1000));
  div.appendChild(numberSlider('Tire Snappiness', tireSnappiness, 0, 500));
  div.appendChild(numberSlider('Air Resistance', airResistance, 1, 30));
  div.appendChild(numberSlider('Body Roll', bodyRoll, 0, 1));
  div.appendChild(numberSlider('Camera Follow Distance', camFollowDistance, 3, 20));
  div.appendChild(numberSlider('Camera Follow Height', camFollowHeight, 0, 10));
  div.appendChild(numberSlider('Camera Follow Speed', camFollowSpeed, 0, 1));
  div.appendChild(boolInput('Debug Arrows', renderHelperArrows));
  div.appendChild(boolInput('Front Wheel Drive', frontWheelDrive));
  div.appendChild(boolInput('Read Wheel Drive', rearWheelDrive));

  return div;
}

function numberSlider(name: string, ref: Ref<number>, min: number, max: number) {
  const div = el('div', {
    style: `
      display: grid;
      grid-template-columns: 200px 200px 50px;
      gap: 20px;
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
    `,
  });
  value.textContent = `${ref.current}`;

  div.appendChild(label);
  div.appendChild(input);
  div.appendChild(value);

  return div;
}

function boolInput(name: string, ref: Ref<boolean>) {
  const div = el('div', {
    style: `
      display: grid;
      grid-template-columns: 200px 200px 50px;
      gap: 20px;
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
