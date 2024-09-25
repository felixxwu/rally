import AmmoType from 'ammojs-typed';
declare const Ammo: typeof AmmoType;

import { container, renderer, stats, clock, scene, camera, onRender } from '../../refs';
import { THREE } from '../utils/THREE';

export function initRenderer() {
  renderer.current = new THREE.WebGLRenderer({ antialias: true });
  renderer.current.setPixelRatio(window.devicePixelRatio);
  renderer.current.setSize(window.innerWidth, window.innerHeight);
  renderer.current.setAnimationLoop(animate);
  renderer.current.shadowMap.enabled = true;
  container.current?.appendChild(renderer.current.domElement);
}

function animate() {
  const deltaTime = clock.getDelta();
  if (deltaTime !== 0) {
    onRender.forEach(callback => callback(deltaTime));
  }

  renderer.current?.render(scene.current!, camera.current!);

  stats.current.update();
}
