import { currentMenu, stopOnRender, menuPause, transitionTime } from '../../../refs';
import { useCustomRef } from '../../utils/useCustomRef';
import { Info } from './Info';
import { MiniMap } from './MiniMap';
import { MobileHUD } from './MobileHUD';
import { Progress } from './Progress';
import { Dash } from './Dash';

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
      <MobileHUD />
      <MiniMap />
      <Dash />
    </div>
  );
}
