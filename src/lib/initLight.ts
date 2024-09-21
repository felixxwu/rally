import { scene } from '../refs';
import { THREE } from './utils/THREE';

export const initLight = () => {
  const ambientLight = new THREE.AmbientLight(0xbbbbbb);
  scene.current?.add(ambientLight);

  const light = new THREE.DirectionalLight(0xffffff, 3);
  light.position.set(1000, 500, 500);
  light.castShadow = true;
  const dLight = 2000;
  const sLight = dLight * 0.25;
  light.shadow.camera.left = -sLight;
  light.shadow.camera.right = sLight;
  light.shadow.camera.top = sLight;
  light.shadow.camera.bottom = -sLight;

  light.shadow.camera.near = dLight / 30;
  light.shadow.camera.far = dLight;

  light.shadow.mapSize.x = 1024 * 8;
  light.shadow.mapSize.y = 1024 * 8;

  scene.current?.add(light);
};
