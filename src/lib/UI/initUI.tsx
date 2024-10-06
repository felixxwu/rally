import {
  currentMenu,
  devMode,
  infoText,
  onRender,
  progress,
  stageTime,
  stageTimeStarted,
} from '../../refs';
import { THREE } from '../utils/THREE';
import { createRoot } from 'react-dom/client';
import { ReactUI } from './ReactUI';
import { resetCar } from '../car/setCarPos';
import { getProgressPercentage } from './HUD/Progress';

export function initUI() {
  const ui = document.getElementById('ui');
  const root = createRoot(ui!);
  root.render(<ReactUI />);

  const clock = new THREE.Clock();

  stageTimeStarted.listeners.push(async value => {
    if (value) {
      clock.stop();
      resetCar();
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
      currentMenu.current = 'stageEnd';
    }
  });

  onRender.current.push(() => {
    if (stageTimeStarted.current) {
      stageTime.current = clock.getElapsedTime();
    }
  });
}
