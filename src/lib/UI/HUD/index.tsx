import { Info } from './Info';
import { MobileHUD } from './MobileHUD';
import { Progress } from './Progress';

export function HUD() {
  return (
    <div>
      <Info />
      <Progress />
      <MobileHUD />
    </div>
  );
}
