import AmmoType from 'ammojs-typed';
declare const Ammo: typeof AmmoType;

import { initCamera } from './lib/camera/initCamera';
import { initCar } from './lib/car/initCar';
import { initScene } from './lib/initScene';
import { initLight } from './lib/light/initLight';
import { initWindowListeners } from './lib/initWindowListeners';
import { initPhysics } from './lib/physics/initPhysics';
import { initRenderer } from './lib/render/initRenderer';
import { initTerrain } from './lib/terrain/initTerrain';
import { initUI } from './lib/UI/initUI';
import { initWheel } from './lib/wheel/initWheel';
import { initRoad } from './lib/road/initRoad';
import { initSky } from './lib/light/initSky';
import { devMode, stageTimeStarted, startGame } from './refs';
import { initInternalController } from './lib/initInternalController';

Ammo().then(init);

export async function init() {
  initUI();
  initScene();
  initRenderer();
  initCamera();
  initLight();
  initSky();
  initWindowListeners();
  initInternalController();

  startGame.listeners.push(async value => {
    if (value) {
      initPhysics();
      initTerrain();

      await initRoad();

      initCar();
      initWheel(true, true);
      initWheel(true, false);
      initWheel(false, true);
      initWheel(false, false);

      stageTimeStarted.current = true;
    }
  });

  if (devMode) {
    startGame.current = true;
  }
}
