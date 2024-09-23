import { onRender, scene, springLength, wheelRadius } from '../../refs';
import { ref } from '../utils/ref';
import { THREE } from '../utils/THREE';
import { updateWheel } from './updateWheel';

export function initWheel(front: boolean, left: boolean) {
  let prevDistance = ref(springLength.current);

  const wheelMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(wheelRadius, wheelRadius, 0.3, 16),
    new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 1, metalness: 1 })
  );

  wheelMesh.castShadow = true;

  scene.current?.add(wheelMesh);

  onRender.push(deltaTime => {
    updateWheel(wheelMesh, prevDistance, front, left, deltaTime);
  });
}
