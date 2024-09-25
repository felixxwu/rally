import { lightValues, scene, terrainWidthExtents, timeOfDay } from '../../refs';
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

  timeOfDay.listeners.push(() => {
    const intensity = lightValues[timeOfDay.current].light;
    light.intensity = intensity;

    const ambientIntensity = lightValues[timeOfDay.current].ambient;
    ambientLight.intensity = ambientIntensity;

    const elevation = lightValues[timeOfDay.current].lightAngle;
    const phi = THREE.MathUtils.degToRad(90 - elevation);
    light.position.setFromSphericalCoords(10000, phi, 0);

    const colour = lightValues[timeOfDay.current].color;
    light.color.setHex(colour);
  });
  timeOfDay.triggerListeners();
}
