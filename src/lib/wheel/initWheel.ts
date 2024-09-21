import { onRender, scene, springLength, wheelRadius } from '../../constant';
import { ref } from '../utils/ref';
import { THREE } from '../utils/THREE';
import { updateWheel } from './updateWheel';

export function initWheel(front: boolean, left: boolean) {
  let prevDistance = ref(springLength);

  const wheelMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(wheelRadius, wheelRadius, 0.3, 32),
    new THREE.MeshBasicMaterial({ color: 0x000000 })
  );

  scene.current?.add(wheelMesh);

  onRender.push(deltaTime => {
    updateWheel(wheelMesh, prevDistance, front, left);
  });
}
