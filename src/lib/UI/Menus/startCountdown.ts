import {
  carSelected,
  countDownStarted,
  currentMenu,
  devMode,
  grassLeftMesh,
  grassRightMesh,
  infoText,
  roadMesh,
  stageTimeClock,
  stageTimeStarted,
  terrainMesh,
} from '../../../refs';
import { resetCar } from '../../car/setCarPos';

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
    infoText.current = '';
    await new Promise(resolve => setTimeout(resolve, 1000));
    infoText.current = '3';
    await new Promise(resolve => setTimeout(resolve, 1000));
    infoText.current = '2';
    await new Promise(resolve => setTimeout(resolve, 1000));
    infoText.current = '1';
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  const text = 'GO!';
  infoText.current = text;
  stageTimeStarted.current = true;
  countDownStarted.current = false;
  stageTimeClock.start();
  await new Promise(resolve => setTimeout(resolve, 2000));
  if (infoText.current === text) {
    infoText.current = '';
  }
  carSelected.current = false;
}
