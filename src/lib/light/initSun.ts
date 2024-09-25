import { scene, terrainDepthExtents, terrainWidthExtents } from '../../refs';
import { THREE } from '../utils/THREE';

export function initSun() {
  const ambientLight = new THREE.AmbientLight(0xbbbbbb);
  ambientLight.intensity = 0.7;
  scene.current?.add(ambientLight);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(terrainWidthExtents * 2, 300, 0);
  light.castShadow = true;
  const dLight = terrainWidthExtents * 2;
  const sLight = dLight * 0.5;
  light.shadow.camera.left = -sLight;
  light.shadow.camera.right = sLight;
  light.shadow.camera.top = sLight;
  light.shadow.camera.bottom = -sLight;

  light.shadow.camera.near = dLight / 30;
  light.shadow.camera.far = dLight * 3;

  light.shadow.mapSize.x = 1024 * 16;
  light.shadow.mapSize.y = 1024 * 16;

  scene.current?.add(light);
}
