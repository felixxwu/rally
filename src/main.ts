import AmmoType from 'ammojs-typed';
declare const Ammo: typeof AmmoType;

import { initCamera } from './lib/camera/initCamera';
import { initCar } from './lib/car/initCar';
import { initGraphics } from './lib/initGraphics';
import { initLight } from './lib/initLight';
import { initWindowListeners } from './lib/initWindowListeners';
import { initPhysics } from './lib/physics/initPhysics';
import { initRenderer } from './lib/render/initRenderer';
import { initTerrain } from './lib/terrain/initTerrain';
import { initUI } from './lib/UI/initUI';
import { initWheel } from './lib/wheel/initWheel';
import { initRoad } from './lib/road/initRoad';
import { initSky } from './lib/initSky';

Ammo().then(init);

export async function init() {
  initUI();
  initGraphics();
  initRenderer();
  initCamera();
  initLight();
  initSky();
  initPhysics();
  initTerrain();
  initWindowListeners();

  await initRoad();

  initCar();
  initWheel(true, true);
  initWheel(true, false);
  initWheel(false, true);
  initWheel(false, false);
}
