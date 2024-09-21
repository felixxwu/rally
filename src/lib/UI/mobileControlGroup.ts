import { mobileControl } from './mobileControl';
import { el } from './ui';

export function mobileControlGroup(keys: { key: string; rotation: number }[]) {
  const group = el('div', {
    style: `
      padding: 0 20px;
    `,
  });

  for (const key of keys) {
    group.appendChild(mobileControl(key.key, key.rotation));
  }

  return group;
}
