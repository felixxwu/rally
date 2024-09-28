import { startGame } from '../../refs';
import { DrivingUI } from './drivingUI';
import { mainMenu } from './mainMenu';

export function initUI() {
  const ui = document.getElementById('ui');
  if (!ui) return;

  startGame.listeners.push(value => {
    ui.innerHTML = '';

    if (value) {
      ui.appendChild(DrivingUI());
    } else {
      ui.appendChild(mainMenu());
    }
  });

  startGame.triggerListeners();
}
