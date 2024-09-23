import { Sky } from '../lib/jsm/Sky';
import { renderer, scene } from '../refs';
import { THREE } from './utils/THREE';

export function initSky() {
  if (!renderer.current) return;

  // Add Sky
  const sky = new Sky();
  sky.scale.setScalar(450000);
  scene.current?.add(sky);

  const sun = new THREE.Vector3();

  /// GUI

  const effectController = {
    turbidity: 10,
    rayleigh: 3,
    mieCoefficient: 0.005,
    mieDirectionalG: 0.7,
    elevation: 2,
    azimuth: 50,
    exposure: renderer.current?.toneMappingExposure,
  };

  const uniforms = sky.material.uniforms;
  uniforms['turbidity'].value = effectController.turbidity;
  uniforms['rayleigh'].value = effectController.rayleigh;
  uniforms['mieCoefficient'].value = effectController.mieCoefficient;
  uniforms['mieDirectionalG'].value = effectController.mieDirectionalG;

  const phi = THREE.MathUtils.degToRad(90 - effectController.elevation);
  const theta = THREE.MathUtils.degToRad(effectController.azimuth);

  sun.setFromSphericalCoords(1, phi, theta);

  uniforms['sunPosition'].value.copy(sun);

  renderer.current.toneMappingExposure = effectController.exposure ?? 0;
}
