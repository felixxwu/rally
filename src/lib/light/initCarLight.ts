import { carLightIntensity, scene, selectedCar, timeOfDay } from '../../refs';
import { getCarCornerMeshPos } from '../car/getCarCorner';
import { getCarDirection } from '../car/getCarDirection';
import { THREE } from '../utils/THREE';
import { addOnRenderListener } from '../render/addOnRenderListener';

export function initCarLight(left: boolean) {
  const carLight = new THREE.SpotLight(0xffffcc, carLightIntensity, 0, 0.5, 1, 1);
  carLight.castShadow = true;
  carLight.shadow.mapSize.width = 1024;
  carLight.shadow.mapSize.height = 1024;
  scene.current?.add(carLight);
  const spotLightHelper = new THREE.SpotLightHelper(carLight);
  spotLightHelper.visible = false;
  scene.current?.add(spotLightHelper);

  addOnRenderListener('carlight-' + (left ? 'left' : 'right'), () => {
    const carDir = getCarDirection();

    if (timeOfDay.current === 'Day') {
      carLight.intensity = 0;
    } else {
      carLight.intensity = carLightIntensity;
    }

    const carLightPos = getCarCornerMeshPos(true, left)
      .clone()
      .add(carDir.clone().setLength(selectedCar.current.wheelEndOffset + 2));
    carLight.position.copy(carLightPos);
    carLight.target.position.copy(carLightPos.clone().add(carDir.clone().multiplyScalar(100)));
    spotLightHelper.update();
  });
}
