import { car, carHeight, onRender, scene, terrainDepthExtents, terrainWidthExtents } from '../refs';
import { getCarCornerPos } from './car/getCarCorner';
import { getCarDirection } from './car/getCarDirection';
import { THREE } from './utils/THREE';

export const initLight = () => {
  const ambientLight = new THREE.AmbientLight(0xbbbbbb);
  ambientLight.intensity = 0.7;
  scene.current?.add(ambientLight);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(terrainWidthExtents, 300, terrainDepthExtents);
  light.castShadow = true;
  const dLight = terrainWidthExtents;
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

  const carLightLeft = new THREE.SpotLight(0xffffff, 10, 0, 0.5, 1, 0.5);
  carLightLeft.castShadow = true;
  carLightLeft.shadow.mapSize.width = 1024;
  carLightLeft.shadow.mapSize.height = 1024;
  scene.current?.add(carLightLeft);
  const spotLightHelperLeft = new THREE.SpotLightHelper(carLightLeft);
  spotLightHelperLeft.visible = false;
  scene.current?.add(spotLightHelperLeft);

  const carLightRight = new THREE.SpotLight(0xffffff, 10, 0, 0.5, 1, 0.5);
  carLightRight.castShadow = true;
  carLightRight.shadow.mapSize.width = 1024;
  carLightRight.shadow.mapSize.height = 1024;
  scene.current?.add(carLightRight);
  const spotLightHelperRight = new THREE.SpotLightHelper(carLightRight);
  spotLightHelperRight.visible = false;
  scene.current?.add(spotLightHelperRight);

  onRender.push(() => {
    if (!car.current) return;

    const carDir = getCarDirection();

    const carPosLeft = getCarCornerPos(true, true)
      .clone()
      .add(carDir.clone().multiplyScalar(2))
      .add(new THREE.Vector3(0, carHeight / 2, 0));
    carLightLeft.position.copy(carPosLeft);
    carLightLeft.target.position.copy(carPosLeft.clone().add(carDir.clone().multiplyScalar(100)));
    spotLightHelperLeft.update();

    const carPosRight = getCarCornerPos(true, false)
      .clone()
      .add(carDir.clone().multiplyScalar(2))
      .add(new THREE.Vector3(0, carHeight / 2, 0));
    carLightRight.position.copy(carPosRight);
    carLightRight.target.position.copy(carPosRight.clone().add(carDir.clone().multiplyScalar(100)));
    spotLightHelperRight.update();
  });
};
