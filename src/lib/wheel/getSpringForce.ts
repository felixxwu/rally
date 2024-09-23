import AmmoType from 'ammojs-typed';
declare const Ammo: typeof AmmoType;

import { car, roadMesh } from '../../refs';
import { terrainMesh } from '../../refs';
import { THREE } from '../utils/THREE';
import { springDamping } from '../../refs';
import { sprintRate } from '../../refs';
import { springLength } from '../../refs';
import { Ref } from '../utils/ref';
import { getCarDirection } from '../car/getCarDirection';

type Surface = 'tarmac' | 'grass';
export const raycasterOffset = 2;

const defaultReturn = {
  suspensionForce: new THREE.Vector3(),
  compression: 0,
  surface: 'tarmac' as Surface,
};

export function getSpringForce(pos: THREE.Vector3, prevDistance: Ref<number>) {
  if (!terrainMesh.current || !car.current || !roadMesh.current) {
    return defaultReturn;
  }

  const dir = getCarDirection(new THREE.Vector3(0, 1, 0));

  const raycaster = new THREE.Raycaster(
    pos.clone().add(dir.multiplyScalar(raycasterOffset)),
    dir.clone().negate()
  );
  const terrainIntersections = raycaster.intersectObject(terrainMesh.current, false);
  const roadIntersections = raycaster.intersectObject(roadMesh.current, false);
  const terrainDistance = terrainIntersections[0]?.distance ?? Infinity;
  const roadDistance = roadIntersections[0]?.distance ?? Infinity;

  let surface: Surface = 'tarmac';
  if (terrainDistance < roadDistance) {
    surface = 'grass';
  }

  const distance = Math.min(terrainDistance, roadDistance) - raycasterOffset;

  const normal = terrainIntersections[0]?.normal || new THREE.Vector3(0, 1, 0);

  const compression = springLength.current - Math.min(springLength.current, distance);

  if (distance < springLength.current) {
    const distanceDelta = distance - prevDistance.current;
    const velY = distanceDelta * springDamping.current;
    const damping = Math.max(0, -velY);
    const spring = compression * sprintRate.current;
    prevDistance.current = distance;
    const upForce = normal.setLength(damping + spring);

    return { suspensionForce: upForce, compression, surface };
  } else {
    return { ...defaultReturn, surface };
  }
}
