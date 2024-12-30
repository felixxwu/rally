import {
  carSelected,
  countDownStarted,
  currentMenu,
  devMode,
  grassLeftMesh,
  grassRightMesh,
  roadMesh,
  stageTimeClock,
  stageTimeStarted,
  terrainMesh,
} from '../../../refs';
import { resetCar } from '../../car/setCarPos';
import { setInfoText } from '../setInfoText';

export async function startCountdown() {
  countDownStarted.current = true;
  currentMenu.current = 'hud';

  roadMesh.current!.visible = true;
  grassLeftMesh.current!.visible = true;
  grassRightMesh.current!.visible = true;
  terrainMesh.current!.visible = true;

  resetCar();
  await new Promise(resolve => setTimeout(resolve, 1000));
  stageTimeClock.stop();
  if (!devMode) {
    setInfoText('');
    await new Promise(resolve => setTimeout(resolve, 1000));
    setInfoText('3');
    await new Promise(resolve => setTimeout(resolve, 1000));
    setInfoText('2');
    await new Promise(resolve => setTimeout(resolve, 1000));
    setInfoText('1');
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  setInfoText('GO!', 2000);
  stageTimeStarted.current = true;
  countDownStarted.current = false;
  stageTimeClock.start();
  carSelected.current = false;
}
