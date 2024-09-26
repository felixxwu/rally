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
import { renderer, resetGame, startGame } from './refs';
import { resetAllRefs } from './lib/utils/ref';

Ammo().then(init);

export async function init() {
  initUI();
  initScene();
  initRenderer();
  initCamera();
  initLight();
  initSky();
  initWindowListeners();

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
    }
  });

  resetGame.listeners.push(value => {
    if (value) {
      renderer.current?.dispose();
      resetAllRefs();
      document.getElementById('container')!.innerHTML = '';
      setTimeout(() => {
        init();
      });
    }
  });
}
