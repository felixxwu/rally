import { onRender } from '../../refs';

export function addOnRenderListener(
  name: string,
  callback: () => void,
  behaviour: 'single' | 'multi' = 'single'
) {
  if (behaviour === 'single') {
    onRender.current = onRender.current.filter(([n]) => n !== name);
  }
  onRender.current.push([name, callback]);
}
