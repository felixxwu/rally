import { el } from './el';

export function mobileControl(key: string, rotation: number) {
  return el.img({
    id: 'mobile-control-' + key,
    src: '/triangle.svg',
    width: '70',
    style: `
        rotate: ${rotation}deg;
        padding: 10px 0;
        cursor: pointer;
        opacity: 0;
        pointer-events: none;
      `,
  });
}
