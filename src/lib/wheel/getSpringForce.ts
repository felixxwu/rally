import AmmoType from 'ammojs-typed';
declare const Ammo: typeof AmmoType;

import { car, grassLeftMesh, grassRightMesh, roadMesh } from '../../refs';
import { terrainMesh } from '../../refs';
import { THREE } from '../utils/THREE';
import { springDamping } from '../../refs';
import { sprintRate } from '../../refs';
import { springLength } from '../../refs';
import { Ref } from '../utils/ref';
import { getCarDirection } from '../car/getCarDirection';
import { Surface } from '../../types';

export const raycasterOffset = 2;

const collisionMeshes = [
  { mesh: terrainMesh, surface: 'grass' as Surface },
  { mesh: roadMesh, surface: 'tarmac' as Surface },
  { mesh: grassLeftMesh, surface: 'grass' as Surface },
  { mesh: grassRightMesh, surface: 'grass' as Surface },
];

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

  let distance = Infinity;
  let normal = new THREE.Vector3(0, 1, 0);

  let surface: Surface = 'tarmac';
  for (const { mesh, surface: meshSurface } of collisionMeshes) {
    if (!mesh.current) continue;
    const intersections = raycaster.intersectObject(mesh.current, false);
    const newDistance = intersections[0]?.distance ?? Infinity;

    if (newDistance < distance) {
      normal = intersections[0]?.normal || new THREE.Vector3(0, 1, 0);
      surface = meshSurface;
    }
    distance = Math.min(distance, newDistance);
  }

  distance -= raycasterOffset;

  // const terrainIntersections = raycaster.intersectObject(terrainMesh.current, false);
  // const roadIntersections = raycaster.intersectObject(roadMesh.current, false);
  // const terrainDistance = terrainIntersections[0]?.distance ?? Infinity;
  // const roadDistance = roadIntersections[0]?.distance ?? Infinity;

  // if (terrainDistance < roadDistance) {
  //   surface = 'grass';
  // }

  // const distance = Math.min(terrainDistance, roadDistance) - raycasterOffset;

  // const terrainNormal = terrainIntersections[0]?.normal || new THREE.Vector3(0, 1, 0);
  // const roadNormal = roadIntersections[0]?.normal || new THREE.Vector3(0, 1, 0);
  // const normal = surface === 'grass' ? terrainNormal : roadNormal;

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
