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
import { sleep } from '../../utils/sleep';

export async function startCountdown() {
  countDownStarted.current = true;
  currentMenu.current = 'hud';

  if (roadMesh.current) roadMesh.current.visible = true;
  if (grassLeftMesh.current) grassLeftMesh.current.visible = true;
  if (grassRightMesh.current) grassRightMesh.current.visible = true;
  if (terrainMesh.current) terrainMesh.current.visible = true;

  resetCar();
  await sleep(1000);
  stageTimeClock.stop();
  if (!devMode) {
    setInfoText('');
    await sleep(1000);
    setInfoText('3');
    await sleep(1000);
    setInfoText('2');
    await sleep(1000);
    setInfoText('1');
    await sleep(1000);
  }
  setInfoText('GO!', 2000);
  stageTimeStarted.current = true;
  countDownStarted.current = false;
  stageTimeClock.start();
  carSelected.current = false;
}
