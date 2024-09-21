import { onRender, scene, springLength, wheelRadius } from '../../refs';
import { ref } from '../utils/ref';
import { THREE } from '../utils/THREE';
import { updateWheel } from './updateWheel';

export function initWheel(front: boolean, left: boolean) {
  let prevDistance = ref(springLength.current);

  const wheelMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(wheelRadius, wheelRadius, 0.3, 32),
    new THREE.MeshBasicMaterial({ color: 0x000000 })
  );

  wheelMesh.castShadow = true;

  scene.current?.add(wheelMesh);

  onRender.push(deltaTime => {
    updateWheel(wheelMesh, prevDistance, front, left);
  });
}
