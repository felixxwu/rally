import { Sky } from '../jsm/Sky';
import {
  lightValues,
  renderer,
  scene,
  timeOfDay,
  weather,
  terrainRenderDistance,
} from '../../refs';
import { THREE } from '../utils/THREE';
import { updateFog } from './updateFog';

export function initSky() {
  if (!renderer.current) return;

  // Add Sky
  const sky = new Sky();
  sky.scale.setScalar(450000);
  scene.current?.add(sky);

  const sun = new THREE.Vector3();

  const uniforms = sky.material.uniforms;
  uniforms['turbidity'].value = 10;
  uniforms['rayleigh'].value = 3;
  uniforms['mieCoefficient'].value = 0.005;
  uniforms['mieDirectionalG'].value = 0.7;

  timeOfDay.listeners.push(() => {
    const elevation = lightValues[timeOfDay.current.time].sunElevation;
    const phi = THREE.MathUtils.degToRad(90 - elevation);
    sun.setFromSphericalCoords(1, phi, 0);
    uniforms['sunPosition'].value.copy(sun);

    updateFog();
  });
  timeOfDay.triggerListeners();

  weather.listeners.push(() => {
    if (!renderer.current) return;
    renderer.current.toneMappingExposure = weather.current === 'rain' ? 0.2 : 0.3;
    updateFog();
  });
  weather.triggerListeners();

  // Update fog when terrain render distance changes (for clear weather)
  terrainRenderDistance.listeners.push(() => {
    if (weather.current === 'clear') {
      updateFog();
    }
  });
}
