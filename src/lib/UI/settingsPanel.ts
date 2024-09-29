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
  tireGrip,
  rearWheelDrive,
  renderHelperArrows,
  springDamping,
  springLength,
  sprintRate,
  steerPower,
  tireSnappiness,
  renderHitCarBox,
  freeCam,
  seed,
  surfaceGrips,
} from '../../refs';
import { Ref } from '../utils/ref';
import { el } from './el';
import { panelOpen } from '../../refs';

export function SettingsPanel() {
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
          max-height: 80%;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 5px;
        `,
      },
      section('Seed: ' + seed.current),
      section('Tires & Suspension'),
      numberSlider('Steering Sensitivity', steerPower),
      numberSlider('Tire Grip', tireGrip),
      numberSlider('Spring Length', springLength),
      numberSlider('Spring Stiffness', sprintRate),
      numberSlider('Spring Damping', springDamping),
      numberSlider('Tire Snappiness', tireSnappiness),

      section('Engine & Brakes'),
      numberSlider('Power', enginePower),
      numberSlider('Brake Strength', brakePower),
      numberSlider('Brake Bias (Rear)', brakeRearBias),

      section('Surfaces'),
      numberSlider('Tarmac Grip', surfaceGrips.tarmac.dry),
      numberSlider('Grass Grip', surfaceGrips.grass.dry),

      section('Car Physics'),
      numberSlider('Body Roll', bodyRoll),
      numberSlider('Air Resistance', airResistance),
      boolInput('Front Wheel Drive', frontWheelDrive),
      boolInput('Rear Wheel Drive', rearWheelDrive),

      section('Camera'),
      numberSlider('Camera Follow Distance', camFollowDistance),
      numberSlider('Camera Follow Height', camFollowHeight),
      numberSlider('Camera Follow Speed', camFollowSpeed),

      section('Debug'),
      boolInput('Debug Arrows', renderHelperArrows),
      boolInput('Show Hitbox', renderHitCarBox),
      boolInput('Free Cam', freeCam)
    )
  );
}

function section(text: string) {
  return el.div(
    {
      style: `
        color: white;
        text-transform: uppercase;
        margin-top: 20px;
        margin-bottom: 10px;
        font-size: 20px;
      `,
    },
    text
  );
}

function numberSlider(name: string, ref: Ref<number>) {
  const value = el.span({
    style: `color: white; text-align: right;`,
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
    el.span({ style: `color: white;` }, name),
    value,
    el.input({
      type: 'range',
      min: `${ref.min ?? 0}`,
      max: `${ref.max ?? 100}`,
      step: `${ref.step ?? 0.01}`,
      style: `width: 100%; grid-area: input;`,
      oncreate: input => {
        input.value = `${ref.current}`;
        input.oninput = () => {
          ref.current = parseFloat(input.value);
          value.textContent = `${ref.current}`;
        };
        ref.listeners.push(value => {
          input.value = `${value}`;
        });
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
    el.span({ style: `color: white;` }, name),
    el.input({
      type: 'checkbox',
      style: `outline: none;`,
      checked: `${ref.current}`,
      oncreate: input => {
        input.checked = ref.current;
        input.oninput = () => {
          ref.current = input.checked;
        };
        ref.listeners.push(value => {
          input.checked = value;
        });
      },
    })
  );
}
