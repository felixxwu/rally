import { carSelected, generatingTerrain, terrainMesh } from '../../refs';
import { initRoad } from '../road/initRoad';
import { startCountdown } from '../UI/Menus/startCountdown';
import { initTerrain } from './initTerrain';

export async function startTerrainGeneration() {
  generatingTerrain.current = true;
  initTerrain();
  terrainMesh.current!.visible = false;
  await initRoad();
  generatingTerrain.current = false;

  if (carSelected.current) {
    startCountdown();
  }
}
