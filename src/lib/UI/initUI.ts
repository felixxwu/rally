import { mobileUI } from './mobileUi';
import { ui } from './ui';

export function initUI() {
  if (!ui) return;

  ui.innerHTML = '';

  ui.appendChild(mobileUI());
}
