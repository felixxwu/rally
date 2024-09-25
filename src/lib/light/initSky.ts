import { Sky } from '../jsm/Sky';
import { lightValues, renderer, scene, timeOfDay } from '../../refs';
import { THREE } from '../utils/THREE';

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
  renderer.current.toneMappingExposure = 0.3;

  timeOfDay.listeners.push(() => {
    const elevation = lightValues[timeOfDay.current].sunElevation;
    const phi = THREE.MathUtils.degToRad(90 - elevation);
    sun.setFromSphericalCoords(1, phi, 0);
    uniforms['sunPosition'].value.copy(sun);
  });
  timeOfDay.triggerListeners();
}
