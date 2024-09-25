import { carLightIntensity, onRender, scene, timeOfDay, wheelEndOffset } from '../../refs';
import { getCarCornerPos } from '../car/getCarCorner';
import { getCarDirection } from '../car/getCarDirection';
import { THREE } from '../utils/THREE';

export function initCarLight(left: boolean) {
  const carLightLeft = new THREE.SpotLight(0xffffcc, carLightIntensity, 0, 0.5, 1, 1);
  carLightLeft.castShadow = true;
  carLightLeft.shadow.mapSize.width = 1024;
  carLightLeft.shadow.mapSize.height = 1024;
  scene.current?.add(carLightLeft);
  const spotLightHelperLeft = new THREE.SpotLightHelper(carLightLeft);
  spotLightHelperLeft.visible = false;
  scene.current?.add(spotLightHelperLeft);

  onRender.push(() => {
    const carDir = getCarDirection();

    if (timeOfDay.current === 'Day') {
      carLightLeft.intensity = 0;
    } else {
      carLightLeft.intensity = carLightIntensity;
    }

    const carPosLeft = getCarCornerPos(true, left)
      .clone()
      .add(carDir.clone().setLength(wheelEndOffset + 2));
    carLightLeft.position.copy(carPosLeft);
    carLightLeft.target.position.copy(carPosLeft.clone().add(carDir.clone().multiplyScalar(100)));
    spotLightHelperLeft.update();
  });
}
