import AmmoType from 'ammojs-typed';
declare const Ammo: typeof AmmoType;

import { THREE } from '../utils/THREE';
import { ref } from '../utils/ref';
import { caches } from '../../refs';

export type Vector = [number, number, number];
export type Triangle = { 0: Vector; 1: Vector; 2: Vector; progress: number };

const ammoVecCache = ref<Record<string, AmmoType.btVector3>>({});
const threeVecCache = ref<Record<string, THREE.Vector3>>({});

caches.push(ammoVecCache);
caches.push(threeVecCache);

export function createRoadShape(triangles: Triangle[], color: string, roughness: number) {
  // const triangleMesh = new Ammo.btTriangleMesh();
  //
  // for (const triangle of triangles) {
  //   const p0 = getFromAmmoCache(triangle[0]);
  //   const p1 = getFromAmmoCache(triangle[1]);
  //   const p2 = getFromAmmoCache(triangle[2]);
  //   try {
  //     triangleMesh.addTriangle(p0, p1, p2);
  //   } catch (e) {
  //     console.log('Error adding triangle to mesh', e, triangle);
  //   }
  // }

  // const shape = new Ammo.btBvhTriangleMeshShape(triangleMesh, true);

  // const transform = new Ammo.btTransform();
  // transform.setIdentity();
  // transform.setOrigin(new Ammo.btVector3(0, 0, 0));
  // const motionState = new Ammo.btDefaultMotionState(transform);
  // const rigidBody = new Ammo.btRigidBody(
  //   new Ammo.btRigidBodyConstructionInfo(0, motionState, shape, new Ammo.btVector3(0, 0, 0))
  // );

  const geom = new THREE.BufferGeometry();

  const points: THREE.Vector3[] = [];
  for (const triangle of triangles) {
    points.push(getFromThreeCache(triangle[0]));
    points.push(getFromThreeCache(triangle[1]));
    points.push(getFromThreeCache(triangle[2]));
  }

  geom.setFromPoints(points);
  geom.computeVertexNormals();

  const groundMaterial = new THREE.MeshStandardMaterial({ color, roughness });

  const mesh = new THREE.Mesh(geom, groundMaterial);

  mesh.receiveShadow = true;
  mesh.castShadow = true;
  mesh.visible = false;

  return { mesh };
}

function getFromAmmoCache(vector: Vector) {
  const stringRep = `${vector[0]},${vector[1]},${vector[2]}`;
  const cached = ammoVecCache.current[stringRep];
  if (cached) {
    return cached;
  } else {
    ammoVecCache.current[stringRep] = new Ammo.btVector3(vector[0], vector[1], vector[2]);
    return ammoVecCache.current[stringRep];
  }
}

function getFromThreeCache(vector: Vector) {
  const stringRep = `${vector[0]},${vector[1]},${vector[2]}`;
  const cached = threeVecCache.current[stringRep];
  if (cached) {
    return cached;
  } else {
    threeVecCache.current[stringRep] = new THREE.Vector3(vector[0], vector[1], vector[2]);
    return threeVecCache.current[stringRep];
  }
}

export function getFromThreeV3Cache(vector: THREE.Vector3) {
  return getFromThreeCache([vector.x, vector.y, vector.z]);
}
