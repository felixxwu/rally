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

  onRender.current.push(() => {
    if (stageTimeStarted.current) {
      stageTime.current = stageTimeClock.getElapsedTime();
    }
  });
}
