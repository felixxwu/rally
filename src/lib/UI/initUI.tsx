import {
  currentMenu,
  onRender,
  progress,
  stageTime,
  stageTimeClock,
  stageTimeStarted,
} from '../../refs';
import { createRoot } from 'react-dom/client';
import { ReactUI } from './ReactUI';
import { getProgressPercentage } from './HUD/Progress';

let i = 0;

export function initUI() {
  const ui = document.getElementById('ui');
  const root = createRoot(ui!);
  root.render(<ReactUI />);

  progress.listeners.push(() => {
    if (getProgressPercentage() === 100) {
      stageTimeStarted.current = false;
      stageTimeClock.stop();
      currentMenu.current = 'stageEnd';
    }
  });

  onRender.current.push([
    'stagetime',
    () => {
      if (stageTimeStarted.current && i % 2 === 0) {
        stageTime.current = stageTimeClock.getElapsedTime();
      }
      i++;
    },
  ]);
}
