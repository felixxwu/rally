import { currentMenu, stopOnRender, menuPause, transitionTime } from '../../../refs';
import { useCustomRef } from '../../utils/useCustomRef';
import { Info } from './Info';
import { MiniMap } from './MiniMap';
import { MobileHUD } from './MobileHUD';
import { Progress } from './Progress';
import { DashBoard } from './DashBoard';

const isMobileDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

export function HUD() {
  useCustomRef(menuPause, value => {
    if (value) {
      transitionTime.current = 0;
      stopOnRender.current = true;
      currentMenu.current = 'pause';
    }
  });

  return (
    <div>
      <Info />
      <Progress />
      {isMobileDevice && <MobileHUD />}
      <MiniMap />
      <DashBoard />
    </div>
  );
}
