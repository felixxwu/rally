import { camera, fov, freeCam, onRender, renderer } from '../../refs';
import { updateCamera } from './updateCamera';
import { THREE } from '../utils/THREE';
import { OrbitControls } from '../jsm/OrbitControls';
import { platFormCarPos } from '../car/setCarPos';

export const defaultCamPos = platFormCarPos.clone().add(new THREE.Vector3(10, 1, 0));

export function initCamera() {
  camera.current = new THREE.PerspectiveCamera(
    fov,
    window.innerWidth / window.innerHeight,
    0.2,
    2500
  );

  camera.current.position.copy(defaultCamPos);

  onRender.current.push(updateCamera);

  const controls = new OrbitControls(camera.current!, renderer.current!.domElement);
  controls.enabled = freeCam.current;

  freeCam.listeners.push(value => {
    controls.enabled = value;
  });
}
