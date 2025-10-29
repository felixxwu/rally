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

// Reusable objects to avoid allocations
const raycasterCache = new THREE.Raycaster();
const dirCache = new THREE.Vector3(0, 1, 0);
const normalCache = new THREE.Vector3(0, 1, 0);
const upForceCache = new THREE.Vector3();
const rayOriginCache = new THREE.Vector3();
const rayDirectionCache = new THREE.Vector3();

export function getSpringForce(pos: THREE.Vector3, prevDistance: Ref<number>, deltaTime: number) {
  const dir = getCarDirection(dirCache);
  const { springLength, springDamping, springRate } = selectedCar.current;

  // Reuse raycaster instead of creating new one
  rayOriginCache.copy(dir).multiplyScalar(raycasterOffset).add(pos);
  rayDirectionCache.copy(dir).negate();
  raycasterCache.set(rayOriginCache, rayDirectionCache);

  let distance = Infinity;
  normalCache.set(0, 1, 0);
  let normal = normalCache;

  const now = window.performance.now();
  let surface: Surface = 'tarmac';
  for (const { mesh, surface: meshSurface } of collisionMeshes) {
    if (!mesh.current) continue;
    const intersections = raycasterCache.intersectObject(mesh.current, false);
    const newDistance = intersections[0]?.distance ?? Infinity;

    if (newDistance < distance) {
      const intersectionNormal = intersections[0]?.normal;
      if (intersectionNormal) {
        normal.copy(intersectionNormal);
      } else {
        normal.set(0, 1, 0);
      }
      surface = meshSurface;
    }
    distance = Math.min(distance, newDistance);
  }
  logRenderTime('raycast (wheel)', now);

  distance -= raycasterOffset;

  const compression = springLength - Math.min(springLength, distance);

  if (distance < springLength) {
    const distanceDelta = distance - prevDistance.current;
    // Calculate velocity by dividing distance change by time delta
    const velY = deltaTime > 0 ? distanceDelta / deltaTime : 0;
    // Damping force is proportional to velocity and opposes motion
    const damping = Math.max(0, -velY * springDamping);
    const spring = compression * springRate;
    prevDistance.current = distance;
    upForceCache.copy(normal).setLength(damping + spring);

    return { suspensionForce: upForceCache.clone(), compression, surface };
  } else {
    return { ...defaultReturn, surface };
  }
}
