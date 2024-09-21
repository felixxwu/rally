import { ref } from '../utils/ref';
import { mobileUI } from './mobileUi';
import { settingsIcon } from './settingsIcon';
import { settingsPanel } from './settingsPanel';
import { ui } from './ui';

export const panelOpen = ref(false);

export function initUI() {
  if (!ui) return;

  ui.innerHTML = '';

  ui.appendChild(mobileUI());
  if (panelOpen.current) {
    ui.appendChild(settingsPanel());
  }
  ui.appendChild(settingsIcon());
}
