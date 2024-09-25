import { terrainMesh } from '../../refs';
import { THREE } from './THREE';

const rayCache: Record<string, THREE.Intersection> = {};

export function ray(
  origin: THREE.Vector3,
  direction: THREE.Vector3 | [number, number, number],
  near?: number,
  far?: number
) {
  const rayDirection = Array.isArray(direction)
    ? new THREE.Vector3(...direction)
    : direction.clone();
  rayDirection.normalize();
  const stringRep = getStringRep(origin, rayDirection);

  let intersection: THREE.Intersection;

  if (rayCache[stringRep]) {
    intersection = rayCache[stringRep];
  } else {
    const raycaster = new THREE.Raycaster(origin, rayDirection, near, far);
    const intersections = raycaster.intersectObject(terrainMesh.current!);
    intersection = intersections[0];
    rayCache[stringRep] = intersection;
  }

  return intersection;
}

function getStringRep(origin: THREE.Vector3, direction: THREE.Vector3) {
  return `${origin.toArray().join(',')}-${direction.toArray().join(',')}`;
}