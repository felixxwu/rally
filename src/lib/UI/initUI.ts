import { ref } from '../utils/ref';
import { info } from './info';
import { mobileUI } from './mobileUi';
import { settingsIcon } from './settingsIcon';
import { settingsPanel } from './settingsPanel';
import { speedo } from './speedo';

export const panelOpen = ref(false);

export function initUI() {
  const ui = document.getElementById('ui');
  if (!ui) return;

  ui.innerHTML = '';

  ui.appendChild(info());
  ui.appendChild(speedo());
  ui.appendChild(mobileUI());
  ui.appendChild(settingsPanel());
  ui.appendChild(settingsIcon());
}
