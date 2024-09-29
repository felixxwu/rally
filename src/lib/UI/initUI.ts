import { onRender, progress, stageTime, stageTimeStarted, startGame } from '../../refs';
import { THREE } from '../utils/THREE';
import { DrivingUI } from './drivingUI';
import { infoText } from './info';
import { mainMenu } from './mainMenu';
import { getProgressPercentage } from './progress';

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

  const clock = new THREE.Clock();

  stageTimeStarted.listeners.push(async value => {
    if (value) {
      clock.stop();
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
