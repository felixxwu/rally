import { lightValues, onRender, scene, terrainWidthExtents, timeOfDay } from '../../refs';
import { getCarPos } from '../car/getCarTransform';
import { THREE } from '../utils/THREE';

const sunDistance = 10000;

export function initSun() {
  const ambientLight = new THREE.AmbientLight(0xbbbbbb);
  scene.current?.add(ambientLight);

  const light = new THREE.DirectionalLight(0xffffff);
  const sLight = terrainWidthExtents * 0.2;
  const targetObject = new THREE.Object3D();
  light.target = targetObject;
  light.castShadow = true;
  light.shadow.camera.left = -sLight;
  light.shadow.camera.right = sLight;
  light.shadow.camera.top = sLight;
  light.shadow.camera.bottom = -sLight;
  light.shadow.camera.near = sunDistance / 2;
  light.shadow.camera.far = sunDistance * 2;
  light.shadow.mapSize.x = 1024 * 32;
  light.shadow.mapSize.y = 1024 * 32;

  scene.current?.add(light);
  scene.current?.add(targetObject);

  // const shadowCameraHelper = new THREE.CameraHelper(light.shadow.camera);
  // scene.current?.add(shadowCameraHelper);

  onRender.current.push(() => {
    const carPos = getCarPos();
    targetObject.position.copy(carPos);
  });

  timeOfDay.listeners.push(() => {
    const intensity = lightValues[timeOfDay.current].light;
    light.intensity = intensity;

    const ambientIntensity = lightValues[timeOfDay.current].ambient;
    ambientLight.intensity = ambientIntensity;

    const elevation = lightValues[timeOfDay.current].lightAngle;
    const phi = THREE.MathUtils.degToRad(90 - elevation);
    light.position.setFromSphericalCoords(sunDistance, phi, 0);

    const colour = lightValues[timeOfDay.current].color;
    light.color.setHex(colour);
  });
  timeOfDay.triggerListeners();
}
