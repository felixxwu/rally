import { camera, freeCam, onRender, renderer } from '../../refs';
import { updateCamera } from './updateCamera';
import { THREE } from '../utils/THREE';
import { OrbitControls } from '../jsm/OrbitControls';

export function initCamera() {
  camera.current = new THREE.PerspectiveCamera(
    80,
    window.innerWidth / window.innerHeight,
    0.2,
    2000
  );

  camera.current.position.set(0, 1400, -1);
  camera.current.lookAt(0, 0, 0);

  onRender.push(updateCamera);

  const controls = new OrbitControls(camera.current!, renderer.current!.domElement);
  controls.enabled = freeCam.current;

  freeCam.listeners.push(value => {
    controls.enabled = value;
  });
}
