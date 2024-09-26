import { camera, freeCam, onRender, renderer } from '../../refs';
import { updateCamera } from './updateCamera';
import { THREE } from '../utils/THREE';
import { OrbitControls } from '../jsm/OrbitControls';
import { getSpawn } from '../utils/getSpawn';

export function initCamera() {
  camera.current = new THREE.PerspectiveCamera(
    90,
    window.innerWidth / window.innerHeight,
    0.2,
    2500
  );

  const spawn = getSpawn();

  camera.current.position.set(0, 2000, -1);
  camera.current.lookAt(0, 0, 0);

  setTimeout(() => {
    camera.current!.position.set(spawn.x, 2000, spawn.z);
  });

  onRender.push(updateCamera);

  const controls = new OrbitControls(camera.current!, renderer.current!.domElement);
  controls.enabled = freeCam.current;

  freeCam.listeners.push(value => {
    controls.enabled = value;
  });
}
