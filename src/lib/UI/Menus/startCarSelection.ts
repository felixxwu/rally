import { carVisible, currentMenu } from '../../../refs';

export function startCarSelection() {
  currentMenu.current = 'carSelect';
  carVisible.current = true;
}
