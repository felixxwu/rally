import { onRender, scene, springLength, wheelRadius } from '../../constant';
import { ref } from '../utils/ref';
import { THREE } from '../utils/THREE';
import { updateWheel } from './updateWheel';

export function initWheel(front: boolean, left: boolean) {
  let prevDistance = ref(springLength);

  const suspensionArrow = new THREE.ArrowHelper();
  suspensionArrow.setDirection(new THREE.Vector3(0, 1, 0));
  scene.current?.add(suspensionArrow);

  const slipArrow = new THREE.ArrowHelper();
  slipArrow.setColor('black');
  scene.current?.add(slipArrow);

  const straightArrow = new THREE.ArrowHelper();
  straightArrow.setColor('red');
  scene.current?.add(straightArrow);

  const wheelMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(wheelRadius, wheelRadius, 0.3, 32),
    new THREE.MeshBasicMaterial({ color: 0x000000 })
  );

  scene.current?.add(wheelMesh);

  onRender.push(deltaTime => {
    updateWheel(
      deltaTime,
      wheelMesh,
      suspensionArrow,
      slipArrow,
      straightArrow,
      prevDistance,
      front,
      left
    );
  });
}
