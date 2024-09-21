import { car } from '../../constant';
import { terrainMesh } from '../../constant';
import { THREE } from '../utils/THREE';
import { springDamping } from '../../constant';
import { sprintRate } from '../../constant';
import { springLength } from '../../constant';

export function getSpringForce(
  pos: THREE.Vector3,
  prevDistance: { current: number }
): [THREE.Vector3, number] {
  if (!terrainMesh.current || !car.current) return [new THREE.Vector3(), 0];

  const raycaster = new THREE.Raycaster();
  raycaster.set(pos, new THREE.Vector3(0, -1, 0));
  const intersections = raycaster.intersectObject(terrainMesh.current, false);
  const distance = intersections[0]?.distance;

  const compression = springLength - Math.min(springLength, distance);

  if (distance < springLength) {
    const distanceDelta = distance - prevDistance.current;
    const velY = distanceDelta * springDamping;
    const damping = Math.max(0, -velY);
    const spring = compression * sprintRate;
    prevDistance.current = distance;
    const upForce = new THREE.Vector3(0, damping + spring, 0);
    const quat = car.current?.getWorldQuaternion(new THREE.Quaternion());
    const suspensionForce = upForce.applyQuaternion(quat);

    return [suspensionForce, compression];
  } else {
    return [new THREE.Vector3(0, 0, 0), 0];
  }
}
