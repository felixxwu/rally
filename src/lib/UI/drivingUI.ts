import { el } from './el';
import { Info } from './info';
import { MobileUI } from './mobileUi';
import { Progress } from './progress';
import { SettingsIcon } from './settingsIcon';
import { SettingsPanel } from './settingsPanel';
import { Speedo } from './speedo';

export function DrivingUI() {
  return el.div({}, Info(), Speedo(), Progress(), MobileUI(), SettingsPanel(), SettingsIcon());
}
