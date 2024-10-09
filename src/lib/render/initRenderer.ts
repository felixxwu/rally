import AmmoType from 'ammojs-typed';
declare const Ammo: typeof AmmoType;

import {
  container,
  renderer,
  stats,
  clock,
  scene,
  camera,
  onRender,
  stopOnRender,
  onRenderNoPausing,
} from '../../refs';
import { THREE } from '../utils/THREE';

export function initRenderer() {
  renderer.current = new THREE.WebGLRenderer({ antialias: true });
  renderer.current.setPixelRatio(window.devicePixelRatio);
  renderer.current.setSize(window.innerWidth, window.innerHeight);
  renderer.current.setAnimationLoop(render);
  renderer.current.shadowMap.enabled = true;
  renderer.current.toneMapping = THREE.AgXToneMapping;
  container.current?.appendChild(renderer.current.domElement);
}

function render() {
  const delta = clock.getDelta();

  if (delta !== 0) {
    onRender.current.forEach(callback => {
      if (stopOnRender.current) return;
      callback(delta);
    });
    onRenderNoPausing.current.forEach(callback => callback(delta));
  }

  if (camera.current && scene.current) {
    renderer.current?.render(scene.current, camera.current);
  }

  stats.current?.update();
}
