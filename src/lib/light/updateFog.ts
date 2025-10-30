import { scene, timeOfDay, weather, terrainRenderDistance } from '../../refs';
import { THREE } from '../utils/THREE';

export function updateFog() {
  if (!scene.current) return;

  if (weather.current === 'clear') {
    // Use linear fog for precise distance control
    // Linear fog allows exact control with 'near' and 'far' parameters
    // 'near' = distance where fog starts (0% opacity)
    // 'far' = distance where fog is fully opaque (100% opacity)
    const renderDistance = terrainRenderDistance.current;
    // Start fog slightly before render distance (85%) to create a smooth transition
    // End fog slightly after render distance (115%) for full opacity beyond the visible terrain
    const near = renderDistance * 0.4;
    const far = renderDistance * 0.5;
    scene.current.fog = new THREE.Fog(timeOfDay.current.fogColor, near, far);
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
