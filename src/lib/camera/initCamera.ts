import { camera, onRender, renderer } from '../../refs';
import { updateCamera } from './updateCamera';
import { THREE } from '../utils/THREE';

export function initCamera() {
  camera.current = new THREE.PerspectiveCamera(
    80,
    window.innerWidth / window.innerHeight,
    0.2,
    2000
  );

  camera.current.position.set(0, 1500, -1);
  camera.current.lookAt(0, 0, 0);

  onRender.push(updateCamera);
}
