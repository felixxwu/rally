import { scene, timeOfDay, weather } from '../../refs';
import { THREE } from '../utils/THREE';

export function updateFog() {
  if (!scene.current) return;

  if (weather.current === 'clear') {
    scene.current.fog = new THREE.FogExp2(timeOfDay.current.fogColor, 0.001);
  }
  if (weather.current === 'rain') {
    if (timeOfDay.current.time === 'Day') {
      scene.current.fog = new THREE.FogExp2(0x333333, 0.008);
    } else {
      scene.current.fog = new THREE.FogExp2(timeOfDay.current.fogColor, 0.008);
    }
  }
  if (weather.current === 'fog') {
    scene.current.fog = new THREE.FogExp2(timeOfDay.current.fogColor, 0.017);
  }
}
