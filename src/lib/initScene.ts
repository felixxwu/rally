import Stats from './jsm/stats.module';
import { container, scene, stats, devMode } from '../refs';
import { THREE } from './utils/THREE';

export function initScene() {
  container.current = document.getElementById('container');

  if (devMode) {
    stats.current = new Stats();
    stats.current.domElement.style.position = 'absolute';
    stats.current.domElement.style.top = '0px';
    container.current?.appendChild(stats.current.domElement);
  }

  scene.current = new THREE.Scene();
  scene.current.background = new THREE.Color(0xbfd1e5);
}
