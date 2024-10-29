import { ammoVehicle, ammoVehicleTuning, onRender, scene, selectedCar } from '../../refs';
import { createCleanupFunction } from '../utils/createCleanupFunction';
import { vecAmmo } from '../utils/createVec';
import { ref } from '../utils/ref';
import { THREE } from '../utils/THREE';
import { updateWheel } from './updateWheel';

export const wheelCleanUp = createCleanupFunction();

export function initWheel(front: boolean, left: boolean) {
  const { wheelRadius, wheelWidth, springLength, width, length, springRate, springDamping } =
    selectedCar.current;
  let prevDistance = ref(springLength);

  const wheelMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(wheelRadius, wheelRadius, wheelWidth, 16),
    new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 1, metalness: 1 })
  );

  wheelMesh.castShadow = true;

  scene.current?.add(wheelMesh);

  const wheelInfo = ammoVehicle.current!.addWheel(
    vecAmmo([(width / 2) * (left ? 1 : -1), 0, (length / 2) * (front ? 1 : -1)]),
    vecAmmo([0, -1, 0]),
    vecAmmo([1, 0, 0]),
    springLength,
    wheelRadius,
    ammoVehicleTuning.current!,
    front
  );
  wheelInfo.set_m_suspensionStiffness(springRate);
  wheelInfo.set_m_wheelsDampingRelaxation(springDamping);
  wheelInfo.set_m_wheelsDampingCompression(springDamping);
  wheelInfo.set_m_frictionSlip(0);
  wheelInfo.set_m_rollInfluence(0);

  const handleRender = () => {
    updateWheel(wheelMesh, wheelInfo, prevDistance, front, left);
  };
  onRender.current.push(['wheel', handleRender]);

  wheelCleanUp.addCleanupFunction(() => {
    scene.current?.remove(wheelMesh);
    onRender.current = onRender.current.filter(f => f[1] !== handleRender);
  });
}
