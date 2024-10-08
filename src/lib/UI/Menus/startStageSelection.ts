import { carVisible, currentMenu } from '../../../refs';

export function startStageSelection() {
  currentMenu.current = 'stageSelect';
  carVisible.current = false;
}
