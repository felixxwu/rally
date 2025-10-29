import { onRender, scene, selectedCar } from '../../refs';
import { createCleanupFunction } from '../utils/createCleanupFunction';
import { ref } from '../utils/ref';
import { THREE } from '../utils/THREE';
import { updateWheel } from './updateWheel';
import { addOnRenderListener } from '../render/addOnRenderListener';

export const wheelCleanUp = createCleanupFunction();

export function initWheel(front: boolean, left: boolean) {
  const { wheelRadius, wheelWidth, springLength } = selectedCar.current;
  let prevDistance = ref(springLength);

  const wheelMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(wheelRadius, wheelRadius, wheelWidth, 16),
    new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 1, metalness: 1 })
  );

  wheelMesh.castShadow = true;

  scene.current?.add(wheelMesh);

  const handleRender = (deltaTime: number) => {
    updateWheel(wheelMesh, prevDistance, front, left, deltaTime);
  };

  addOnRenderListener('wheel', handleRender, 'multi');
  wheelCleanUp.addCleanupFunction(() => {
    scene.current?.remove(wheelMesh);
    onRender.current = onRender.current.filter(f => f[1] !== handleRender);
  });
}
