import {
  currentMenu,
  devMode,
  onRender,
  progress,
  stageTime,
  stageTimeStarted,
  transitionTime,
} from '../../refs';
import { THREE } from '../utils/THREE';
import { infoText } from './DrivingUI/info';
import { getProgressPercentage } from './DrivingUI/progress';

export function initUI() {
  const ui = document.getElementById('ui');
  if (!ui) return;

  currentMenu.listeners.push(async value => {
    ui.style.transition = transitionTime + 'ms';
    ui.style.opacity = '0';
    await new Promise(resolve => setTimeout(resolve, transitionTime));
    ui.innerHTML = '';
    ui.appendChild(value);
    ui.style.opacity = '1';
  });
  currentMenu.triggerListeners();

  const clock = new THREE.Clock();

  stageTimeStarted.listeners.push(async value => {
    if (value) {
      clock.stop();
      if (!devMode) {
        infoText.current = '';
        await new Promise(resolve => setTimeout(resolve, 1000));
        infoText.current = '5';
        await new Promise(resolve => setTimeout(resolve, 1000));
        infoText.current = '4';
        await new Promise(resolve => setTimeout(resolve, 1000));
        infoText.current = '3';
        await new Promise(resolve => setTimeout(resolve, 1000));
        infoText.current = '2';
        await new Promise(resolve => setTimeout(resolve, 1000));
        infoText.current = '1';
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      infoText.current = 'GO!';
      clock.start();
      await new Promise(resolve => setTimeout(resolve, 1000));
      infoText.current = '';
    }
  });

  progress.listeners.push(() => {
    if (getProgressPercentage() === 100) {
      stageTimeStarted.current = false;
      clock.stop();
    }
  });

  onRender.push(() => {
    if (stageTimeStarted.current) {
      stageTime.current = clock.getElapsedTime();
    }
  });
}
