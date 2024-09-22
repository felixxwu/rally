import AmmoType from 'ammojs-typed';
declare const Ammo: typeof AmmoType;

import { physicsWorld, roadMesh, scene } from '../../refs';
import { createShape, Triangle, Vector } from './createShape';
import { createRoadTriangles } from './createRoadTriangles';

export function initRoad() {
  const vecs = [...Array(500)].map(
    (_, i) => [Math.sin(i * 0.07) * 10, Math.sin(i * 0.08) * 5 - 3 + i * 0.2, i * 2 + 50] as Vector
  );

  const triangles = createRoadTriangles(vecs);

  const { rigidBody, mesh } = createShape(triangles);
  scene.current?.add(mesh);
  roadMesh.current = mesh;
  physicsWorld.current?.addRigidBody(rigidBody);
}
