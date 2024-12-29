import { currentMenu, progress, stageTime, stageTimeClock, stageTimeStarted } from '../../refs';
import { createRoot } from 'react-dom/client';
import { ReactUI } from './ReactUI';
import { getProgressPercentage } from './HUD/Progress';
import { addOnRenderListener } from '../render/addOnRenderListener';

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

  addOnRenderListener('stagetime', () => {
    if (stageTimeStarted.current && i++ % 5 === 0) {
      stageTime.current = stageTimeClock.getElapsedTime();
    }
  });
}
