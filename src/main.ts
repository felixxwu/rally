import AmmoType from 'ammojs-typed';
declare const Ammo: typeof AmmoType;

import { initCamera } from './lib/camera/initCamera';
import { initCar } from './lib/car/initCar';
import { initScene } from './lib/initScene';
import { initLight } from './lib/light/initLight';
import { initWindowListeners } from './lib/initWindowListeners';
import { initPhysics } from './lib/physics/initPhysics';
import { initRenderer } from './lib/render/initRenderer';
import { initUI } from './lib/UI/initUI';
import { initWheel } from './lib/wheel/initWheel';
import { initSky } from './lib/light/initSky';
import { carVisible, devMode } from './refs';
import { initInternalController } from './lib/initInternalController';
import { initPlatform } from './lib/terrain/initPlatform';
import { startTerrainGeneration } from './lib/terrain/startTerrainGeneration';

Ammo().then(init);

export async function init() {
  initUI();
  initScene();
  initRenderer();
  initLight();
  initSky();
  initWindowListeners();
  initInternalController();

  initPhysics();
  initPlatform();
  await initCar();
  initWheel(true, true);
  initWheel(true, false);
  initWheel(false, true);
  initWheel(false, false);

  initCamera();

  if (devMode) {
    startTerrainGeneration();
    carVisible.current = true;
  }
}
