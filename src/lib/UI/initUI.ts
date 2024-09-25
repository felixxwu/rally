import { startGame } from '../../refs';
import { info } from './info';
import { mainMenu } from './mainMenu';
import { mobileUI } from './mobileUi';
import { settingsIcon } from './settingsIcon';
import { settingsPanel } from './settingsPanel';
import { speedo } from './speedo';

export function initUI() {
  const ui = document.getElementById('ui');
  if (!ui) return;

  startGame.listeners.push(value => {
    ui.innerHTML = '';

    if (value) {
      ui.appendChild(info());
      ui.appendChild(speedo());
      ui.appendChild(mobileUI());
      ui.appendChild(settingsPanel());
      ui.appendChild(settingsIcon());
    } else {
      ui.appendChild(mainMenu());
    }
  });

  startGame.triggerListeners();
}
