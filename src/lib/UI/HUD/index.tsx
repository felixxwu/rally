import { currentMenu, gamePaused, menuPause, transitionTime } from '../../../refs';
import { useCustomRef } from '../../utils/useCustomRef';
import { Info } from './Info';
import { MobileHUD } from './MobileHUD';
import { Progress } from './Progress';

export function HUD() {
  useCustomRef(menuPause, value => {
    if (value) {
      transitionTime.current = 0;
      gamePaused.current = true;
      currentMenu.current = 'pause';
    }
  });

  return (
    <div>
      <Info />
      <Progress />
      <MobileHUD />
    </div>
  );
}
