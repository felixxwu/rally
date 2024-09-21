import { enginePower, maxTireForce, springLength, sprintRate } from '../../refs';
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
  div.appendChild(numberSlider('Spring Length', springLength, 0, 2));
  div.appendChild(numberSlider('Spring Stiffness', sprintRate, 0, 1000));
  div.appendChild(numberSlider('Max Tire Force', maxTireForce, 0, 1000));

  return div;
}

function numberSlider(name: string, ref: Ref<number>, min: number, max: number) {
  const div = el('div', {
    style: `
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
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
    min: min.toString(),
    max: max.toString(),
    value: ref.current.toString(),
    step: '0.01',
  }) as HTMLInputElement;

  input.oninput = () => {
    ref.current = parseFloat(input.value);
    value.textContent = ref.current.toString();
  };

  const value = el('span', {
    style: `
      color: white;
    `,
  });
  value.textContent = ref.current.toString();

  div.appendChild(label);
  div.appendChild(input);
  div.appendChild(value);

  return div;
}
