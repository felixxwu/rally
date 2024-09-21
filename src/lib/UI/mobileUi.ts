import { el } from './el';
import { mobileControl } from './mobileControl';

export function mobileUI() {
  return el.div(
    {
      style: `
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
      `,
    },
    el.div(
      {
        style: `padding: 0 20px;`,
      },
      mobileControl('a', -90),
      mobileControl('d', 90)
    ),
    el.div(
      {
        style: `padding: 0 20px;`,
      },
      mobileControl('s', 180),
      mobileControl('w', 0)
    )
  );
}
