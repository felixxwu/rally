import { mobileControlGroup } from './mobileControlGroup';
import { el } from './ui';

export function mobileUI() {
  const mobileUI = el('div', {
    style: `
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    `,
  });

  mobileUI.appendChild(
    mobileControlGroup([
      { key: 'a', rotation: -90 },
      { key: 'd', rotation: 90 },
    ])
  );

  mobileUI.appendChild(
    mobileControlGroup([
      { key: 's', rotation: 180 },
      { key: 'w', rotation: 0 },
    ])
  );

  return mobileUI;
}
