import { car } from '../../refs';
import { terrainMesh } from '../../refs';
import { THREE } from '../utils/THREE';
import { springDamping } from '../../refs';
import { sprintRate } from '../../refs';
import { springLength } from '../../refs';
import { Ref } from '../utils/ref';

export function getSpringForce(
  pos: THREE.Vector3,
  prevDistance: Ref<number>
): [THREE.Vector3, number] {
  if (!terrainMesh.current || !car.current) return [new THREE.Vector3(), 0];

  const raycaster = new THREE.Raycaster();
  raycaster.set(pos, new THREE.Vector3(0, -1, 0));
  const intersections = raycaster.intersectObject(terrainMesh.current, false);
  const distance = intersections[0]?.distance;

  const compression = springLength.current - Math.min(springLength.current, distance);

  if (distance < springLength.current) {
    const distanceDelta = distance - prevDistance.current;
    const velY = distanceDelta * springDamping;
    const damping = Math.max(0, -velY);
    const spring = compression * sprintRate.current;
    prevDistance.current = distance;
    const upForce = new THREE.Vector3(0, damping + spring, 0);
    const quat = car.current?.getWorldQuaternion(new THREE.Quaternion());
    const suspensionForce = upForce.applyQuaternion(quat);

    return [suspensionForce, compression];
  } else {
    return [new THREE.Vector3(0, 0, 0), 0];
  }
}
