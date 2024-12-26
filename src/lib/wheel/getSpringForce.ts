import {
  localGrassLeftMesh,
  localGrassRightMesh,
  localRoadMesh,
  localTerrainMesh,
  platformMesh,
  raycasterOffset,
  selectedCar,
} from '../../refs';
import { THREE } from '../utils/THREE';
import { Ref } from '../utils/ref';
import { getCarDirection } from '../car/getCarDirection';
import { Surface } from '../../types';
import { logRenderTime } from '../render/initRenderer';

const collisionMeshes = [
  { mesh: localTerrainMesh, surface: 'grass' as Surface },
  { mesh: localRoadMesh, surface: 'tarmac' as Surface },
  { mesh: localGrassLeftMesh, surface: 'grass' as Surface },
  { mesh: localGrassRightMesh, surface: 'grass' as Surface },
  { mesh: platformMesh, surface: 'tarmac' as Surface },
];

const defaultReturn = {
  suspensionForce: new THREE.Vector3(),
  compression: 0,
  surface: 'tarmac' as Surface,
};

export function getSpringForce(pos: THREE.Vector3, prevDistance: Ref<number>) {
  const dir = getCarDirection(new THREE.Vector3(0, 1, 0));
  const { springLength, springDamping, springRate } = selectedCar.current;

  const raycaster = new THREE.Raycaster(
    pos.clone().add(dir.multiplyScalar(raycasterOffset)),
    dir.clone().negate()
  );

  let distance = Infinity;
  let normal = new THREE.Vector3(0, 1, 0);

  const now = window.performance.now();
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
  logRenderTime('raycast', now);

  distance -= raycasterOffset;

  const compression = springLength - Math.min(springLength, distance);

  if (distance < springLength) {
    const distanceDelta = distance - prevDistance.current;
    const velY = distanceDelta * springDamping;
    const damping = Math.max(0, -velY);
    const spring = compression * springRate;
    prevDistance.current = distance;
    const upForce = normal.setLength(damping + spring);

    return { suspensionForce: upForce, compression, surface };
  } else {
    return { ...defaultReturn, surface };
  }
}
